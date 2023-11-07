/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './Comments.css';
import apiClient from '../../../services/apiClient'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Loader from '../../utils/Loader/Loader';
import moment from 'moment/moment';
import Pagination from 'react-bootstrap/Pagination';
import { Rating } from '@mui/material';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';

const Comments = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading,setLoading] = useState(false)

    const [comments,setComents] = useState([])
    const [commentsToShow,setComentsToShow] = useState([])
    const [rating,setRating] = useState(null)
    const [tour,setTour] = useState(null)

    const [page,setPage] = useState(0)
    const [pageSize,setPageSize] = useState(5)
    const [cantPages,setPageCant] = useState(0)

    const [modal, showModal] = useState(false);
    const [modalMessage, setModalMessage] = useState(['']);

    useEffect(()=>{
        if(id) getTour()
        if(id) getComments()
    },[id])

    const getTour = () => {
        apiClient.get(`/tours/${id}`,{headers:{'token':'admin'}})
        .then((result)=>{
            setLoading(false)
            if(result) {
                setTour(result)
            }
        })
        .catch(function (error) {
            console.log(error);
            setLoading(false)
        })
    }

    const getComments = () => {
        apiClient.get(`/reviews/${id}`,{headers:{'token':'admin'}})
        .then((result)=>{
            setComentsToShow(result.slice(page*pageSize,(page+1)*pageSize))
            setPageCant(Math.ceil(result.length/pageSize))
            
            console.log('rating',rating)
            setComents([...result])
        })
    }

    useEffect(()=>{
        if(comments.length>0) {
            let rating = 0
            const notCero = comments.filter((item)=>item.stars!==0)
            const total = notCero.length
            rating = notCero.map(item=>item.stars).reduce((prev,curr)=>prev+curr)
            setRating(rating/total)
        }
    },[comments])

    useEffect(()=>{
        if(comments.length) setComentsToShow(comments.slice(page*pageSize,(page+1)*pageSize))
    },[page])

    const getPaginationItems = () => {
        const items = []
        for(let i = 0; i < cantPages;i++) {
            items.push(
                <Pagination.Item key={i} active={i === page} onClick={()=>{setPage(i)}}>
                    {i+1}
                </Pagination.Item>
            )
        } 
        return items
    }

    const deleteComment = async (id)=> {
        try{
            setLoading(true)
            const result = apiClient.delete(`/reviews/${id}`,{headers:{'token':'admin'}})
            setLoading(false)
            setModalMessage(['El comentario fue borrado con Exito'])
            showModal(true)
            getComments()
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

    return(
        <>
        <Container>
            <Card>
                <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:12}}>
                    <Row>
                        <Col>{tour?.name}</Col>
                        <Col xs={3}>{tour?.guide?.name}</Col>
                    </Row>
                </Card.Title>
                <Card.Body>
                    {rating&&<Row style={{marginTop:12,marginBottom:12,alignItems:'center'}}>
                        <Col><h2>Valoraciones</h2></Col>
                        <Col><Rating defaultValue={rating} precision={0.5} readOnly /></Col>
                    </Row>}
                    <Row style={{justifyContent:'center'}}>
                        <h2>Reseñas</h2>
                        {commentsToShow&&commentsToShow.map((item,index)=>{
                            return <Card style={{paddingLeft:0,paddingRight:0,maxWidth:600,marginBottom:12}} className={item.state==='inactive'?'deactivated-comments':''} key={`${item?._id?.$oid}${index}`}>
                                <Card.Title style={{color:'white',paddingLeft:8}} className={item.state==='inactive'?'cancel':'commemt'}><Row style={{marginTop:4}} ><Col>{item.userName}</Col><Col style={{fontSize:16}}>{moment(item.date).format('DD/MM/YYYY HH:ss')}</Col></Row></Card.Title>
                                <Card.Body>
                                    <Row>{item.comment}</Row>
                                    <Row><span style={{justifyContent:'end',display:'flex',alignItems:'center'}}>{item.stars}<FontAwesomeIcon style={{color:'#caca03'}} icon={faStar}></FontAwesomeIcon></span></Row>
                                    {item.state!=='inactive'&&<Row><Col style={{textAlign:'end'}}><Button onClick={()=>deleteComment(item?._id?.$oid)} className="cancel">Desactivar Comentario</Button></Col></Row>}
                                </Card.Body>
                            </Card>
                        })}
                    </Row>
                    {comments&&
                        <Pagination style={{justifyContent:'center'}}>
                            <Pagination.First onClick={()=>setPage(0)} />
                            <Pagination.Prev onClick={()=>{
                                if(page-1>=0) {
                                    setPage(page-1)
                                }
                            }}/>
                            {getPaginationItems()}
                            <Pagination.Next  onClick={()=>{
                                if(page+1<cantPages) {
                                    setPage(page+1)
                                }
                            }}/>
                            <Pagination.Last onClick={()=>setPage(cantPages-1)}/>
                        </Pagination>
                    }
                    {loading&&<Loader></Loader>}
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
                </Card.Body>
            </Card>
        </Container>
        </>
    )
}

export default Comments;
