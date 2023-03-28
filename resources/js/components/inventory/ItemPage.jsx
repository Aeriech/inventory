import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import {
    Grid,
    AppBar,
    Box,
    Toolbar,
    Typography,
    InputBase,
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

export default function ItemPage() {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        viewItems();
    }, []);

    const viewItems = async () => {
        const { data } = await axios.get("/api/view-items");
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

    const editItem = (id) => {
        navigate("/get-item/" + id);
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
                        View Items
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
                    {filteredItems.map((item) => (
                        <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            lg={2}
                            xl={2}
                            key={item}
                            onClick={() => editItem(item.id)}
                            textAlign="center"
                            alignContent="center"
                            alignItems="center"
                            sx={{ border: "1px solid #ccc", padding: "1rem",
                            "&:hover": {cursor: "pointer"}
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
        </Box>
    );
}
