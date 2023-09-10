import React from 'react';
import './layoutStyles.css';


const DefaultLayout = ({ children }) => {
    return (
        <>
            <main style={{ minHeight: '100vh' }}>{children}</main>
        </>
    )
}

export default DefaultLayout;