import './App.css';
import React, { useEffect } from 'react';

//imports
import { HashRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

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