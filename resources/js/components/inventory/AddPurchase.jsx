import React from "react";
import {
    Typography,
    TextField,
    Box,
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddPurchase() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        getItem();
    }, []);

    const getItem = async () => {
        await axios
            .get(`/api/get-item/${id}`)
            .then(({ data }) => {
                //console.log('data',data)
                const { name, image, measurement, price } = data.item;
                setItemName(name);
                setImage(image);
                setMeasurement(measurement);
                setPrice(price);
            })
            .catch(({ response: { data } }) => {});
    };

    const [name, setItemName] = useState("");
    const [image, setImage] = useState(null);
    const [measurement, setMeasurement] = React.useState("");
    const [photo, setPhoto] = useState(true);
    const [price, setPrice] = useState("");

    const ourImage = (img) => {
        return "/upload/" + img;
    };

    const [addPurchase, setAddPurchase] = useState(0);

    const addQuantity = () => {
        setAddPurchase((prevValue) => {
            const newValue = parseInt(prevValue) + 1;
            return isNaN(newValue) ? 1 : newValue;
        });
    };

    const subQuantity = () => {
        setAddPurchase((prevValue) => parseInt(prevValue) - 1);
    };


    const [addPrice, setAddPrice] = useState(0);

    const addAmount = () => {
        setAddPrice((prevValue) => {
            const newValue = parseInt(prevValue) + 1;
            return isNaN(newValue) ? 1 : newValue;
        });
    };

    const subAmount = () => {
        setAddPrice((prevValue) => parseInt(prevValue) - 1);
    };

    const add_Purchase = async () => {
        const formData = new FormData();

        formData.append("addPurchase", addPurchase);
        formData.append("addPrice", addPrice);

        await axios
            .post(`/api/add-purchase/${id}`, formData)
            .then(({ data }) => {
                toast.fire({
                    icon: "success",
                    title: "Purchase added successfully",
                });
            })
            .catch((error) => {});
        navigate("/")
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }} textAlign="center" marginTop="20px">
                

                <Box border={2} borderColor="black" padding={5} margin="10px">
                    <Grid
                        alignItems="center"
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid item xs={12} sm={4} md={4}>
                            <Grid
                                container
                                direction="column"
                                alignItems="center"
                            >
                                <Grid item>
                                    {photo === true ? (
                                        <img
                                            src={ourImage(image)}
                                            width="125px"
                                            height="100px"
                                            border={2}
                                            onClick={handleClickOpen}
                                        ></img>
                                    ) : (
                                        <img
                                            src={image}
                                            width="125px"
                                            height="100px"
                                            border={2}
                                            onClick={handleClickOpen}
                                        ></img>
                                    )}
                                    <Typography variant="h6">{name}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography variant="h6">
                                New Price
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "10px",
                                }}
                            >
                                <TextField
                                    id="filled-basic"
                                    size="small"
                                    variant="filled"
                                    value={addPrice}
                                    onChange={(e) => setAddPrice(e.target.value)}
                                    style={{
                                        width: "80px",
                                        marginRight: "10px",
                                    }}
                                />

                                <Button
                                    variant="outlined"
                                    onClick={addAmount}
                                    style={{
                                        width: "30px",
                                        marginRight: "10px",
                                    }}
                                >
                                    +
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={subAmount}
                                    style={{ width: "30px" }}
                                >
                                    -
                                </Button>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "10px",
                                }}
                            >
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            <Typography variant="h6">
                                Add Item
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "10px",
                                }}
                            >
                                <TextField
                                    id="filled-basic"
                                    size="small"
                                    variant="filled"
                                    value={addPurchase}
                                    onChange={(e) => setAddPurchase(e.target.value)}
                                    style={{
                                        width: "80px",
                                        marginRight: "10px",
                                    }}
                                />

                                <Button
                                    variant="outlined"
                                    onClick={addQuantity}
                                    style={{
                                        width: "30px",
                                        marginRight: "10px",
                                    }}
                                >
                                    +
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={subQuantity}
                                    style={{ width: "30px" }}
                                >
                                    -
                                </Button>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "10px",
                                }}
                            >
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                        <Button variant="contained" onClick={add_Purchase}>
                                    <Typography variant="h5" textAlign="center">
                                        Add Purchase
                                    </Typography>
                                </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    {photo === true ? (
                        <img
                            src={ourImage(image)}
                            width="100%"
                            height="100%"
                            border={2}
                            onClick={handleClose}
                        ></img>
                    ) : (
                        <img
                            src={image}
                            width="100%"
                            height="100%"
                            border={2}
                            onClick={handleClose}
                        ></img>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
