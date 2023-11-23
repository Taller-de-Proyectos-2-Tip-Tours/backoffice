/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState,useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import './appEvolution.css';
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
import { ResponsiveLine } from '@nivo/line'

const AppEvolution = () => {
    const navigate = useNavigate();
    const [guides,setGuides] = useState(null)
    const [travelers,setTravelers] = useState([])
    const [loading,setLoading] = useState(false)
    const [filters, updateFilters] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            from:moment().add(-1,'month').format('YYYY-MM-DD'),
            to:moment().format('YYYY-MM-DD'),
            guides:true,
            travelers:true
        }
    )

    useEffect(()=>{
        getData()
    },[filters.from,filters.to])

    const getData = () => {
        setLoading(true);
        let params = ''
        if(filters.from) {
            params += `start_date=${filters.from}`
        }
        if(filters.to) {
            params += `&end_date=${filters.to}`
        }
        console.log('getData filters',params)

        const token = CookieService.get('token')
        apiClient.get(`/dashboards/evolution?${params}`,{headers:{'token':token?JSON.parse(token):''}})
        .then((result)=>{
            console.log('getData result',result)
            const guideData = {
                id: "Guía",
                color: "hsl(144, 70%, 50%)",
                data:result.guides.map((item)=>{
                    return {
                        x:item.date,
                        y:item.guides,
                    }
                })
            }
            setGuides(guideData)

            const travelerData = {
                id: "Turistas",
                color: "hsl(337, 70%, 50%)",
                data:result.travelers.map((item)=>{
                    return {
                        x:item.date,
                        y:item.travelers,
                    }
                })
            }
            console.log('guideData',[guideData,travelerData])

            setTravelers(travelerData)
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

    const getDataDisplay = () => {
        const data = []
        if(filters.guides) data.push(guides)
        if(filters.travelers) data.push(travelers)
        return data
    }

    return (
        <Container>
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                    Evolución de plataforma
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

                        <Col>
                            <Form.Group as={Row} style={{marginLeft:4}} className="mb-3" controlId="guideEmail">
                                <Form.Check 
                                checked={filters.guides}
                                label={`Guías`}
                                onChange={()=>{updateFilters({guides:!filters.guides})}}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group as={Row} style={{marginLeft:4}} className="mb-3" controlId="guideEmail">
                                <Form.Check 
                                checked={filters.travelers}
                                label={`Turistas`}
                                onChange={()=>{updateFilters({travelers:!filters.travelers})}}
                                />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row style={{height:'600px'}}>
                        {guides&&travelers&&<ResponsiveLine
                            data={getDataDisplay()}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            xScale={{ type: 'time', format: '%Y-%m-%d' }}
                            yScale={{
                                type: 'linear',
                                min: 'auto',
                                max: 'auto',
                                stacked: true,
                                reverse: false
                            }}
                            curve="monotoneX"
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 45,
                                format: '%Y-%m-%d',
                            }}
                            axisLeft={{
                                orient: 'left',
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                            }}
                            pointSize={10}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabelYOffset={-11}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                        /> }
                    </Row>
                </Card.Body>
            </Card>
            {loading&&<Loader></Loader>}
        </Container>
    )
}

export default AppEvolution;