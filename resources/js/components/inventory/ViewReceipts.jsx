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

export default function ViewReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [imageList, setImageList] = React.useState(true);
    const [tableList, setTableList] = React.useState(false);
    const [sortOption, setSortOption] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [listView, setListView] = useState("image");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(
                `/api/view-receipts?page=${currentPage}`
            );
            setReceipts(response.data.data);
            setLastPage(response.data.last_page);
        }

        fetchData();
    }, [currentPage]);

    const filteredItems = receipts.filter((receipt) => {
        const lowerCasedQuery = searchQuery.toLowerCase();
        return (
            receipt.description.toLowerCase().includes(lowerCasedQuery) ||
            receipt.amount.toLowerCase().includes(lowerCasedQuery)
        );
    }).sort((a, b) => {
        if (sortOption === "date") {
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);
            return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortOption === "amount") {
            return sortDirection === "asc"
                ? a.amount - b.amount
                : b.amount - a.amount;
        } else if (sortOption === "id") {
            return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
        } else if (sortOption === "description") {
            return sortDirection === "asc"
                ? a.description - b.description
                : b.description - a.description;
        }  else {
            return 0;
        }
    });

    const handleDirection = (direction) => {
        if (direction === "asc") {
            setSortDirection("asc");
        } else if (direction === "desc") {
            setSortDirection("desc");
        }
    };

    const handleSort = (option) => {
        if (sortOption === option) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortOption(option);
        }
    };

    const handleNextPage = () => {
        if (currentPage < lastPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
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
                        View Receipts
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
                    <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
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
                                <MenuItem value="amount">Amount</MenuItem>
                                <MenuItem value="description">Description</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
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

                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
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


                </Grid>
            </Box>

{imageList &&
            <Box sx={{ marginTop: 5 }}>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                    {filteredItems.map((receipt,index) => (
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
                            sx={{ border: "1px solid #ccc", padding: "1rem",
                            "&:hover": {cursor: "pointer"}
                          }}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(/upload/${receipt.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    height: "120px",
                                    borderRadius: "5px",
                                }}
                            />
                            <Typography variant="subtitle1">
                                {receipt.description}
                            </Typography>
                            <Typography variant="body2">Amount: {receipt.amount}</Typography>
                            <Typography variant="body2">
                            Date: {new Date(receipt.updated_at).toLocaleDateString('en-US', dateOptions)}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
}
            {tableList && (
                <Box sx={{ marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
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
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>{new Date(item.updated_at).toLocaleDateString('en-US', dateOptions)}</TableCell>
                                
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

<Box
                marginTop="10px"
                marginBottom="20px"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Button variant="outlined" onClick={handlePrevPage}>
                    Prev
                </Button>
                {lastPage && (
                    <Pagination
                        count={lastPage}
                        page={currentPage}
                        onChange={(event, page) => handlePageClick(page)}
                        color="primary"
                    />
                )}
                <Button
                    variant="outlined"
                    onClick={handleNextPage}
                    disabled={currentPage === lastPage}
                >
                    Next
                </Button>
            </Box>

        </Box>
    );
}
