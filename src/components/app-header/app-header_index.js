import { useState } from "react";
import clsx from "clsx";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Pages,
  ExpandLess,
  ExpandMore,
  ShoppingBasket,
  Toc,
  Person,
} from "@material-ui/icons";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popover,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useNavigate, useLocation } from "react-router-dom";

export const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: -23,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: 1,
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    zIndex: 1,
  },
  listItemIcon: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  typography: {
    padding: "8px 16px",
    textTransform: "none",
    color: theme.palette.text.secondary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 700,
  },
  profile: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.text.secondary,
  },
}));

function AppHeader({ onDrawerChange = () => {} }) {
  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [pageSubMenuOpen, setPageSubMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const listPath =
    location.pathname === "/" ||
    location.pathname === "/products" ||
    location.pathname === "/productTypes";

  const handlePageMenuClick = () => {
    setOpen(true);
    onDrawerChange(true);
    setPageSubMenuOpen(!pageSubMenuOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    onDrawerChange(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    onDrawerChange(false);
    setPageSubMenuOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const popperOpen = Boolean(anchorEl);
  const id = popperOpen ? "simple-popover" : undefined;

  const navigationMenu = [
    <div key="Pages" style={{ marginTop: "10px" }}>
      <ListItem button onClick={handlePageMenuClick}>
        <ListItemIcon className={classes.listItemIcon}>
          <Pages />
        </ListItemIcon>
        <ListItemText primary="Pages" />
        {pageSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={pageSubMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            onClick={() => navigate("/Trips")}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <Toc />
            </ListItemIcon>
            <ListItemText primary="Trip" />
          </ListItem>
          <ListItem
            button
            className={classes.nested}
            onClick={() => navigate("/Routes")}
          >
            <ListItemIcon className={classes.listItemIcon}>
              <Toc />
            </ListItemIcon>
            <ListItemText primary="Route" />
          </ListItem>
        </List>
      </Collapse>
    </div>,
  ];

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <AppBar
        position="fixed"
        // className={clsx(classes.appBar, {
        //   [classes.appBarShift]: open,
        // })}
        className={classes.appBar}
        elevation={0}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <Toolbar>
          <div
            color="inherit"
            // aria-label="open drawer"
            // onClick={handleDrawerOpen}
            // edge="end"
            // className={clsx(classes.menuButton, {
            //   [classes.hide]: open,
            // })}
          >
            {/* <Menu /> */}
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: "50.5px",
                marginRight: "10px",
                marginLeft: "-13px",
              }}
            />
          </div>
          <Divider orientation="vertical" flexItem style={{ width: "0.5px" }} />
          <Box
            display="flex"
            className="header-items"
            flexGrow={1}
            justifyContent="space-between"
          >
            {/* <img
              src={"/logo-main.png"}
              width="40px"
              alt="Logo"
              style={{ marginRight: 16 }}
            /> */}
            <Typography
              variant="h5"
              style={{ fontWeight: "1000", marginLeft: "30px" }}
            >
              SLV Solutions
            </Typography>

            <Box display="flex" className="profile-items" alignItems="center">
              <Divider
                orientation="vertical"
                flexItem
                style={{ height: "82px" }}
              />
              <Avatar
                aria-describedby={id}
                onClick={handleClick}
                style={{
                  marginLeft: 16,
                  backgroundColor: theme.palette.secondary.main,
                  cursor: "pointer",
                }}
              >
                <Person />
              </Avatar>
              <Typography className={classes.profile} noWrap>
                Sarah Kortney
              </Typography>
              <img src="/down_icon.png" alt="down icon"></img>
              <Popover
                id={id}
                open={popperOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                style={{ cursor: "pointer" }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Button className={classes.typography} onClick={() => {}}>
                  Sign Out
                </Button>
              </Popover>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <div>
        <Drawer
          variant="permanent"
          className={clsx(classes.menu, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          {pageSubMenuOpen && (
            // <div className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // onClick={handleDrawerOpen}
              // edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              {/* <Menu /> */}
              <img src="/logo.png" alt="logo" style={{ width: "46.5px" }} />
            </IconButton>
            //   {/* <IconButton onClick={handleDrawerClose}>
            //   {theme?.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
            // </IconButton>
            // <Typography variant="h6" noWrap style={{ fontWeight: "bold" }}>
            //   REPLICACIA
            // </Typography> */}
            // </div>
          )}
          <Divider style={{ paddingBottom: "65px" }} />
          <List>{navigationMenu.map((item) => item)}</List>
        </Drawer>
        <div
          className="Drawer-button"
          style={{
            left: !open ? "72px" : "239px",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={!open ? handleDrawerOpen : handleDrawerClose}
            edge="start"
            // className={clsx(classes.menuButton, {
            //   [classes.hide]: open,
            // })}
          >
            <div>{!open ? <ChevronRight /> : <ChevronLeft />}</div>
          </IconButton>
        </div>
      </div>
      {listPath && (
        <Box className="bottom-info">
          <Box className="bottom-info-inner-container">
            <span className="inner-bottom-info"></span>

            <Typography variant="h6">Apparel</Typography>
          </Box>

          <Box className="bottom-info-inner-container">
            <span className="inner-bottom-info-2"></span>

            <Typography variant="h6">Electronic</Typography>
          </Box>

          <Box className="bottom-info-inner-container">
            <span className="inner-bottom-info-3"></span>

            <Typography variant="h6">Furniture</Typography>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default AppHeader;
