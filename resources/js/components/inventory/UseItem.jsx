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

export default function UseItem() {
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
                const { name, image, type, measurement, price } = data.item;
                setItemName(name);
                setImage(image);
                setMeasurement(measurement);
            })
            .catch(({ response: { data } }) => {});
    };

    const [name, setItemName] = useState("");
    const [image, setImage] = useState(null);
    const [measurement, setMeasurement] = React.useState("");
    const [photo, setPhoto] = useState(true);

    const ourImage = (img) => {
        return "/upload/" + img;
    };

    const [useItem, setUseItem] = useState(0);

    const add = () => {
        setUseItem((prevValue) => {
            const newValue = parseInt(prevValue) + 1;
            return isNaN(newValue) ? 1 : newValue;
        });
    };

    const sub = () => {
        setUseItem((prevValue) => parseInt(prevValue) - 1);
    };

    const use_Item = async () => {
        const formData = new FormData();

        formData.append("useItem", useItem);

        await axios
            .post(`/api/use-item/${id}`, formData)
            .then(({ data }) => {
                toast.fire({
                    icon: "success",
                    title: "Item updated successfully",
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
                        <Grid item xs={12} sm={12} md={12}>
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
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography variant="h5">{name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography variant="h5">
                                Qty: {measurement}
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
                                    value={useItem}
                                    onChange={(e) => setUseItem(e.target.value)}
                                    style={{
                                        width: "80px",
                                        marginRight: "10px",
                                    }}
                                />

                                <Button
                                    variant="outlined"
                                    onClick={add}
                                    style={{
                                        width: "30px",
                                        marginRight: "10px",
                                    }}
                                >
                                    +
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={sub}
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
                                <Button variant="contained" onClick={use_Item}>
                                    <Typography variant="h5" textAlign="center">
                                        Use Item
                                    </Typography>
                                </Button>
                            </div>
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
