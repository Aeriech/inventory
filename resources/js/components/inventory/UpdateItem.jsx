import React from "react";
import {
    Typography,
    TextField,
    Box,
    Grid,
    MenuItem,
    FormControl,
    Select,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateItem() {
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
        try {
            const { data } = await axios.get(`/api/get-item/${id}`);
            const { name, image, type, measurement, price, measured_in } =
                data.item;
            setCategory(type);
            setItemName(name);
            setImage(image);
            setMeasurement(measurement);
            setMeasure(measured_in);
            setPrice(price);
        } catch ({ response: { data } }) {
            // handle error
        }
    };

    const [name, setItemName] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [category, setCategory] = React.useState("");
    const [measure, setMeasure] = React.useState("");
    const [measurement, setMeasurement] = React.useState("");
    const [photo, setPhoto] = useState(true);

    const handleCategory = (event) => {
        setCategory(event.target.value);
    };

    const handleMeasure = (event) => {
        setMeasure(event.target.value);
    };

    const changeHandler = (e) => {
        let file = e.target.files[0];
        let limit = 1024 * 1024 * 10;
        if (file["size"] > limit) {
            toast.fire({
                type: "error",
                title: "Oops...",
                text: "Image size is above 10mb",
            });
        } else {
            let reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(false);
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateItem = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", name);
        formData.append("image", image);
        formData.append("category", category);
        formData.append("measurement", measurement);
        formData.append("measure", measure);
        formData.append("price", price);

        try {
            const { data } = await axios.post(
                `/api/update-item/${id}`,
                formData
            );
            toast.fire({
                icon: "success",
                title: "Item updated successfully",
            });
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                // handle other errors here
            }
        }
    };

    const [errors, setErrors] = useState(null);

    const ourImage = (img) => {
        return "/upload/" + img;
    };

    const handleArchive = async () => {
        try {
            const { data } = await axios.post(`/api/archive-item/${id}`);
            toast.fire({
                icon: "success",
                title: "Item archived successfully",
            });
            navigate("/view-archives");
        } catch ({ error }) {
            // handle error
        }
    };

    useEffect(() => {
        viewCategory();
    }, []);

    const [subCategory, setSubCategory] = useState([]);

    const viewCategory = async () => {
        const { data } = await axios.get(`/api/view-category`);

        setSubCategory(data.categories);
    };

    useEffect(() => {
        viewMeasurement();
    }, []);

    const [measurements, setMeasurements] = useState([]);

    const viewMeasurement = async () => {
        const { data } = await axios.get(`/api/view-measurement`);

        setMeasurements(data.measurements);
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1 }} textAlign="center" marginTop="20px">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: "15px",
                        marginLeft: "15px",
                    }}
                >
                    <Typography variant="h4" style={{ textAlign: "left" }}>
                        Update Item
                    </Typography>

                    <div>
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={handleBack}                        >
                            <Typography variant="h6">BACK</Typography>
                        </Button>
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={(e) => updateItem(e)}
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

                <Box border={2} borderColor="black" padding={5} margin="10px">
                    <Grid
                        alignItems="center"
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                        <Grid item xs={2} sm={4} md={4}>
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
                                <Grid item>
                                    <form className="image_item-form">
                                        <label className="image_item-form--label">
                                            Add Image
                                        </label>
                                        <input
                                            type="file"
                                            className="image_item-form--input"
                                            onChange={changeHandler}
                                        />
                                    </form>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4}>
                            <Typography variant="h5">Item Name</Typography>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                value={name}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={4}>
                            <Typography variant="h5">Category</Typography>
                            <FormControl
                                variant="filled"
                                sx={{ m: 1, minWidth: 120 }}
                            >
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={category}
                                    onChange={handleCategory}
                                >
                                    {subCategory.map((category, index) => (
                                        <MenuItem
                                            key={index}
                                            value={category.category}
                                        >
                                            {category.category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4}>
                            <Typography variant="h5">Price</Typography>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={2} sm={4} md={4}>
                            <Typography variant="h5">Measured in</Typography>
                            <FormControl
                                variant="filled"
                                sx={{ m: 1, minWidth: 120 }}
                            >
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={measure}
                                    onChange={handleMeasure}
                                >
                                    {measurements.map((measures, index) => (
                                        <MenuItem
                                            key={index}
                                            value={measures.measurement}
                                        >
                                            {measures.measurement}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={2} sm={4} md={4}>
                            <Typography variant="h5">{measure}</Typography>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                value={measurement}
                                onChange={(e) => setMeasurement(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleArchive}
                                startIcon={<Delete />}
                            >
                                <Typography variant="body2">
                                    Archive Item
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
