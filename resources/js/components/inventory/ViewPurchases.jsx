import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    TextField,
    Button,
    Pagination,
    Dialog,
    AppBar,
    Toolbar,
    InputBase,
    DialogContent,
} from "@mui/material";
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

const ViewPurchases = () => {
    const [groupedPurchases, setGroupedPurchases] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState([]);
    const [pNumber, setPNumber] = useState(1);
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [Open, setOpen] = useState(false);

    const [receipts, setReceipts] = useState([]);

    useEffect(() => {
        axios
            .get(`/api/get-receipt/${pNumber}`)
            .then((response) => {
                console.log(response.data)
                setReceipts(response.data)
            })
            .catch((error) => console.error(error));
    }, [pNumber]);

    const handleCardClick = (purchase, status) => {
        setSelectedPurchase(purchase);
        if (status === "Completed") {
            setOpen(true);
        } else {
            setDialogOpen(true);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        // Fetch data from API endpoint for the current page
        axios
            .get(`/api/view-purchases?page=${currentPage}`) // Pass the current page value to the API endpoint
            .then((response) => {
                // Assuming API response includes pagination data in 'pagination' object
                setGroupedPurchases(response.data.groupedPurchases);
                setLastPage(response.data.pagination.lastPage);
            })
            .catch((error) => console.error(error));
    }, [currentPage]); // Add 'currentPage' as a dependency to the useEffect hook

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPurchases = Object.keys(groupedPurchases).reduce(
        (filtered, purchaseNumber) => {
            const filteredGroup = groupedPurchases[purchaseNumber].filter(
                (purchase) =>
                    purchase.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    purchase.purchase_number
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    purchase.status
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );

            if (filteredGroup.length > 0) {
                filtered[purchaseNumber] = filteredGroup;
            }

            return filtered;
        },
        {}
    );

    const handleApprove = (event) => {
        event.preventDefault();
        axios
            .post(`/api/set-approved/${pNumber}`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {});
    };

    const handleReject = (event) => {
        event.preventDefault();
        axios
            .post(`/api/set-rejected/${pNumber}`)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                // Handle error
            });
    };

    const navigate = useNavigate();
    const handleOpenPurchase = () => {
        navigate("/complete-purchase/" + pNumber);
    };

    const dateOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return (
        <>
            <AppBar position="static" color="error">
                <Toolbar>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        View Purchases
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ "aria-label": "search" }}
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Search>
                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: 4 }}>
                <Grid container spacing={1}>
                    {Object.keys(filteredPurchases).map((purchaseNumber) => (
                        <Grid
                            key={purchaseNumber}
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                        >
                            <Card
                                elevation={3}
                                sx={{
                                    borderRadius: 8,
                                    backgroundColor: "#F8F8F8",
                                    borderColor: "black",
                                    borderWidth: 2,
                                    borderStyle: "solid",
                                }}
                                onClick={() => {
                                    handleCardClick(
                                        filteredPurchases[purchaseNumber],
                                        filteredPurchases[purchaseNumber][0]
                                            .status
                                    );
                                    setPNumber(purchaseNumber);
                                    setStatus(
                                        filteredPurchases[purchaseNumber][0]
                                            .status
                                    );
                                    setDate(
                                        filteredPurchases[purchaseNumber][0]
                                            .purchase_date
                                    );
                                }}
                                // Pass filtered purchases for the given purchaseNumber
                                style={{ cursor: "pointer" }}
                            >
                                <CardContent sx={{ padding: 2 }}>
                                    {filteredPurchases[purchaseNumber][0]
                                        .status === "Approved" && (
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            align="center"
                                            style={{
                                                backgroundColor: "blue",
                                                color: "white",
                                                padding: "8px",
                                                borderRadius: "20px",
                                            }}
                                        >
                                            Purchase Number: {purchaseNumber}
                                            <Typography
                                                variant="body1"
                                                color="white"
                                            >
                                                Status:{" "}
                                                {
                                                    filteredPurchases[
                                                        purchaseNumber
                                                    ][0].status
                                                }
                                            </Typography>
                                        </Typography>
                                    )}
                                    {filteredPurchases[purchaseNumber][0]
                                        .status === "Completed" && (
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            align="center"
                                            style={{
                                                backgroundColor: "green",
                                                color: "white",
                                                padding: "8px",
                                                borderRadius: "20px",
                                            }}
                                        >
                                            Purchase Number: {purchaseNumber}
                                            <Typography
                                                variant="body1"
                                                color="white"
                                            >
                                                Status:{" "}
                                                {
                                                    filteredPurchases[
                                                        purchaseNumber
                                                    ][0].status
                                                }
                                            </Typography>
                                        </Typography>
                                    )}
                                    {filteredPurchases[purchaseNumber][0]
                                        .status === "Rejected" && (
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            align="center"
                                            style={{
                                                backgroundColor: "red",
                                                color: "white",
                                                padding: "8px",
                                                borderRadius: "20px",
                                            }}
                                        >
                                            Purchase Number: {purchaseNumber}
                                            <Typography
                                                variant="body1"
                                                color="white"
                                            >
                                                Status:{" "}
                                                {
                                                    filteredPurchases[
                                                        purchaseNumber
                                                    ][0].status
                                                }
                                            </Typography>
                                        </Typography>
                                    )}
                                    {filteredPurchases[purchaseNumber][0]
                                        .status === "Pending" && (
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            align="center"
                                            style={{
                                                backgroundColor: "yellow",
                                                color: "black",
                                                padding: "8px",
                                                borderRadius: "20px",
                                            }}
                                        >
                                            Purchase Number: {purchaseNumber}
                                            <Typography
                                                variant="body1"
                                                color="black"
                                            >
                                                Status:{" "}
                                                {
                                                    filteredPurchases[
                                                        purchaseNumber
                                                    ][0].status
                                                }
                                            </Typography>
                                        </Typography>
                                    )}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                        }}
                                    >
                                        {filteredPurchases[purchaseNumber].map(
                                            (purchase) => (
                                                <Box
                                                    key={purchase.id}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {purchase.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                    >
                                                        {purchase.measured_in} -{" "}
                                                        {purchase.measurement}
                                                    </Typography>
                                                </Box>
                                            )
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            marginTop: 2,
                                            marginBottom: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            textAlign="left"
                                        >
                                            Date:{" "}
                                            {new Date(
                                                filteredPurchases[
                                                    purchaseNumber
                                                ][0].created_at
                                            ).toLocaleDateString(
                                                "en-US",
                                                dateOptions
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            textAlign="right"
                                        >
                                            {
                                                filteredPurchases[
                                                    purchaseNumber
                                                ].length
                                            }{" "}
                                            items
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                        marginBottom: 2,
                    }}
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
                {selectedPurchase && (
                    <Dialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                    >
                        <DialogContent>
                            {/* Display the selected purchase details here */}
                            <Typography variant="h4">
                                Purchase Number: {pNumber}
                            </Typography>
                            <Typography
                                variant="h5"
                                gutterBottom
                                textAlign="center"
                            >
                                Status: {status}
                            </Typography>
                            {selectedPurchase &&
                                selectedPurchase.map((purchase, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {purchase.name}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                        >
                                            {purchase.measured_in} -{" "}
                                            {purchase.measurement}
                                        </Typography>
                                    </Box>
                                ))}
                            <Grid container spacing={1} marginTop="10px">
                                {status === "Pending" && (
                                    <>
                                        <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                        >
                                            <Button
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                onClick={(e) => handleReject(e)}
                                            >
                                                Reject
                                            </Button>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                        >
                                            <Button
                                                variant="contained"
                                                color="success"
                                                fullWidth
                                                onClick={(e) =>
                                                    handleApprove(e)
                                                }
                                            >
                                                Approve
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                                {status === "Approved" && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            xl={12}
                                        >
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleOpenPurchase}
                                                fullWidth
                                            >
                                                Open Purchase
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => setDialogOpen(false)}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                )}
                {selectedPurchase && (
                    <Dialog open={Open} onClose={() => setOpen(false)}>
                        <DialogContent>
                            {/* Display the selected purchase details here */}
                            <Typography variant="h5" textAlign="center">
                                Purchase Number: {pNumber}
                            </Typography>
                            <Typography
                                variant="h6"
                                gutterBottom
                                textAlign="center"
                            >
                                Status: {status}
                            </Typography>
                            <Typography
                                variant="h6"
                                gutterBottom
                                textAlign="center"
                            >
                                Purchased On:{" "}
                                {new Date(date).toLocaleString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </Typography>

                            {selectedPurchase &&
                                selectedPurchase.map((purchase, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {purchase.name}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            color="textSecondary"
                                        >
                                            {purchase.measured_in}:{" "}
                                            {purchase.measurement} ={" "}
                                            {purchase.item_added}
                                        </Typography>
                                    </Box>
                                ))}
                            <Grid container spacing={1} marginTop="10px">
                            {receipts && receipts.map((receipt, index)=>(
                            <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    key={index}
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
                                </Grid>
                                ))}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => setOpen(false)}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                )}
            </Container>
        </>
    );
};

export default ViewPurchases;
