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

export default function ViewHistoryLog() {
    const [logs, setLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [type, setType] = useState("All Log");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [sortOption, setSortOption] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [listView, setListView] = useState("image");

    const dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `/api/view-logs?page=${currentPage}&type=${type}`
            );
            setLogs(response.data.data);
            setLastPage(response.data.last_page);
        }

        fetchData();
    }, [currentPage, type]);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const filteredItems = logs
        .filter((log) => {
            const lowerCasedQuery = searchQuery.toLowerCase();
            return (
                log.description.toLowerCase().includes(lowerCasedQuery) ||
                log.type.toLowerCase().includes(lowerCasedQuery)
            );
        })
        .sort((a, b) => {
            if (sortOption === "date") {
                const dateA = new Date(a.updated_at);
                const dateB = new Date(b.updated_at);
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            } else if (sortOption === "type") {
                return sortDirection === "asc"
                    ? a.type - b.type
                    : b.type - a.type;
            } else if (sortOption === "id") {
                return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
            } else if (sortOption === "description") {
                return sortDirection === "asc"
                    ? a.description - b.description
                    : b.description - a.description;
            } else {
                return 0;
            }
        });

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
        setType(e.target.value);
        setCurrentPage(1);
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

    const [imageList, setImageList] = React.useState(true);
    const [tableList, setTableList] = React.useState(false);

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
                        View History
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
                    <Grid item xs={6} sm={4} md={3} lg={3} xl={3}>
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
                                <MenuItem value="type">Type</MenuItem>
                                <MenuItem value="description">
                                    Description
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={4} md={3} lg={3} xl={3}>
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

                    <Grid item xs={6} sm={4} md={3} lg={3} xl={3}>
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

                    <Grid item xs={6} sm={4} md={3} lg={3} xl={3}>
                        <Typography variant="body2">Category</Typography>
                        <FormControl sx={{ minWidth: 100 }}>
                            <Select
                                size="small"
                                value={type}
                                onChange={handleCategory}
                            >
                                <MenuItem value="All Log">All Log</MenuItem>
                                <MenuItem value="Add">Add</MenuItem>
                                <MenuItem value="Update">Update</MenuItem>
                                <MenuItem value="Archive">Archive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            {imageList && (
                <Box sx={{ marginTop: 5 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        {filteredItems.map((log, index) => (
                            <Grid
                                item
                                xs={6}
                                sm={4}
                                md={3}
                                lg={2}
                                xl={2}
                                key={index}
                                textAlign="center"
                                alignContent="center"
                                alignItems="center"
                                sx={{
                                    border: "1px solid #ccc",
                                    padding: "1rem",
                                    "&:hover": { cursor: "pointer" },
                                }}
                            >
                                <Typography variant="h6">{log.type}</Typography>
                                <Typography variant="body2">
                                    {log.description}
                                </Typography>
                                <Typography variant="body2">
                                    Date:{" "}
                                    {new Date(
                                        log.updated_at
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
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date</TableCell>
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
                                >
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>
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
        </Box>
    );
}
