import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Grid, Card, CardContent, Box, TextField, Button, Pagination, Dialog, DialogContent } from "@mui/material";


const ViewPurchases = () => {
    const [groupedPurchases, setGroupedPurchases] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState([]);
    const [pNumber, setPNumber] = useState("");
    const [status, setStatus] = useState("");
    

    const handleCardClick = (purchase) => {
        setSelectedPurchase(purchase);
        setDialogOpen(true);
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

    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                View Purchase Requests
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 2,
                }}
            >
                <TextField
                    label="Search"
                    variant="outlined"
                    size="large"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Box>
            <Grid container spacing={1}>
                {Object.keys(filteredPurchases).map((purchaseNumber) => (
                    <Grid key={purchaseNumber} item xs={6} sm={4} md={3} lg={3}>
                        <Card
                            elevation={3}
                            sx={{ borderRadius: 8, backgroundColor: "#F8F8F8" }}
                            onClick={() => {
                                handleCardClick(filteredPurchases[purchaseNumber]);
                                setPNumber(purchaseNumber);
                                setStatus(filteredPurchases[purchaseNumber][0].status);
                            }}
                            
                             // Pass filtered purchases for the given purchaseNumber
                            style={{ cursor: "pointer" }}
                        >
                            <CardContent sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom align="center">
            Purchase Number: {purchaseNumber}
            <Typography
              variant="body1"
              color="textSecondary"
              style={{ marginLeft: "0.5rem" }} // Add left margin
            >
              Status: {filteredPurchases[purchaseNumber][0].status}
            </Typography>
          </Typography>
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
                                                <Typography variant="body1">
                                                    {purchase.name}
                                                </Typography>

                                                <Typography
                                                    variant="body1"
                                                    color="textSecondary"
                                                >
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
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                    >
                                        {
                                            filteredPurchases[purchaseNumber]
                                                .length
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
                sx={{ display: "flex", justifyContent: "center", marginTop: 2, marginBottom: 2 }}
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
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
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
                    {selectedPurchase && selectedPurchase.map((purchase, index) => (
    <Box
    key={index}
    sx={{
        display: "flex",
        justifyContent:
            "space-between",
    }}
>
    <Typography variant="body1">
        {purchase.name}
    </Typography>

    <Typography
        variant="body1"
        color="textSecondary"
    >
        {purchase.measurement}
    </Typography>
</Box>
))}
<Grid container spacing={1} marginTop="10px">

<Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
<Button variant="contained" color="error" fullWidth>Reject</Button>
</Grid>

<Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
<Button variant="contained" color="success" fullWidth>Approve</Button>
</Grid>

<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
<Button variant="contained" fullWidth onClick={() => setDialogOpen(false)}>Back</Button>
</Grid>

</Grid>
                </DialogContent>
            </Dialog>
        )}
        </Container>
    );
};

export default ViewPurchases;
