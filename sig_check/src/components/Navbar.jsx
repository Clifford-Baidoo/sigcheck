import { useState } from "react";
import Logo from "../Assets/Logo.png";
import { AiOutlineUnorderedList } from "react-icons/ai";
import {Box,Drawer,Divider,List,ListItem,ListItemButton,ListItemIcon,ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
// import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
// import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import Dashboard from "./Dashboard";
import {Link} from "react-router-dom";

export default function Navbar(){
    const [openMenu,SetOpenMenu] = useState(false)
    const menuOptions = [
        {text:"Home",icon:<HomeIcon/>,path:'/'},
        {text:"Dashboard",icon:<DashboardIcon/>,path:'/dashboard'},
        {text:"About",icon:<InfoIcon/>},
    ]
    return(
        <nav>
            <div className = "nav-logo-container">
                <img src={Logo} alt="Picture" />
            </div>
            <div className="navbar-links-container">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to='/about'>About</Link>

            </div>
            <div className="navbar-menu-container">
                <AiOutlineUnorderedList onClick={() => SetOpenMenu(true)}/>
            </div>
            <Drawer open={openMenu} onClose={() => SetOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => SetOpenMenu(false)}
          onKeyDown={() => SetOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component ={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
        </nav>
    );
};