/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState,useReducer } from 'react';
import './ToursList.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import constants from '../../../assets/constants';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Loader from '../../utils/Loader/Loader';
import Form from 'react-bootstrap/Form';

const TourList = () => {
    const navigate = useNavigate();

    const [tours, setTours] = useState(null);
    const [loading,setLoading] = useState(false)
    const [showFilters,setShowFilters] = useState(false)

    const [filters, updateFilters] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            city:'',
            name:'',
        }
    );

    const [cities, setCities] = useState([]);


    useEffect(()=>{
        searchTours()
        getCities()
    },[])

    useEffect(()=>{
        searchTours()
    },[filters.city,filters.name])

    const getCities = async () => {
        const cities = await apiClient.get('/cities')
        setCities(cities)
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
        apiClient.get(`/tours?${params}`)
        .then((result)=>{
            console.log(result)
            setTours(result)
            setLoading(false);
        })
        .catch(function (error) {
            console.log(error);
            setLoading(false);
        })
    }

    const createTour = () => {
        navigate(constants.ROUTES.NEW_TOUR)
    }

    const editTour = (id) =>{
        console.log('editTour',id)
        navigate(constants.ROUTES.TOUR_LIST+'/'+id)
    }

    const tourComments = (id) =>{
        console.log('editTour',id)
        navigate(constants.ROUTES.TOUR_LIST+'/'+id+'/comments')
    }

    return (
        <Container>
            <Row style={{ marginBottom:12 }}>
                <Col>
                    <Button className='primary-button' onClick={createTour}>
                        <FontAwesomeIcon icon={faPlus} className='button-icon'></FontAwesomeIcon>
                        Nuevo Paseo
                    </Button>
                </Col>

                <Col>
                    <Button className='primary-button' onClick={()=>setShowFilters(!showFilters)}>
                        <FontAwesomeIcon icon={faFilter} className='button-icon'></FontAwesomeIcon>
                        Filtros
                    </Button>
                </Col>
            </Row>
            {showFilters&&
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
                        <Form.Group as={Row} className="mb-3" controlId="city">
                            <Col >
                                <Form.Select placeholder='Ciudad' value={filters.city} onChange={(event) => {
                                    updateFilters({ city: event.target.value})
                                }}>
                                    <option value={''}></option>
                                    {cities.map((item)=><option value={item.name}>{item.name}</option>)}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            }
            {
                tours&&
                tours.map((item)=>
                <Card style={{ width: '50vw',marginBottom:12 }} key={item._id.$oid}>
                    <Card.Body>
                        <Row>
                            <Col xs={3} md={3}>
                                <Image variant="top" src={item?.mainImage} style={{maxWidth:'11vw'}} />
                            </Col>
                            <Col>
                                <Card.Title>{item?.name}</Card.Title>
                                <Card.Text style={{paddingLeft:12}}>
                                    <Row>{item?.description}</Row>
                                    <Row>{'Pendiente de Aprobación'}</Row>
                                </Card.Text>
                                <Button variant="primary" onClick={()=>editTour(item._id.$oid)}>Ver Detalle</Button>
                                <Button variant="primary" style={{marginLeft:8}} onClick={()=>tourComments(item._id.$oid)}>Ver Comentarios</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                )
            }
        {loading&&<Loader></Loader>}
        </Container>
    )
}


export default TourList;