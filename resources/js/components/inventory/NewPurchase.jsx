import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        setPurchases([...purchases, { name: "", measurement: "" }]);
    };

    const handleRemovePurchase = (index) => {
        const removedOption = selectedOptions[index];
        if (removedOption) {
            // Add the removed option back to the filteredOptions list
            const updatedFilteredOptions = [...filteredOptions, removedOption];
            setFilteredOptions(updatedFilteredOptions);
        }

        const newPurchases = [...purchases];
        newPurchases.splice(index, 1);
        setPurchases(newPurchases);

        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions.splice(index, 1);
        setSelectedOptions(updatedSelectedOptions);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const newPurchases = [...purchases];
        newPurchases[index][name] = value;
        setPurchases(newPurchases);
    };

    const navigate = useNavigate();
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
                navigate("/view-purchases");
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    const handleNameChange = (event, value, index) => {
        // Check if the selected value is not null, which means the user has selected an option
        if (value !== null) {
          const selectedItem = filteredOptions.find((option) => option === value);
      
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
                const item_left = response.data.item_left;
                const newPurchases = [...purchases];
                newPurchases[index].name = selectedItem;
                newPurchases[index].measurement = "";
                newPurchases[index].measurementUnit = measurementUnit; // Add the measurement unit to the purchase object
                newPurchases[index].item_id = item_id; // Add the item id to the purchase object
                newPurchases[index].item_left = item_left; // Add the item left to the purchase object
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
        } else {
          // If the value is null, which means the user unselected the option
          // Add the unselected option back to the filteredOptions list
          const unselectedOption = purchases[index].name;
          const updatedFilteredOptions = [...filteredOptions, unselectedOption];
          setFilteredOptions(updatedFilteredOptions);
      
          // Update the selectedOptions with an empty value
          const updatedSelectedOptions = [...selectedOptions];
          updatedSelectedOptions[index] = "";
          setSelectedOptions(updatedSelectedOptions);
      
          // Update the purchase object with an empty value for the name
          const newPurchases = [...purchases];
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
                                            label="Item Name"
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
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
                                    disabled={purchases.length === 1}
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
