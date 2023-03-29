import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import {
    Grid,
    AppBar,
    Box,
    Toolbar,
    Typography,
    InputBase, Button
    , Dialog, DialogActions, DialogContent
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "50%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

export default function ViewArchives() {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        viewItems();
    }, []);

    const viewItems = async () => {
        const { data } = await axios.get("/api/view-archives");
        setItems(data.items);
    };

    const filteredItems = items.filter((item) => {
        const lowerCasedQuery = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(lowerCasedQuery) ||
            item.type.toLowerCase().includes(lowerCasedQuery)
        );
    });

    const navigate = useNavigate();

    const handleArchive = async (id) => {
        await axios
            .post(`/api/unarchive-item/${id}`)
            .then(({ data }) => {
                toast.fire({
                    icon: "success",
                    title: "Item unarchived successfully",
                });
                navigate("/");
            })
            .catch((error) => {});
    };
    const [open, setOpen] = React.useState(false);
    const [id, setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("");
    const [measurement, setMeasurement] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [image, setImage] = React.useState("");


    const handleClick = (id, name, type, measurement, price, image) => {
        setID(id)
        setName(name)
        setType(type)
        setMeasurement(measurement)
        setPrice(price)
        setImage(image)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        View Archives
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                        />
                    </Search>
                </Toolbar>
            </AppBar>

            <Box sx={{ marginTop: 5 }}>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {filteredItems.map((item, index) => (
                        <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            lg={2}
                            xl={2}
                            key={index}
                            onClick={() => handleClick(item.id, item.name, item.type, item.measurement, item.price, item.image)}
                            textAlign="center"
                            alignContent="center"
                            alignItems="center"
                            sx={{
                                border: "1px solid #ccc",
                                padding: "1rem",
                                "&:hover": { cursor: "pointer" },
                            }}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(/upload/${item.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "120px",
                                    borderRadius: "5px",
                                }}
                            />
                            <Typography variant="subtitle1">
                                {item.name}
                            </Typography>
                            <Typography variant="body2">{item.type}</Typography>
                            <Typography variant="body2">
                                Prc: {item.price}
                            </Typography>
                            <Typography variant="body2">
                                Qty: {item.measurement}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <div
                        style={{
                            backgroundImage: `url(/upload/${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "200px",
                            height: "200px",
                            borderRadius: "5px",
                        }}
                    />
                    <Typography textAlign="center" variant="h6">{name}</Typography>
                    <Typography textAlign="center" variant="h6">{type}</Typography>
                    <Typography textAlign="center" variant="h6">Prc: {price}</Typography>
                    <Typography textAlign="center" variant="h6">
                        Qty: {measurement}
                    </Typography>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>handleArchive(id)}>Unarchive</Button>
                    <Button onClick={handleClose}>Back</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}