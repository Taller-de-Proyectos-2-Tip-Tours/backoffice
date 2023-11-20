/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Container from 'react-bootstrap/Container';
import './dashboards.css';
import MapDashboards from './mapDashboard/mapDashboard';

const Dashboards = () => {
    return (
        <Container>
            <MapDashboards></MapDashboards>
        </Container>
    )
}

export default Dashboards;
