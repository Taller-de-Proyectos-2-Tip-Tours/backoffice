import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useNavigate } from 'react-router-dom';
import constants from '../../assets/constants';
import CookieService from '../../services/CookieService';

const MainListItems = () => {
  const navigate = useNavigate();
  
  return (
      <>
        <Link to={constants.ROUTES.TOUR_LIST} style={{color:"white"}}>
          <ListItemButton>
            <ListItemIcon style={{color:"white"}}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Paseos" />
          </ListItemButton>
        </Link>
        <div onClick={()=>{
          CookieService.delete('user')
          navigate(constants.ROUTES.HOME)
          window.location.reload(false);
        }}
        style={{
          textAlign:'center',
          color:'white',
          cursor:'pointer'
        }}
        >
          Log Out
        </div>
      </>
  )
}

export default MainListItems