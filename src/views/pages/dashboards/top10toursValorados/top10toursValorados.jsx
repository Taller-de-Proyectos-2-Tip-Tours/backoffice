/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState,useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import './top10toursValorados.css';
import CookieService from '../../../../services/CookieService';
import apiClient from '../../../../services/apiClient'
import constants from '../../../../assets/constants';
import { useNavigate } from "react-router-dom";
import Loader from '../../../utils/Loader/Loader';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import moment from 'moment/moment';
import DatePicker from "react-multi-date-picker";
import { ResponsiveBar } from '@nivo/bar';

const Top10toursValorados = () => {
    const navigate = useNavigate();

    const [loading,setLoading] = useState(false)
    const [filters, updateFilters] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            from:moment().add(-3,'month').format('YYYY-MM-DD'),
            to:moment().format('YYYY-MM-DD'),
        }
    )

    const [data,setData] = useState(null);
    
    useEffect(()=>{
        getData()
    },[filters.from,filters.to])

    const getData = async () => {
        setLoading(true);
        let params = ''
        if(filters.from) {
            params += `start_date=${filters.from}`
        }
        if(filters.to) {
            params += `&end_date=${filters.to}`
        }

        const token = CookieService.get('token')
        apiClient.get(`/dashboards/besttours?${params}`,{headers:{'token':token?JSON.parse(token):''}})
        .then(async (result)=>{
            console.log('getData top 10 valorados result',result)
            setData(result.map((item)=>{
                return {
                    Puntuación:item.score,
                    Paseo:item.tour,
                }
            }))
            setLoading(false);
        })
        .catch(function (error) {
            setLoading(false);
            console.log('searchTours err',error);
            if(error?.response?.status===401) {
                navigate(constants.ROUTES.HOME)
                window.location.reload(false);
            }
        })
    }

    return (
        <Container>
            {loading&&<Loader></Loader>}
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                    Top 10 Paseos Valorados
                </Card.Title>
                <Card.Body>
                <Row style={{ marginBottom:12 }}>
                        <Col>
                            <Form.Group as={Row} className="mb-3" controlId="name">
                                <DatePicker
                                value={filters.from}
                                onChange={(date)=>{
                                    updateFilters({from:date})
                                }}
                                format="YYYY-MM-DD"
                                sort
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group as={Row} style={{marginLeft:4}} className="mb-3" controlId="guideEmail">
                                <DatePicker
                                value={filters.to}
                                onChange={(date)=>updateFilters({to:date})}
                                format="YYYY-MM-DD"
                                sort
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row style={{height:'300px'}}>
                        {data&&<ResponsiveBar
                            data={data}
                            keys={['Puntuación']}
                            indexBy="Paseo"
                            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                            padding={0.3}
                            colors={{ scheme: 'nivo' }}
                            enableGridY={false}
                            enableLabel={false}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                            legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'top',
                                direction: 'column',
                                justify: false,
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20,
                                effects: [
                                {
                                    on: 'hover',
                                    style: {
                                    itemOpacity: 1,
                                    },
                                },
                                ],
                            },
                            ]}
                        />}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default Top10toursValorados;
