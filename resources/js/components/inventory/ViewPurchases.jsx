import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Box, TextField } from '@mui/material';

const ViewPurchases = () => {
  const [groupedPurchases, setGroupedPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch data from API endpoint
    axios.get('/api/view-purchases')
      .then(response => setGroupedPurchases(response.data.groupedPurchases))
      .catch(error => console.error(error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPurchases = Object.keys(groupedPurchases).reduce((filtered, purchaseNumber) => {
    const filteredGroup = groupedPurchases[purchaseNumber].filter(purchase =>
      purchase.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredGroup.length > 0) {
      filtered[purchaseNumber] = filteredGroup;
    }

    return filtered;
  }, {});

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Grouped Purchases
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <TextField
          label="Search by name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>
      <Grid container spacing={2}>
        {Object.keys(filteredPurchases).map(purchaseNumber => (
          <Grid key={purchaseNumber} item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={3} sx={{ borderRadius: 8, backgroundColor: '#F8F8F8' }}>
              <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom align="center">
                  Purchase Number
                </Typography>
                <Typography variant="h5" gutterBottom align="center" sx={{ color: '#2E6B8E' }}>
                  {purchaseNumber}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {filteredPurchases[purchaseNumber].map(purchase => (
                    <Box key={purchase.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">{purchase.name}</Typography>
                      <Typography variant="body1" color="textSecondary">{purchase.measurement}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="caption" color="textSecondary">
                    {filteredPurchases[purchaseNumber].length} items
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewPurchases;
