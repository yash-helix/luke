import { Button, TextField } from '@mui/material'
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export const Feedback = () => {

    const navigate = useNavigate();

    const [feedback, setFeedback] = useState({
        text: '',
    });

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFeedback((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const { state } = useLocation();

    const submitHandler = async (e) => {
        const apibody = {
            text: feedback?.text,
            userID: state?.userID
        }
        try {
            const res = await axios.post('http://localhost:5000/user/createfeedback',
                apibody
            );
            if (res.data.success) {
                navigate('/testCompleted', { replace: true })
            } else {
                alert(res.data.msg);
            }
        }
        catch (err) {
            console.log(err);
        }
        setFeedback({ text: '' })
    }

    return <div className="container-fluid d-flex justify-content-center align-items-center flex-column" style={{ height: "100vh", backgroundColor: "#DCDCDC" }}><div className="shadow p-5 bg-light" style={{ minWidth: "600px", borderRadius: '5px' }}>
        <div className="card-body flex-column d-flex justify-content-start mb-3">
            <h5>Please Share Your Valuable Feedback...</h5>
            <TextField variant='outlined' name='text' value={feedback.text} onChange={changeHandler} fullWidth multiline small='true' />
        </div>
        <div className='d-flex justify-content-between'>
            <Button type='submit' onClick={(e) => submitHandler(e)} variant='contained'>Submit Feedback</Button>

            <Button variant="outlined" size='samll' onClick={() => navigate('/testCompleted', { replace: true })}>Skip</Button>
        </div>
    </div>
    </div>
}