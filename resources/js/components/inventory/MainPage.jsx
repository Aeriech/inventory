import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Divider from '@mui/material/Divider';

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

const drawerWidth = 240;

const Sidebar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const handleOption1Click = () => {
    alert('Clicked Option 1')
  }

  const handleOption2Click = () => {
    alert('Clicked Option 2')
  }

  const handleOption3Click = () => {
    alert('Clicked Option 3')
  }
  
  const drawerItems = (
    <List>
      <ListItem button onClick={handleOption1Click}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Option 1"/>
      </ListItem>
      <Divider />
      <ListItem button onClick={handleOption2Click}>
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="Option 2" />
      </ListItem>
      <Divider />
      <ListItem button onClick={handleOption3Click}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Option 3" />
      </ListItem>
    </List>
  );
  

  return (
    <React.Fragment>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        >
        <Box
        sx={{ width: drawerWidth }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        >
        {drawerItems}
        </Box>
        </Drawer>
        </React.Fragment>
        );
        };
        
        const Header = () => {
        return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
        <Toolbar>
        <Sidebar />
        <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{ flexGrow: 1 }}
        >
        My App
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
        </Box>
        );
        };
        
        export default Header;
