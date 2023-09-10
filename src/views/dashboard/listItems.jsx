import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import constants from '../../assets/constants';

export const mainListItems = (
  <React.Fragment>
    <Link to={constants.ROUTES.HOME}>
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Página principal" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);