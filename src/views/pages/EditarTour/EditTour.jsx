/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useReducer,useState } from 'react';
import constants from '../../../assets/constants';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './EditTour.css';
import apiClient from '../../../services/apiClient'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { DateObject } from "react-multi-date-picker";
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Map, {Marker} from 'react-map-gl';
import Loader from '../../utils/Loader/Loader'


const EditTour = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [values, updateValue] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            tourName:'',
            description:'',
            description2:'',
            cupoMinimo:0,
            cupoMaximo:0,
            fecha:[],
            duracion:'',
            idioma:'',
            ciudad:'',
            puntoDeEncuentro:'',
            puntoDeEncuentroLat:'',
            puntoDeEncuentroLon:'',
            fotoPrincipal:'',
            fotosSecundarias:[],
            state:'',
        }
    );

    const [cities, setCities] = useState([]);
    const [loading,setLoading] = useState(false)


    const [modal, showModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(['']);

    const [position, setPosition] = useState(null);
    const [meetingPlace, setMeetingPlace] = useState([]);


    useEffect(()=>{
        getCities()
    },[])

    useEffect(()=>{
        if(id) searchTours()
    },[id])

    const searchTours = () => {
        setLoading(true)
        apiClient.get(`/tours/${id}`)
        .then((result)=>{
            setLoading(false)
            if(result) {
                const tour = result;
                console.log(tour.dates)
                updateValue({
                    tourName:tour.name,
                    description:tour.description,
                    description2:tour.considerations,
                    cupoMinimo:tour.minParticipants,
                    cupoMaximo:tour.maxParticipants,
                    fecha:tour.dates.map((item)=>{
                        return {
                            date: new DateObject({date:item.date.replace('T',' '),format:'YYYY-MM-DD HH:mm:ss'}),
                            people:item.people,
                            state:item.state
                        }
                    }),
                    duracion:tour.duration,
                    idioma:tour.lenguage,
                    ciudad:tour.city,
                    puntoDeEncuentro:tour.meetingPoint,
                    fotoPrincipal:tour.mainImage,
                    fotosSecundarias:tour.otherImages,
                    state:tour.state
                })
                const firstStep = tour.stops[0]
                setPosition({
                    lng:firstStep.lon,
                    lat:firstStep.lat,
                    tag:firstStep.tag
                })
                setMeetingPlace(tour.stops.map((item)=>{
                    return {
                        lng:item.lon,
                        lat:item.lat,
                        tag:item.tag
                    }
                }))
            }
        })
        .catch(function (error) {
            console.log(error);
            setLoading(false)
        })
    }

    const getCities = async () => {
        const cities = await apiClient.get('/cities')
        setCities(cities)
    }

    const editTour = async (state)=> {
        const data = {
            state:state
        }
        console.log(data)
        try {
            setLoading(true)
            const result = await apiClient.put(`/tours/${id}`,data)
            navigate(-1)
        } catch (error) {
            setLoading(false)
            let errorMsg = []
            for(const err in error.response.data) {
                errorMsg.push(`${err}: ${error.response.data[err].join(' ')}`)
            }
            setModalMessage(errorMsg)
            showModal(true)
            setLoading(false)
            console.log(error.response.data)
        }
    }

    return (
        <Container>
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>{values.tourName}</Card.Title>
                <Card.Body>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="description">
                            <Form.Label column >Descripcion</Form.Label>
                            <Col >
                            <Form.Control
                            value={values.description}
                            disabled
                            maxLength={200}
                            onChange={(event) => {
                                updateValue({description: event.target.value})
                            }}
                                as="textarea"
                            />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="description2">
                            <Form.Label column>Puntos a tener en cuenta</Form.Label>
                            <Col >
                            <Form.Control
                            value={values.description2}
                            disabled
                            maxLength={200}
                            onChange={(event) => {
                                updateValue({description2: event.target.value})
                            }}
                                as="textarea"
                            />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="cupoMinimo">
                            <Form.Label column >Cupo Minimo</Form.Label>
                            <Col >
                            <Form.Control
                            value={values.cupoMinimo}
                            disabled
                            required
                            onChange={(event) => {
                                updateValue({cupoMinimo: event.target.value})
                            }}
                            type="number"
                            />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="cupoMaximo">
                            <Form.Label column >Cupo Maximo</Form.Label>
                            <Col >
                            <Form.Control
                            disabled
                            required
                            value={values.cupoMaximo}
                            onChange={(event) => {
                                updateValue({cupoMaximo: event.target.value})
                            }}
                            type="number"
                            />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="fecha">
                            <Form.Label column>
                                Fechas
                            </Form.Label>
                            <Col >
                                {
                                    values.fecha.map((item)=>
                                    <Row key={item.date}>
                                        <Col style={{textAlign:'center'}}>{item.date.format('DD/MM/YYYY HH:mm')}</Col>
                                    </Row>)
                                }
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="duracion">
                            <Form.Label column >Duracion</Form.Label>
                            <Col >
                            <Form.Control
                            required
                            disabled
                            value={values.duracion}
                            onChange={(event) => {
                                updateValue({duracion: event.target.value})
                            }}
                            type="time"
                            />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="idioma">
                            <Form.Label column>Idioma</Form.Label>
                            <Col >
                                <Form.Select value={values.idioma} disabled onChange={(event) => {
                                    updateValue({ idioma: event.target.value})
                                }}>
                                    <option value={''}></option>
                                    {constants.IDIOMAS.map((item)=><option value={item}>{item}</option>)}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                    
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="ciudad">
                            <Form.Label column >Ciudad</Form.Label>
                            <Col >
                                <Form.Select value={values.ciudad} disabled onChange={(event) => {
                                    updateValue({ ciudad: event.target.value})
                                }}>
                                    <option value={''}></option>
                                    {cities.map((item)=><option value={item.name}>{item.name}</option>)}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group as={Row} className="mb-3" controlId="puntoDeEncuentro">
                            <Form.Label column >Detalles de Encuentro</Form.Label>
                            <Col >
                            <Form.Control
                            onChange={(event) => {
                                updateValue({puntoDeEncuentro: event.target.value})
                            }}
                            disabled
                            value={values.puntoDeEncuentro}
                            required
                            type="text"
                            maxLength={200}
                            />
                            </Col>
                        </Form.Group>
                    </Col>

                    <Col>
                    </Col>
                </Row>
                <Row>
                {position&&
                        <Map
                        mapboxAccessToken={constants.MAP_BOX_KEY}
                        initialViewState={{
                            longitude: position.lng,
                            latitude: position.lat,
                            zoom: 14
                        }}
                        style={{width: 600, height: 400}}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        >
                            {meetingPlace.map((item)=>{
                                return(
                                    <Marker key={`${item.lng}&${item.lat}`} longitude={item.lng} latitude={item.lat}></Marker>
                                )
                            })
                            }
                        </Map>
                }
                </Row>
                <Row>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="fotoPrincipal" className="mb-3">
                            <Form.Label >Imagen Principal</Form.Label>
                        </Form.Group>   
                    </Col>
                    
                    <Col xs={4} md={4}>
                        {values.fotoPrincipal&&<Image src={values.fotoPrincipal} thumbnail  />}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId="fotoPrincipal" className="mb-3">
                            <Form.Label>Fotos Secundarias</Form.Label>
                        </Form.Group>   
                    </Col>
                </Row>
                <Row>
                    {values.fotosSecundarias.map((item,index)=>
                        <Col xs={2} md={2} style={{position:'relative'}} key={item}>
                            <Image src={item} thumbnail  />
                        </Col>
                    )}
                </Row>
                {(values.state==='borrador'||values.state==='pendiente')&&<Row>
                    <Col></Col>
                    <Col></Col>

                    <Col>
                        <Button className="new" onClick={()=>editTour('abierto')}>Activar Paseo</Button>
                    </Col>
                    <Col>
                        <Button className="cancel" onClick={()=>editTour('cancelado')}>Desactivar Paseo</Button>
                    </Col>
                </Row>}
                </Card.Body>
            </Card>
            
            {modal&&<div
                className="modal show modal-full-page"
            >
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Edicion del Paseo</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalMessage.map((item)=><p>{item}</p>)}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>showModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal.Dialog>
            </div>}
        {loading&&<Loader></Loader>}
        </Container>
    )
}


export default EditTour;