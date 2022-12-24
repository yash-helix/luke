import React from 'react'
import * as Sentry from '@sentry/react';
import { useLocation } from 'react-router-dom';

const WaitingComponent = () => {

    const { state } = useLocation();
    console.log(state);

    return (
        <>
            {(state.type === 3) ?
                <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '10%' }}>
                    <h1>Please Wait...</h1>
                    <h6>You will be redirected to Typing test...</h6>
                </div>
                :
                <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '10%' }}>
                    <h1>Please Wait...</h1>
                    <h6>You will be redirected to MCQs test...</h6>
                </div>
            }
        </>
    )
}

export default Sentry.withProfiler(WaitingComponent);