import React, { useEffect } from 'react';
import { Paper } from '@mui/material';
import './Home.css';
import Image from '../../../assets/images/imagen_principal.jpg';
import apiClient from '../../../services/apiClient'

const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`,
        // backgroundRepeat: 'no-repeat'
        backgroundSize: 'cover'
    }
};

const Home = () => {
    useEffect(()=>{
        apiClient.get('/tours')
        .then((result)=>{
            console.log(result)
        })
        .catch(function (error) {
            console.log(error);
        })
    },[])
    return (
        <Paper style={styles.paperContainer}>
            <div className='section-intro'>
                <div className='section-intro-title'>
                    El futuro del Turismo
                </div>
            </div>
        </ Paper>
    )
}


export default Home;
