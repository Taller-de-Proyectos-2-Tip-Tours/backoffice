/* eslint-disable no-unused-vars */
/* eslint-disable import/no-webpack-loader-syntax */
import './App.css';
import React, { useEffect } from 'react';

//imports
import { HashRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import mapboxgl from '!mapbox-gl';

// pages
import Dashboard from './views/dashboard/Dashboard';

function App() {
  useEffect(() => {
    document.title = "Tip Tours Backoffice"
  }, [])
  return (
    <HashRouter>
      <Dashboard />
    </HashRouter>
  );
}

export default App;