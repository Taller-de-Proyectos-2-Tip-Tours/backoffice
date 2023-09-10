import React from 'react';
import {
    Spinner,
} from 'react-bootstrap';
import "./Loader.css"
const Loader = () => {

    return(
        <div className='loaderContainer'>
            <Spinner animation="border" variant="primary" className='loader' />
        </div>
    )
}

export default Loader