import React, { useEffect,useState,useReducer } from 'react';
import { Paper } from '@mui/material';
import './Home.css';
import Image from '../../../assets/images/imagen_principal.webp';
import apiClient from '../../../services/apiClient'
import { Form, Row,Col, Button } from 'react-bootstrap';
import CookieService from '../../../services/CookieService';
import { useNavigate } from 'react-router-dom';
import constants from '../../../assets/constants';
import md5 from 'md5';

const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`,
        // backgroundRepeat: 'no-repeat'
        backgroundSize: 'cover'
    }
};

const Home = () => {
    const navigate = useNavigate();
    const onLogin = async () =>{
        if(values.userName&&values.pass) {
            const data = {
                username: values.userName,
                password: md5(values.pass)
            }
            await apiClient.post('/admins/login',data)
            const user = {
                username: values.userName,
                token:'asdsfsdfasfd'
            }
            CookieService.set('user',JSON.stringify(user))
            navigate(constants.ROUTES.HOME)
            window.location.reload(false);
        }
    }

    const [user,setUser] = useState(null)

    useEffect(()=>{
        const user = CookieService.get('user');
        if(user) setUser(user)
    },[])

    const [values, updateValue] = useReducer(
        (state, update) => ({ ...state, ...update }),
        {
            userName:'',
            pass:''
        }
    );

    return (
        <Paper style={styles.paperContainer}>
            <div className='section-intro'>
                {user===null&&
                    <Form style={{borderRadius:8,backgroundColor:'white',padding:18}}>
                        <Row>
                            <Form.Group as={Row} className="mb-3" controlId="tourName">
                                <Form.Label column>Usuario</Form.Label>
                                <Col >
                                <Form.Control
                                onChange={(event) => {
                                    updateValue({userName: event.target.value})
                                }}
                                value={values.userName}
                                required
                                type="text"
                                maxLength={50}
                                />
                                </Col>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Row} className="mb-3" controlId="tourName">
                                <Form.Label column>Contraseña</Form.Label>
                                <Col >
                                <Form.Control
                                onChange={(event) => {
                                    updateValue({pass: event.target.value})
                                }}
                                value={values.pass}
                                required
                                type="password"
                                maxLength={50}
                                />
                                </Col>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Button style={{backgroundColor:'#4E598C'}} onClick={onLogin}>Iniciar Sesión</Button>
                        </Row>
                    </Form>
                }
            </div>
        </ Paper>
    )
}


export default Home;
