import React from 'react'
import { Typography,TextField,Box,Grid
, MenuItem, FormControl, Select, Button
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';




export default function AddCategory() {
    const navigate = useNavigate();

    const [category, setCategory] = React.useState('1');
    const [subCategory, setSubCategory] = React.useState("");


    const handleCategory = (event) => {
      setCategory(event.target.value);
    };

    const createCategory = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        
        formData.append('category', category)
        formData.append('subCategory', subCategory)

        await axios.post("/api/add-category",formData)
        .then(({data}) =>{
            toast.fire({
                icon:"success",
                title: "Category added successfully",              
            })
            navigate("/")
        })
        .catch(({response})=>{

        })
    };
  return (
    <div > 
      <Box sx={{ flexGrow: 1}}  textAlign="center" marginTop="20px">

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:"15px", marginLeft:"15px" }}>
  <Typography  variant='h4' style={{textAlign: "left"}}>Add Category</Typography>
  
  <div>
  <Button size='large' variant="contained" onClick={(event) => createCategory(event)}><Typography variant='h6'>SAVE</Typography></Button>
  </div>
</div>
  
  <Box border={2} borderColor="black" padding={5} margin="10px">
    <Grid alignItems="center" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      <Grid item xs={12} sm={6} md={6}>
        <Typography variant='h5'>Main Category</Typography>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 180 }}>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={category}
            onChange={handleCategory}
          >
            <MenuItem value="1">Perishable</MenuItem>
            <MenuItem value="2">Non-Perishable</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <Typography variant='h5'>Sub Category</Typography>
        <TextField id="filled-basic" variant="filled" value={subCategory} onChange={(e) => (setSubCategory(e.target.value))}/>
      </Grid>
    </Grid>
  </Box>
</Box>

    </div>
  )
}
