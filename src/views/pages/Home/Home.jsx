import React from 'react';
import { Paper } from '@mui/material';
import './Home.css';
import Image from '../../../assets/images/imagen_principal.jpg';

const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`,
        // backgroundRepeat: 'no-repeat'
        backgroundSize: 'cover'
    }
};

const Home = () => {
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
