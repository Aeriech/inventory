import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Box,
    Autocomplete,
    Grid,
    Typography,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PurchaseComponent = () => {
    const [purchases, setPurchases] = useState([]);
    const [updatedPurchases, setUpdatedPurchases] = useState([]); // Added state for updated purchases
    const [errors, setErrors] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        // Fetch data from the Laravel backend
        fetch(`/api/get-purchase/${id}`) // Replace with your actual API endpoint
            .then((response) => response.json())
            .then((data) => {
                setPurchases(data);
                setUpdatedPurchases([...data]); // Initialize updated purchases with the fetched data
            })
            .catch((error) => console.error(error));
    }, []);

    // Function to handle updates to purchase data
    const handlePurchaseUpdate = (index, field, value) => {
        const updatedPurchase = { ...updatedPurchases[index], [field]: value };
        const updatedPurchaseList = [...updatedPurchases];
        updatedPurchaseList[index] = updatedPurchase;
        setUpdatedPurchases(updatedPurchaseList);
    };

    const navigate = useNavigate();

    const savePurchaseUpdates = (event) => {
        event.preventDefault();
        axios
            .post(`/api/update-purchases`, { updatedPurchases })
            .then((response) => {
                toast.fire({
                    icon: "success",
                    title: "New purchase added successfully",
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

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div>
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
                        Complete Purchase
                    </Typography>
                    <div>
                        <Button
                            variant="outlined"
                            onClick={savePurchaseUpdates}
                            disabled={purchases.length === 0}
                        >
                            <Typography variant="h6">SUBMIT</Typography>
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
                        {purchases.map((purchase, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <Typography>
                                        {purchase.name}
                                    </Typography>
                                    <Typography>
                                        Item Request:{" "}
                                        {purchase.measured_in}{" "}
                                        {purchase.measurement}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                                    <TextField
                                        label="Price"
                                        variant="outlined"
                                        name="price"
                                        value={
                                            updatedPurchases[index].price || ""
                                        }
                                        fullWidth
                                        onChange={(e) =>
                                            handlePurchaseUpdate(
                                                index,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                                    <TextField
                                        label="Item Bought"
                                        variant="outlined"
                                        name="itemAdded"
                                        value={
                                            updatedPurchases[index].itemAdded ||
                                            ""
                                        }
                                        fullWidth
                                        onChange={(e) =>
                                            handlePurchaseUpdate(
                                                index,
                                                "itemAdded",
                                                e.target.value
                                            )
                                        }
                                    />
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Typography variant="h4">Select Supplier</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                            <div style={{ textAlign: "center" }}>
                                <h3>Purchased On</h3>
                                <div style={{ display: "inline-block" }}>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="MMMM dd, yyyy" // Set the desired date format
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                            <Button variant="contained">Add Receipt </Button>
                        </Grid>
                    </Grid>
                </Box>

                                        

                <Button
                    variant="contained"
                    color="success"
                    onClick={savePurchaseUpdates}
                    style={{ marginTop: "16px" }}
                    fullWidth
                >
                    Submit
                </Button>
            </Box>
        </div>
    );
};

export default PurchaseComponent;
