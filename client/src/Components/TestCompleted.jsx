import React from "react"

const TestCompleted = () => {
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
  </div>
}

export default TestCompleted;