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
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddMeasurement() {
    const navigate = useNavigate();

    const [measurement, setMeasurement] = React.useState("");

    const createMeasurement = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("measurement", measurement);

        try {
            const { data } = await axios.post("/api/add-measurement", formData);
            toast.fire({
                icon: "success",
                title: "Measurement added successfully",
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
                        Add Measurement
                    </Typography>

                    <div>
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={handleBack}
                        >
                            <Typography variant="h6">HOME</Typography>
                        </Button>
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={(event) => createMeasurement(event)}
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
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography variant="h5">Measurement</Typography>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                value={measurement}
                                onChange={(e) => setMeasurement(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
}
