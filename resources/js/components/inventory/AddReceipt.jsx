import React from 'react'
import { Typography,TextField,Box,Grid
, Button
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AddReceipt() {
    const navigate = useNavigate();

    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [amount, setAmount] = useState("");

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

    const createReceipt = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('description', description)
        formData.append('image', image)
        formData.append('amount', amount)

        try {
          const { data } = await axios.post("/api/new-receipt/",formData);
          toast.fire({
            icon:"success",
                title: "Receipt added successfully",   
          });
          navigate("/view-receipts")
        } catch (error) {
          if (error.response && error.response.status === 422) {
            setErrors(error.response.data.errors);
        } else {
            // handle other errors here
        }
        }
    };

    const [errors, setErrors] = useState(null);

  return (
    <div > 
      <Box sx={{ flexGrow: 1}}  textAlign="center" marginTop="20px">

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight:"15px", marginLeft:"15px" }}>
  <Typography variant='h4' style={{textAlign: "left"}}>New Receipt</Typography> 
  <div>
  <Button size='large' variant="outlined" onClick={(event) => createReceipt(event)}><Typography variant='h5'>SAVE</Typography></Button>
  </div>
</div>

<Box marginTop="10px">
{errors && (
                <div className="alert alert-danger">
                    <ul>
                        {Object.values(errors).map((messages, index) => (
                            <li key={index}>{messages[0]}</li>
                        ))}
                    </ul>
                </div>
            )}
            </Box>

  <Box border={2} borderColor="black" padding={5} margin="10px">
    <Grid alignItems="center" container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} >
      <Grid item xs={12} sm={12} md={4}>
        <Grid container direction="column" alignItems="center" >
          <Grid item>
            <img src={image} width="150px" height="150px" border={2} ></img>
          </Grid>
          <Grid item>
            <form className="image_item-form">
             <label className="image_item-form--label">Add Image</label>
           <input type="file" className="image_item-form--input" onChange={changeHandler}/>
             </form>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Typography variant='h5'>Description</Typography>
        <TextField id="filled-basic" variant="filled" value={description} onChange={(e) => (setDescription(e.target.value))}/>
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <Typography variant='h5'>Amount</Typography>
        <TextField id="filled-basic" variant="filled" value={amount} onChange={(e) => (setAmount(e.target.value))}/>
      </Grid>
    </Grid>
  </Box>
</Box>

    </div>
  )
}
