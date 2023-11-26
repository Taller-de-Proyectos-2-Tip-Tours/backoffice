/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Container from 'react-bootstrap/Container';
import './dashboards.css';
import MapDashboards from './mapDashboard/mapDashboard';
import AppEvolution from './appEvolution/appEvolution';
import Top10tours from './top10tours/top10tours';
import Top10toursValorados from './top10toursValorados/top10toursValorados';
import CommentsPieChart from './CommentsPieChart/CommentsPieChart';

const Dashboards = () => {
    return (
        <Container>
            <MapDashboards></MapDashboards>
            <AppEvolution></AppEvolution>
            <Top10tours></Top10tours>
            <Top10toursValorados></Top10toursValorados>
            <CommentsPieChart></CommentsPieChart>
        </Container>
    )
}

export default Dashboards;
