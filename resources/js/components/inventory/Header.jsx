import * as React from "react";
import MenuIcon from "@mui/icons-material/Menu";

import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Tooltip,
    MenuItem,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const pages = [
    "View Items",
    "New Item",
    "View Receipts",
    "New Receipt",
    "View Archives",
];
const settings = [
    "Profile",
    "Create New Account",
    "View Users",
    "View History Logs",
    "Settings",
    "Logout",
];

function Header() {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (e) => {
        setAnchorElNav(null);
        if (e === "View Items") {
            navigate("/");
        } else if (e === "New Item") {
            navigate("/new-item");
        } else if (e === "New Receipt") {
            navigate("/new-receipt");
        } else if (e === "View Receipts") {
            navigate("/view-receipts");
        } else if (e === "View Archives") {
            navigate("/view-archives");
        }
    };

    const handleCloseUserMenu = (e) => {
        setAnchorElUser(null);
        if (e === "View History Logs") {
            navigate("/view-logs");
        } else if (e === "Settings") {
          setOpen(true);
        }
    };
    const [open, setOpen] = React.useState(false);

  const handleClose = () => {
      setOpen(false);
  };

  const handleCategory = () => {
    setOpen(false);
    navigate("/add-category");
  }

    return (
        <Box>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Inventory
                        </Typography>

                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page}
                                        onClick={() => handleCloseNavMenu(page)}
                                        divider={true}
                                    >
                                        <Typography textAlign="center">
                                            {page}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Inventory
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton
                                    onClick={handleOpenUserMenu}
                                    sx={{ p: 0 }}
                                >
                                    <Avatar
                                        alt="Super Admin"
                                        src="https://th.bing.com/th/id/OIP.chx2YRE9XBvdMVjAnRk2TwAAAA?pid=ImgDet&rs=1"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() =>
                                            handleCloseUserMenu(setting)
                                        }
                                        divider={true}
                                    >
                                        <Typography textAlign="center">
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                  <Grid container spacing={{ xs: 2, md: 3 }} textAlign="center">
                  <Grid item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    >
                      <Typography variant="h4">Settings</Typography>
                      </Grid>
                    <Grid item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    >
                        <Button
                            variant="contained"
                            style={{ width: "200px" }}
                            onClick={handleCategory}
                        >
                            Add New Category
                        </Button>
                        </Grid>


                        <Grid item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        >
                        <Button
                            variant="contained"
                            style={{ width: "200px" }}
                        >
                            Add New Type Of Measurement
                        </Button>
                        </Grid>
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default Header;
