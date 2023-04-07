import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Box,
    Autocomplete,
    Grid,
    Typography,
} from "@mui/material";

function PurchaseForm() {
    const [purchases, setPurchases] = useState([{ name: "", measurement: "" }]);
    const [searchValue, setSearchValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get("/api/items");
            const options = response.data.map((item) => item.name);
            setFilteredOptions(options);
        }

        fetchData();
    }, []);

    const handleAddPurchase = () => {
        setPurchases([...purchases, { name: "", measurement: "" }]);
    };

    const handleRemovePurchase = (index) => {
        const newPurchases = [...purchases];
        newPurchases.splice(index, 1);
        setPurchases(newPurchases);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const newPurchases = [...purchases];
        newPurchases[index][name] = value;
        setPurchases(newPurchases);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("/api/new-purchase", { purchases })
            .then((response) => {
                console.log(response.data.message);
                setPurchases([{ name: "", measurement: "" }]);
                toast.fire({
                    icon: "success",
                    title: "New purchase added successfully",
                });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    const handleNameChange = (event, value, index) => {
        const selectedItem = filteredOptions.find((option) => option === value);

        if (selectedItem) {
            // Fetch the item from the database based on the selected name
            axios
                .get(`/api/items/${selectedItem}`)
                .then((response) => {
                    // Update the label of the Measurement TextField with the measurement unit
                    const measurementUnit = response.data.measured_in;
                    const newPurchases = [...purchases];
                    newPurchases[index].name = selectedItem;
                    newPurchases[index].measurement = "";
                    newPurchases[index].measurementUnit = measurementUnit; // Add the measurement unit to the purchase object
                    setPurchases(newPurchases);
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                });
        } else {
            const newPurchases = [...purchases];
            newPurchases[index].name = value;
            newPurchases[index].measurement = "";
            setPurchases(newPurchases);
        }
        setSearchValue(value);
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

    return (
        <Box sx={{ marginTop: 1, textAlign: "center", padding: "10px" }}>
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
                    New Purchase Request
                </Typography>

                <div>
                    <Button
                        variant="outlined"
                        onClick={handleSubmit}
                        disabled={purchases.length === 0}
                    >
                        <Typography variant="h6">SUBMIT</Typography>
                    </Button>
                </div>
            </div>
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
                    {purchases.map((purchase, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                                <Autocomplete
                                    options={filteredOptions}
                                    value={purchase.name}
                                    onChange={(event, value) =>
                                        handleNameChange(event, value, index)
                                    }
                                    onInputChange={(event, value) =>
                                        setSearchValue(value)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Name"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                                <TextField
                                    label={`(${
                                        purchase.measurementUnit ||
                                        "Measurement "
                                    })`}
                                    variant="outlined"
                                    name="measurement"
                                    value={purchase.measurement}
                                    fullWidth
                                    onChange={(event) =>
                                        handleMeasurementChange(event, index)
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleRemovePurchase(index)}
                                    style={{ marginTop: "10px" }}
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
                    Add Purchase
                </Button>
            </Box>

            <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                style={{ marginTop: "16px" }}
                disabled={purchases.length === 0}
                fullWidth
            >
                Submit
            </Button>
        </Box>
    );
}

export default PurchaseForm;
