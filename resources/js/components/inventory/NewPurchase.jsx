import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Autocomplete, Grid, Typography } from "@mui/material";

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
            .post("/api/purchases", { purchases })
            .then((response) => {
                console.log(response.data.message);
                setPurchases([{ name: "", measurement: "" }]);
                toast.fire({
                  icon:"success",
                  title: "New purchase added successfully",   
                });
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    const handleSearchChange = (event, value) => {
        setSearchValue(value);
    };

    return (
        <Box sx={{ marginTop: 1, textAlign: "center", padding: "10px" }}>
          <Typography variant="h4"> New Purchase </Typography>
          <Box sx={{ border: "2px solid black", borderRadius: "5px", p: "10px", width: "100%", height: "100%", marginBottom: "10px", marginTop: "10px"}}>
            <Grid container spacing={2}>
                {purchases.map((purchase, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Autocomplete
                                options={filteredOptions}
                                value={purchase.name}
                                onChange={(event, value) =>
                                    handleInputChange(
                                        {
                                            target: {
                                                name: "name",
                                                value: value,
                                            },
                                        },
                                        index
                                    )
                                }
                                onInputChange={handleSearchChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Name"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <TextField
                                label="Measurement"
                                name="measurement"
                                value={purchase.measurement}
                                onChange={(event) =>
                                    handleInputChange(event, index)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRemovePurchase(index)}
                                fullWidth
                            >
                                Remove Item
                            </Button>
                        </Grid>
                    </React.Fragment>
                ))}
                </Grid>
                </Box>
                <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddPurchase}
                        fullWidth
                    >
                        Add Item
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PurchaseForm;
