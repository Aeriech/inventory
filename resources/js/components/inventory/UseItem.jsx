import React from "react";
import {
    Typography,
    TextField,
    Box,
    Grid,
    Button,
    Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UseItem() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [items, setPurchases] = useState([{ name: "", measurement: "" }]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get("/api/items");
            const options = response.data.map((item) => item.name);
            setFilteredOptions(options);
        }

        fetchData();
    }, []);

    const handleAddPurchase = () => {
        setPurchases([...items, { name: "", measurement: "" }]);
    };

    const handleRemovePurchase = (index) => {
        const removedOption = selectedOptions[index];
        if (removedOption) {
            // Add the removed option back to the filteredOptions list
            const updatedFilteredOptions = [...filteredOptions, removedOption];
            setFilteredOptions(updatedFilteredOptions);
        }

        const newPurchases = [...items];
        newPurchases.splice(index, 1);
        setPurchases(newPurchases);

        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions.splice(index, 1);
        setSelectedOptions(updatedSelectedOptions);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const newPurchases = [...items];
        newPurchases[index][name] = value;
        setPurchases(newPurchases);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("/api/use-item", { items })
            .then((response) => {
                setPurchases([{ name: "", measurement: "" }]);
                toast.fire({
                    icon: "success",
                    title: "Item used successfully",
                });
                navigate("/");
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else {
                    // handle other errors here
                }
            });
    };

    const handleNameChange = (event, value, index) => {
        // Check if the selected value is not null, which means the user has selected an option
        if (value !== null) {
            const selectedItem = filteredOptions.find(
                (option) => option === value
            );

            if (selectedItem) {
                // Remove the selected item from filteredOptions
                const updatedFilteredOptions = filteredOptions.filter(
                    (option) => option !== selectedItem
                );
                setFilteredOptions(updatedFilteredOptions);

                // Update the selectedOptions with the selected item
                const updatedSelectedOptions = [...selectedOptions];
                updatedSelectedOptions[index] = selectedItem;
                setSelectedOptions(updatedSelectedOptions);

                // Fetch the item from the database based on the selected name
                axios
                    .get(`/api/items/${selectedItem}`)
                    .then((response) => {
                        // Update the label of the Measurement TextField with the measurement unit
                        const measurementUnit = response.data.measured_in;
                        const item_id = response.data.id;
                        const item_price = response.data.price;
                        const item_left = response.data.item_left;
                        const newPurchases = [...items];
                        newPurchases[index].name = selectedItem;
                        newPurchases[index].measurement = "";
                        newPurchases[index].measurementUnit = measurementUnit; // Add the measurement unit to the purchase object
                        newPurchases[index].item_id = item_id; // Add the item id to the purchase object
                        newPurchases[index].item_price = item_price;
                        newPurchases[index].item_left = item_left; // Add the item left to the purchase object
                        setPurchases(newPurchases);
                    })
                    .catch((error) => {
                        console.log(error.response.data.message);
                    });
            } else {
                const newPurchases = [...items];
                newPurchases[index].name = value;
                newPurchases[index].measurement = "";
                setPurchases(newPurchases);
            }
            setSearchValue(value);
        } else {
            // If the value is null, which means the user unselected the option
            // Add the unselected option back to the filteredOptions list
            const unselectedOption = items[index].name;
            const updatedFilteredOptions = [
                ...filteredOptions,
                unselectedOption,
            ];
            setFilteredOptions(updatedFilteredOptions);

            // Update the selectedOptions with an empty value
            const updatedSelectedOptions = [...selectedOptions];
            updatedSelectedOptions[index] = "";
            setSelectedOptions(updatedSelectedOptions);

            // Update the purchase object with an empty value for the name
            const newPurchases = [...items];
            newPurchases[index].name = "";
            setPurchases(newPurchases);
        }
    };

    const handleMeasurementChange = (event, index) => {
        const { name, value } = event.target;
        handleInputChange(
            {
                target: {
                    name: name,
                    value: value,
                },
            },
            index
        );
    };

    const handleBack = () => {
        navigate("/");
    };

    const [errors, setErrors] = useState(null);

    return (
        <div>
            <Box sx={{ flexGrow: 1 }} textAlign="center" marginTop="20px">
                <Box
                    sx={{ marginTop: 1, textAlign: "center", padding: "10px" }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginRight: "15px",
                            marginLeft: "15px",
                        }}
                    >
                        <Typography variant="h5" textAlign="left">
                            Use Items
                        </Typography>
                        <div>
                            <Button
                                size="large"
                                variant="outlined"
                                onClick={handleBack}
                            >
                                <Typography variant="h6">BACK</Typography>
                            </Button>
                            <Button
                                                            size="large"
                                variant="outlined"
                                onClick={handleSubmit}
                                disabled={items.length === 0}
                            >
                                <Typography variant="h6">SAVE</Typography>
                            </Button>
                        </div>
                    </div>
                    <Box marginTop="10px">
                        {errors && (
                            <div className="alert alert-danger">
                                <ul>
                                    {Object.values(errors).map(
                                        (messages, index) => (
                                            <li key={index}>{messages[0]}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </Box>
                    <Box
                        sx={{
                            border: "2px solid black",
                            borderRadius: "5px",
                            p: "10px",
                            width: "100%",
                            height: "100%",
                            marginBottom: "10px",
                            marginTop: "10px",
                        }}
                    >
                        <Grid container spacing={2}>
                            {items.map((purchase, index) => (
                                <React.Fragment key={index}>
                                    <Grid
                                        item
                                        xs={6}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                    >
                                        <Autocomplete
                                            options={filteredOptions}
                                            value={purchase.name}
                                            onChange={(event, value) =>
                                                handleNameChange(
                                                    event,
                                                    value,
                                                    index
                                                )
                                            }
                                            onInputChange={(event, value) =>
                                                setSearchValue(value)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Item Name"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                    >
                                        <TextField
                                            label={
                                                purchase.measurementUnit &&
                                                purchase.item_left // check if measurementUnit and item_left are truthy
                                                    ? `${purchase.measurementUnit}=${purchase.item_left}` // show measurementUnit and item_left if available
                                                    : "Measurement" // otherwise, show "Measurement"
                                            }
                                            variant="outlined"
                                            name="measurement"
                                            value={purchase.measurement}
                                            fullWidth
                                            onChange={(event) =>
                                                handleMeasurementChange(
                                                    event,
                                                    index
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                    >
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() =>
                                                handleRemovePurchase(index)
                                            }
                                            style={{ marginTop: "10px" }}
                                            disabled={items.length === 1}
                                            fullWidth
                                        >
                                            Remove
                                        </Button>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddPurchase}
                            style={{ marginTop: "16px" }}
                            fullWidth
                        >
                            Add Use Item
                        </Button>
                    </Box>

                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        style={{ marginTop: "16px" }}
                        disabled={items.length === 0}
                        fullWidth
                    >
                        SAVE
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
