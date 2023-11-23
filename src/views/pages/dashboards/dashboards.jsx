/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Container from 'react-bootstrap/Container';
import './dashboards.css';
import MapDashboards from './mapDashboard/mapDashboard';
import AppEvolution from './appEvolution/appEvolution';

const Dashboards = () => {
    return (
        <Container>
            <MapDashboards></MapDashboards>
            <AppEvolution></AppEvolution>
        </Container>
    )
}

export default Dashboards;
