/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState,useReducer,useRef } from 'react';
import Container from 'react-bootstrap/Container';
import './mapDashboard.css';
import CookieService from '../../../../services/CookieService';
import apiClient from '../../../../services/apiClient'
import constants from '../../../../assets/constants';
import { useNavigate } from "react-router-dom";
import Map, {Marker,Popup} from 'react-map-gl';
import Loader from '../../../utils/Loader/Loader';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const MapDashboards = () => {
    const navigate = useNavigate();

    const [tours, setTours] = useState([]);
    const [tour, setTour] = useState(null);
    const [loading,setLoading] = useState(false)
    const popupRef = useRef();

    const [filters, updateFilters] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            city:'',
            name:'',
            state:'abierto',
            guideEmail:''
        }
    );

    const [cities, setCities] = useState([]);
    const states = [
        'abierto',
        'borrador',
        'cancelado',
    ]

    useEffect(()=>{
        searchTours()
        getCities()
    },[])

    useEffect(()=>{
        console.log('tour',tour)
    },[tour])

    useEffect(()=>{
        searchTours()
    },[filters.city,filters.name,filters.state,filters.guideEmail])

    const getCities = async () => {
        const token = CookieService.get('token')
        try {
            const cities = await apiClient.get('/cities',{headers:{'token':token?JSON.parse(token):''}})
            setCities(cities)
        } catch (err) {
            console.error(err)
            if(err?.response?.status===401) {
                navigate(constants.ROUTES.HOME)
                window.location.reload(false);
            }
        }
        
    }

    const searchTours = () => {
        setLoading(true);
        let params = ''
        if(filters.city) {
            params += `&city=${filters.city}`
        }
        if(filters.name) {
            params += `&name=${filters.name}`
        }
        if(filters.state) {
            params += `&state=${filters.state}`
        }
        if(filters.guideEmail) {
            params += `&guideEmail=${filters.guideEmail}`
        }
        const token = CookieService.get('token')
        apiClient.get(`/tours?${params}`,{headers:{'token':token?JSON.parse(token):''}})
        .then((result)=>{
            for (const tour of result) {
                tour.stops = tour.stops?tour.stops[0]:null
            }
            console.log('searchTours result',result)
            
            setTours(result)
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
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                    Paseos en Argentina
                </Card.Title>
                <Card.Body>
                    <Row style={{ marginBottom:12 }}>
                        <Col>
                            <Form.Group as={Row} className="mb-3" controlId="name">
                                <Form.Control
                                onChange={(event) => {
                                    updateFilters({name: event.target.value})
                                }}
                                value={filters.name}
                                required
                                type="text"
                                maxLength={50}
                                placeholder='Nombre del Paseo'
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group as={Row} style={{marginLeft:4}} className="mb-3" controlId="guideEmail">
                                <Form.Control
                                onChange={(event) => {
                                    updateFilters({guideEmail: event.target.value})
                                }}
                                value={filters.guideEmail}
                                required
                                type="text"
                                maxLength={50}
                                placeholder='Mail del Guía'
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group as={Row} className="mb-3" controlId="city">
                                <Col >
                                    <Form.Select placeholder='Ciudad' value={filters.city} onChange={(event) => {
                                        updateFilters({ city: event.target.value})
                                    }}>
                                        <option key='blankChoice' hidden={filters.city===''} value='' >{filters.city===''?'Ciudad':''}</option>
                                        {cities.map((item)=><option key={item.name} value={item.name}>{item.name}</option>)}
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group as={Row} className="mb-3" controlId="state">
                                <Col >
                                    <Form.Select placeholder='Estado' value={filters.state} onChange={(event) => {
                                        updateFilters({ state: event.target.value})
                                    }}>
                                        <option key='blankChoice' hidden={filters.state===''} value='' >{filters.state===''?'Estado':''}</option>
                                        {states.map((item,index)=><option key={item} value={item}>{item}</option>)}
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row style={{justifyContent:'center'}}>
                        <Map
                        mapboxAccessToken={constants.MAP_BOX_KEY}
                        initialViewState={{
                            longitude: -65.105942,
                            latitude:  -37.346242,
                            zoom: 3.5
                        }}
                        style={{width: 400, height: 750}}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        >
                            {tours.map((item)=>{
                                return(
                                    <Marker onClick={(e)=>{
                                        setTour(item)
                                        e.originalEvent.stopPropagation();
                                    }} key={`${item.stops.lat}&${item.stops.lon}`} longitude={item.stops.lon} latitude={item.stops.lat}></Marker>
                                )
                            })
                            }
                            {tour&&
                                <Popup anchor="top" longitude={tour.stops.lon} latitude={tour.stops.lat}  ref={popupRef} onClose={() => setTour(null)}>
                                    <Row key={tour._id.$oid}>
                                        <Col>
                                            <Card.Title>
                                                <Row>
                                                    <Col>{tour?.name}</Col>
                                                </Row>
                                            </Card.Title>
                                            <Card.Text style={{paddingLeft:12}}>
                                                <Row>Guía: {tour.guide.name}, {tour.guide.email}</Row>
                                                <Row>{tour?.description}</Row>
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Popup>
                            }
                        </Map>
                    </Row>
                </Card.Body>
            </Card>
            
        {loading&&<Loader></Loader>}
        </Container>
    )
}

export default MapDashboards;
