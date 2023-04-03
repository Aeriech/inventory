import React from 'react'
import { Typography,TextField,Box,Grid
, MenuItem, FormControl, Select, Button
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';




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
  } catch ({ response }) {
    // handle error
  }
};

  return (
    <div > 
      <Box sx={{ flexGrow: 1}}  textAlign="center" marginTop="20px">

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:"15px", marginLeft:"15px" }}>
  <Typography  variant='h4' style={{textAlign: "left"}}>Add Measurement</Typography>
  
  <div>
  <Button size='large' variant="contained" onClick={(event) => createMeasurement(event)}><Typography variant='h6'>SAVE</Typography></Button>
  </div>
</div>
  
  <Box border={2} borderColor="black" padding={5} margin="10px">
    <Grid alignItems="center" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant='h5'>Measurement</Typography>
        <TextField id="filled-basic" variant="filled" value={measurement} onChange={(e) => (setMeasurement(e.target.value))}/>
      </Grid>
    </Grid>
  </Box>
</Box>

    </div>
  )
}
