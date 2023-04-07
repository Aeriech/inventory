import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";


const ViewPurchases = () => {
  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  
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
                  purchase.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    label="Search by name"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Box>
            <Grid container spacing={2}>
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
                            sx={{ borderRadius: 8, backgroundColor: "#F8F8F8" }}
                        >
                            <CardContent sx={{ padding: 2 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    align="center"
                                >
                                    Purchase Number: {purchaseNumber}
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
  sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
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
        </Container>
    );
};

export default ViewPurchases;
