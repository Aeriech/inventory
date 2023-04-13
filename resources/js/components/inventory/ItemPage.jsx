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
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Pagination,
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
    const [sortOption, setSortOption] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [listView, setListView] = useState("image");
    const [category, setCategory] = useState("All Item");

    const dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `/api/view-items?page=${currentPage}&category=${category}`
            );
            setItems(response.data.data);
            setLastPage(response.data.last_page);
        }

        fetchData();
    }, [currentPage, category]);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const filteredItems = items
        .filter((item) => {
            const lowerCasedQuery = searchQuery.toLowerCase();
            return (
                item.updated_at.toLowerCase().includes(lowerCasedQuery) ||
                item.name.toLowerCase().includes(lowerCasedQuery) ||
                item.type.toLowerCase().includes(lowerCasedQuery)
            );
        })
        .sort((a, b) => {
            if (sortOption === "date") {
                const dateA = new Date(a.updated_at);
                const dateB = new Date(b.updated_at);
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            } else if (sortOption === "price") {
                return sortDirection === "asc"
                    ? a.price - b.price
                    : b.price - a.price;
            } else if (sortOption === "id") {
                return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
            } else if (sortOption === "measurement") {
                return sortDirection === "asc"
                    ? a.measurement - b.measurement
                    : b.measurement - a.measurement;
            } else if (sortOption === "name") {
                return sortDirection === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                return 0;
            }
        });

    const navigate = useNavigate();

    const editItem = () => {
        navigate("/get-item/" + id);
    };

    const [open, setOpen] = React.useState(false);
    const [id, setID] = React.useState("");
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("");
    const [measurement, setMeasurement] = React.useState("");
    const [measure, setMeasure] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [image, setImage] = React.useState("");

    const handleClickOpen = (
        id,
        name,
        type,
        measurement,
        price,
        image,
        measure
    ) => {
        setID(id);
        setName(name);
        setType(type);
        setMeasurement(measurement);
        setPrice(price);
        setImage(image);
        setMeasure(measure);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleUse = () => {
        navigate("/use-item");
    };

    const handleAdd = () => {
        navigate("/new-item");
    };

    const handleSort = (option) => {
        if (sortOption === option) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortOption(option);
        }
    };

    const handleDirection = (direction) => {
        if (direction === "asc") {
            setSortDirection("asc");
        } else if (direction === "desc") {
            setSortDirection("desc");
        }
    };

    const handleView = (e) => {
        setListView(e.target.value);
        if (listView === "table") {
            setImageList(true);
            setTableList(false);
        } else if (listView === "image") {
            setImageList(false);
            setTableList(true);
        }
    };

    const handleCategory = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1);
    };

    const [imageList, setImageList] = React.useState(true);
    const [tableList, setTableList] = React.useState(false);

    useEffect(() => {
        viewCategory();
    }, []);

    const [subCategory, setSubCategory] = useState([]);

    const viewCategory = async () => {
        const { data } = await axios.get(`/api/view-category`);

        setSubCategory(data.categories);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="error">
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
            <Box sx={{ marginTop: 1, textAlign: "center" }}>
                <Grid container>
                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                        <Typography variant="body2">Sort By</Typography>
                        <FormControl sx={{ minWidth: 100 }}>
                            <Select
                                size="small"
                                value={sortOption}
                                onChange={(event) =>
                                    handleSort(event.target.value)
                                }
                            >
                                <MenuItem value="id">Id</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="price">Price</MenuItem>
                                <MenuItem value="measurement">
                                    Measurement
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                        <Typography variant="body2">Sort Direction</Typography>
                        <FormControl sx={{ minWidth: 100 }}>
                            <Select
                                size="small"
                                value={sortDirection}
                                onChange={(event) =>
                                    handleDirection(event.target.value)
                                }
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                        <Typography variant="body2">View</Typography>
                        <FormControl sx={{ minWidth: 100 }}>
                            <Select
                                size="small"
                                value={listView}
                                onChange={handleView}
                            >
                                <MenuItem value="image">Image List</MenuItem>
                                <MenuItem value="table">Table List</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

    

                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                        <Typography variant="body2">Category</Typography>
                        <FormControl sx={{ minWidth: 100 }}>
                            <Select
                                size="small"
                                value={category}
                                onChange={handleCategory}
                            >
                                <MenuItem value="All Item">All Item</MenuItem>
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

                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2} marginTop={1}>
                        <Button variant="contained" size="large" onClick={handleAdd}>Add Item</Button>
                    </Grid>

                    <Grid item xs={6} sm={4} md={2} lg={2} xl={2} marginTop={1}>
                    <Button variant="contained" size="large" onClick={handleUse}>Use Items</Button>
                    </Grid>
                </Grid>
            </Box>
            {imageList && (
                <Box sx={{ marginTop: 4 }}>
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
                                onClick={() =>
                                    handleClickOpen(
                                        item.id,
                                        item.name,
                                        item.type,
                                        item.measurement,
                                        item.price,
                                        item.image,
                                        item.measured_in
                                    )
                                } //() => editItem(item.id)
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
                                <Typography variant="body2">
                                    {item.type}
                                </Typography>
                                <Typography variant="body2">
                                    Price: {item.price}
                                </Typography>
                                <Typography variant="body2">
                                    {item.measured_in}: {item.measurement}
                                </Typography>
                                <Typography variant="body2">
                                    Date:{" "}
                                    {new Date(
                                        item.updated_at
                                    ).toLocaleDateString("en-US", dateOptions)}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {tableList && (
                <Box sx={{ marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Item Name</TableCell>
                                <TableCell
                                    sx={{
                                        display: {
                                            xs: "none",
                                            md: "table-cell",
                                        },
                                    }}
                                >
                                    Type
                                </TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Measurement</TableCell>
                                <TableCell
                                    sx={{
                                        display: {
                                            xs: "none",
                                            md: "table-cell",
                                        },
                                    }}
                                >
                                    Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:hover": { cursor: "pointer" },
                                        "& td": {
                                            borderBottom: "1px solid #ddd",
                                            padding: "0.75rem",
                                        },
                                        "& td:first-of-type": {
                                            padding: "0",
                                        },
                                    }}
                                    onClick={() =>
                                        handleClickOpen(
                                            item.id,
                                            item.name,
                                            item.type,
                                            item.measurement,
                                            item.price,
                                            item.image,
                                            item.measured_in
                                        )
                                    }
                                >
                                    <TableCell
                                        sx={{
                                            width: { xs: "80px", sm: "100px" },
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundImage: `url(/upload/${item.image})`,
                                                backgroundSize: "contain",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                width: "100%",
                                                height: "80px",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell
                                        sx={{
                                            display: {
                                                xs: "none",
                                                md: "table-cell",
                                            },
                                        }}
                                    >
                                        {item.type}
                                    </TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                        {item.measurement} {item.measured_in}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            display: {
                                                xs: "none",
                                                md: "table-cell",
                                            },
                                        }}
                                    >
                                        {new Date(
                                            item.updated_at
                                        ).toLocaleDateString(
                                            "en-US",
                                            dateOptions
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

<Box
  sx={{ display: "flex", justifyContent: "center", marginTop: 2, marginBottom: 2, }}
>
  <Pagination
    count={lastPage ?? 1} // Fix for handling null lastPage value
    page={currentPage}
    onChange={(event, page) => handlePageClick(page)}
    variant="outlined"
    shape="rounded"
    color="primary"
    showFirstButton
    showLastButton
    siblingCount={1}
    boundaryCount={1}
  />
</Box>


            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <div
                        style={{
                            backgroundImage: `url(/upload/${image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "250px",
                            height: "250px",
                            borderRadius: "5px",
                        }}
                    />
                    <Typography textAlign="center" variant="h6">
                        {name}
                    </Typography>
                    <Typography textAlign="center" variant="h6">
                        {type}
                    </Typography>
                    <Typography textAlign="center" variant="h6">
                        Price: {price}
                    </Typography>
                    <Typography textAlign="center" variant="h6">
                        {measure}: {measurement}
                    </Typography>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px"}}>
                        <Button
                            variant="contained"
                            onClick={editItem}
                            fullWidth
                        >
                            Update
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
