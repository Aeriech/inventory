import React from 'react'
import { Typography,TextField,Box,Grid
, MenuItem, FormControl, Select, Button
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';




export default function AddItem() {
    const navigate = useNavigate();

    const [name, setItemName] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [category, setCategory] = React.useState('');
    const [measure, setMeasure] = React.useState('Quantity');
    const [measurement, setMeasurement] = React.useState("");

    const handleCategory = (event) => {
      setCategory(event.target.value);
    };

    const handleMeasure = (event) => {
      setMeasure(event.target.value);
    };

    const changeHandler = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        let limit = 1024 * 1024 * 10;
        if(file['size'] > limit){
            toast.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Image size is above 10mb',
            })
        }
        reader.onloadend = (file) => {
            setImage(reader.result)
        }
        reader.readAsDataURL(file)
    };

    const createItem = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', name)
        formData.append('image', image)
        formData.append('type', category)
        formData.append('measurement', measurement)
        formData.append('price', price)

        await axios.post("/api/add-item/",formData)
        .then(({data}) =>{
            toast.fire({
                icon:"success",
                title: "Item added successfully",              
            })
            navigate("/")
        })
        .catch(({response})=>{

        })
    };
  return (
    <div > 
      <Box sx={{ flexGrow: 1}}  textAlign="center" marginTop="20px">
  <Typography variant='h3'textAlign="center">Add Item</Typography>
  <Box border={2} borderColor="black" padding={5} margin="10px">
    <Grid alignItems="center" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      <Grid item xs={2} sm={4} md={4}>
        <Grid container direction="column" alignItems="center" >
          <Grid item>
            <img src={image} width="125px" height="100px" border={2} ></img>
          </Grid>
          <Grid item>
            <form className="image_item-form">
             <label className="image_item-form--label">Add Image</label>
           <input type="file" className="image_item-form--input" onChange={changeHandler}/>
             </form>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Typography variant='h5'>Item Name</Typography>
        <TextField id="filled-basic" variant="filled" value={name} onChange={(e) => (setItemName(e.target.value))}/>
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Typography variant='h5'>Category</Typography>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={category}
            onChange={handleCategory}
          >
            <MenuItem value="Vegetable">Vegetable</MenuItem>
            <MenuItem value="Utensils">Utensils</MenuItem>
            <MenuItem value="Condiments">Condiments</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Typography variant='h5'>Price</Typography>
        <TextField id="filled-basic" variant="filled" value={price} onChange={(e) => (setPrice(e.target.value))}/>
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Typography variant='h5'>Measured in</Typography>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={measure}
            onChange={handleMeasure}
          >
            <MenuItem value="Kilograms">Kilograms</MenuItem>
            <MenuItem value="Liters">Liters</MenuItem>
            <MenuItem value="Quantity">Quantity</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={2} sm={4} md={4}>
        <Typography variant='h5'>{measure}</Typography>
        <TextField id="filled-basic" variant="filled" value={measurement} onChange={(e) => (setMeasurement(e.target.value))}/>
      </Grid>
    </Grid>
  </Box>
  <Button size='large' variant="contained" onClick={(event) => createItem(event)}><Typography variant='h5'>SAVE</Typography></Button>
</Box>

    </div>
  )
}
