/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import './dashboards.css';
import MapDashboards from './mapDashboard/mapDashboard';
import AppEvolution from './appEvolution/appEvolution';
import Top10tours from './top10tours/top10tours';
import Top10toursValorados from './top10toursValorados/top10toursValorados';
import CommentsPieChart from './CommentsPieChart/CommentsPieChart';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Dashboards = () => {
    return (
        <>
            <Row style={{marginTop:12}}>
                <Col>
                    <MapDashboards></MapDashboards>
                </Col>
                <Col>
                    <AppEvolution></AppEvolution>
                    <Top10tours></Top10tours>
                    
                </Col>
            </Row>
            <Row style={{marginTop:12}}>
                <Col><Top10toursValorados></Top10toursValorados></Col>
                <Col><CommentsPieChart></CommentsPieChart></Col>
            </Row>
        </>
    )
}

export default Dashboards;
