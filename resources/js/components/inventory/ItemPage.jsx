import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, AppBar, Box, Toolbar, Typography, InputBase} from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '50%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function ItemPage() {

  useEffect(()=>{
    viewItems()
  })

  const viewItems = async () => {
    await axios.get("/api/View_Items")
    .then(({data})=>{
      setItems(data.items);
    })
  }

  const [items, setItems] = useState([])
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ flexGrow: 1}}
          >
            View Items
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      
              <Box sx={{ marginTop: 5 }}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
              {items.map((item) => (
                  <Grid item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    xl={2}
                    key={item}
                    sx={{ border: "1px solid #ccc", padding: "1rem" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div style={{ marginBottom: "1rem" }}>
                        <img
                          height={"100px"}
                          width={"100px"}
                          src={`/upload/${item.image}`}
 
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <Typography variant="body2" align="left">
                          {item.name} - {item.type}
                        </Typography>
                        <Typography variant="body2" align="left">
                          Qty: {item.measurement} Prc: {item.price}
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                  ))}
              </Grid>
            </Box>
    </Box>
  );
}