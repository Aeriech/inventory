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
    const [receipts, setReciepts] = useState([]);

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
            .post(`/api/update-purchases`, { updatedPurchases, receipts, selectedDate })
            .then((response) => {
                toast.fire({
                    icon: "success",
                    title: "Purchase updated successfully",
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

    const handleAddPurchase = () => {
        setReciepts([...receipts, {image: null, supplier: "", description: "", amount: ""}]);
    };

    const handleRecieptUpdate = (index, field, value) => {
        const updatedReciept = {
            ...receipts[index],
            [field]: value,
        };
        const updatedRecieptList = [...receipts];
        updatedRecieptList[index] = updatedReciept;
        setReciepts(updatedRecieptList);
    };

    const changeHandler = (index, field, e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        let limit = 1024 * 1024 * 10;
        if (file["size"] > limit) {
            toast.fire({
                type: "error",
                title: "Oops...",
                text: "Image size is above 10mb",
            });
        }
        reader.onloadend = () => {
            const value = reader.result;
            const updatedReciept = {
                ...receipts[index],
                [field]: value,
            };
            const updatedRecieptList = [...receipts];
            updatedRecieptList[index] = updatedReciept;
            setReciepts(updatedRecieptList);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = (index) => {
        const updatedRecieptsList = [...receipts];
    updatedRecieptsList.splice(index, 1);
    setReciepts(updatedRecieptsList);
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
                                    <Typography>{purchase.name}</Typography>
                                    <Typography>
                                        Item Request: {purchase.measured_in}{" "}
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
                            <Typography variant="h4">
                                Select Supplier
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                            <div style={{ textAlign: "center" }}>
                                <h3>Purchased On</h3>
                                <div style={{ display: "inline-block" }}>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="MMMM dd, yyyy" // Set the desired date format
                                        withPortal // Use the withPortal prop to render the calendar in a portal
                                    />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
                            <Button
                                variant="contained"
                                onClick={handleAddPurchase}
                            >
                                Add Receipt{" "}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {receipts != 0 &&
                <Typography variant="h5" textAlign="left" marginTop="20px">
                    Reciepts
                </Typography>
                }
                {receipts.map((receipt, index) => (
    <Box key={index} padding={1} border={2} borderRadius={1} marginTop={1}>
        <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>

            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                <img
                    src={receipt.image}
                    width="150px"
                    height="150px"
                    style={{ border: "2px solid black" }} // Add style property for border
                />
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                <form className="image_item-form">
                    <label className="image_item-form--label">Add Image</label>
                    <input
                        type="file"
                        className="image_item-form--input"
                        onChange={(e) =>
                            changeHandler(index, "image", e) // Pass the entire event object instead of e.target.value
                        }
                    />
                </form>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                <TextField
                    label="Supplier(Optional)"
                    variant="outlined"
                    value={receipt.supplier}
                    onChange={(e) => handleRecieptUpdate(index, "supplier", e.target.value)}
                ></TextField>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                <TextField
                    label="Description(Optional)"
                    variant="outlined"
                    value={receipt.description}
                    onChange={(e) => handleRecieptUpdate(index, "description", e.target.value)}
                ></TextField>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                <TextField
                    label="Amount"
                    variant="outlined"
                    value={receipt.amount}
                    onChange={(e) => handleRecieptUpdate(index, "amount", e.target.value)}
                ></TextField>
            </Grid>

            <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                <Button
                    variant="contained"
                    size="small"
                    color="error"
                    fullWidth
                    onClick={() => handleRemove(index)}
                >
                    Remove
                </Button>
            </Grid>
        </Grid>
    </Box>
))}

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
