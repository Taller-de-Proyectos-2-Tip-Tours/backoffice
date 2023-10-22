/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect,useState } from 'react';
import constants from '../../../assets/constants';
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

const Comments = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading,setLoading] = useState(false)

    const [comments,setComents] = useState([])
    const [commentsToShow,setComentsToShow] = useState([])
    const [rating,setRating] = useState(null)

    const [page,setPage] = useState(0)
    const [pageSize,setPageSize] = useState(5)
    const [cantPages,setPageCant] = useState(0)

    useEffect(()=>{
        if(id) getComments()
    },[id])

    const getComments = () => {
        apiClient.get(`/reviews/${id}?state=active`)
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
            rating = notCero.map(item=>item.stars).reduce((prev,curr)=>prev+curr)
            setRating(rating)
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

    return(
        <>
        {rating&&<Row style={{marginTop:12,marginBottom:12,alignItems:'center'}}>
            <Col><h2>Valoraciones</h2></Col>
            <Col><Rating defaultValue={rating} precision={0.5} readOnly /></Col>
        </Row>}
        <Row style={{justifyContent:'center'}}>
            <h2>Reseñas</h2>
            {commentsToShow&&commentsToShow.map((item,index)=>{
                return <Card style={{paddingLeft:0,paddingRight:0,maxWidth:600,marginBottom:12}} key={`${item?._id?.$oid}${index}`}>
                    <Card.Title style={{backgroundColor:'#4E598C',color:'white',paddingLeft:8}}><Row style={{marginTop:4}}><Col>{item.userName}</Col><Col style={{fontSize:16}}>{moment(item.date).format('DD/MM/YYYY HH:ss')}</Col></Row></Card.Title>
                    <Card.Body>
                        <Row>{item.comment}</Row>
                        <Row><span style={{justifyContent:'end',display:'flex',alignItems:'center'}}>{item.stars}<FontAwesomeIcon style={{color:'#caca03'}} icon={faStar}></FontAwesomeIcon></span></Row>
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
        </>
    )
}

export default Comments;
