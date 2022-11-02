import { Button, TextField } from '@mui/material'
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TestCompleted = () => {

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
    e.preventDefault();
    const apibody = {
      text: feedback.text,
      userID: state.userID
    }
    try {
      const res = await axios.post('http://localhost:5000/user/createfeedback',
        apibody
      );
      console.log(res);
    }
    catch (err) {
      console.log(err);
    }
    setFeedback({ text: '' })
  }

  return <div className="container-fluid d-flex justify-content-center align-items-center flex-column" style={{ height: "100vh", backgroundColor: "#DCDCDC" }}>
    <div className="shadow p-5 bg-light" style={{ maxWidth: "600px", marginBottom: '15px', borderRadius: '5px' }}>
      <div className="card-body d-flex justify-content-center align-items-center">
        <div>
          <h3>Successfully Submitted Test...</h3>
          <p className='mb-0'>
            Thank you for completing the Aptitude Assessment! We will contact you regarding your application if we are interested in speaking with you. Performance on this assessment is only a component of our application review process.
          </p>
        </div>
      </div>
    </div>

    <div className="shadow p-5 bg-light" style={{ minWidth: "600px", borderRadius: '5px' }}>
      <div className="card-body flex-column d-flex justify-content-start mb-3">
        <h5>Please Share Your Valuable Feedback...</h5>
        <TextField variant='outlined' name='text' value={feedback.text} onChange={changeHandler} fullWidth multiline small />
      </div>
      <div className='d-flex justify-content-center'>
        <Button type='submit' onClick={(e) => submitHandler(e)} variant='outlined'>Submit Feedback</Button>
      </div>
    </div>

  </div>
}

export default TestCompleted