import React from 'react'
import * as Sentry from '@sentry/react';

const WaitingComponent = () => {
    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '10%' }} >
            <h1>Please Wait...</h1>
            <h6>You will be redirected to typing test...</h6>
        </div>
    )
}

export default Sentry.withProfiler(WaitingComponent);