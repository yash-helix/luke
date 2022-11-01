import axios from "axios";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CSVLink, CSVDownload } from 'react-csv';
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import "./UserTable.css";

const UserTable = ({ filterData }) => {
  const { logged, setLogged, UpdateAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [duplicateData, setduplicateData] = useState([]);
  const [errMsg, setErrMsg] = useState("Loading Tests");

  const [filter, setFilter] = useState({
    country: '',
    position: '',
  });
  const [countries, setCountries] = useState([]);
  const [positions, setPositions] = useState([]);

  const [arrowState, setArrowState] = useState({
    fullName: 'asc',
    position: 'asc',
    country: 'asc',
    score: 'asc',
    averageTime: 'asc',
    accuracy: 'asc',
    questionsAttempted: 'asc',
    correctAnswers: 'asc',
  });

  const CSVData = data;


  //get details of all tests
  const getTestDetails = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/getTestDetails`);
      if (res.data.success) {
        setData(res.data.user)
        setduplicateData(res.data.user)

        if (res.data.user.length > 0) {
          const allCountries = res.data.user.map(user => {
            return user.country
          });

          const allPositions = res.data.user.map(user => {
            return user.position
          });

          let allC = [...new Set(allCountries)]
          let allP = [...new Set(allPositions)]

          setCountries(allC);
          setPositions(allP);
        }
      }
      else {
        setErrMsg(res.data.msg)
      }
    }
    catch (error) {
      alert("Unexpected error occurred")
    }
  }

  useEffect(() => {
    if (!logged) navigate("/adminLogin", { replace: true })
    else getTestDetails();
  }, []);



  // Sorting
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
      setArrowState({ ...arrowState, [col]: "dsc" });
      setArrowState({ ...arrowState, [col]: "dsc" });
    } else {
      const sorted = [...data].sort((a, b) =>
        a[col].toString().toLowerCase() < b[col].toString().toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
      setArrowState({ ...arrowState, [col]: "asc" });
      setArrowState({ ...arrowState, [col]: "asc" });
    }
  };


  // filtering
  const Filter = (e) => {
    const { value, name } = e.target;
    setFilter(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  // Search
  useEffect(() => {
    if (filter.country !== "") {
      let filteredCountryData = duplicateData.filter((item) => item.country === filter.country);
      setData(filteredCountryData);
    }
    else {
      setData(duplicateData);
    }

    if (filter.position !== "") {
      let filteredPositionData = duplicateData.filter((item) => item.position === filter.position);
      setData(filteredPositionData);
    }
    else {
      setData(duplicateData);
    }
  }, [filter]);


  // Search
  useEffect(() => {
    if (filterData !== "") {
      let searchedData = duplicateData.filter((item) => {
        return item.fullName.toLowerCase().trim().includes(filterData.toLowerCase().trim());
      });
      setData(searchedData);

      searchedData.length <= 0 && setErrMsg("No tests found");
    }
    else {
      setData(duplicateData);
    }
  }, [filterData]);


  // send the qualified users list to slack
  const sendToppersList = async () => {
    const users = data.filter(user => user.score >= 10);

    if (users.length > 0) {

      let data = { text: '' };
      users.forEach((user, index) => {
        data.text += `Sr No. ${index + 1}.\nName: ${user.fullName}.\nEmail: ${user.email}.\nScore: ${user.score}\nCV: ${user.file}\n\n`
      });

      try {
        const res = await axios.post(process.env.REACT_APP_SLACK, JSON.stringify(data), {
          withCredentials: false,
          headers: {}
        });

        if (res.status === 200) {
          alert("Sent successfully");
        }
        else {
          alert("Message not sent");
        }
      }
      catch (error) {
        console.log(error)
        alert("Unexpected error occurred");
      }
    }
    else {
      alert("Cannot find any user whose score is more than 35");
    }
  }

  return (
    <div className="userTable mt-5">

      <div className="row">
        <div className="mb-4">
          <select name="country" onChange={Filter}>
            <option value="">Select Country</option>
            {countries.map((item, index) =>
              <option value={item} key={index} >{item}</option>
            )}
          </select>
        </div>

        <div>
          <select name="position" onChange={Filter}>
            <option value="">Select Position</option>
            {positions.map((item, index) =>
              <option value={item} key={index} >{item}</option>
            )}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {
          data.length > 0 &&
          <div className="my-3">
            <button className="btn btn-dark" onClick={sendToppersList}>Export to slack</button>
          </div>
        }

        {
          data.length > 0 &&
          <div className="my-3">
            <CSVLink data={CSVData}> <button className="btn btn-dark">Download CSV File </button></CSVLink>;
          </div>
        }

      </div>


      {
        data.length > 0 ?
          <table className="table table-striped">

            <thead className="bg-dark text-light border-dark border">
              <tr>
                <th onClick={(e) => sorting("fullName")}>Name {arrowState.fullName === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} </th>
                <th onClick={(e) => sorting("position")}>Position {arrowState.position === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} </th>
                <th onClick={(e) => sorting("country")}>Country {arrowState.country === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("score")}>Total Score {arrowState.score === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("questionsAttempted")}>Questions Attempted {arrowState.questionsAttempted === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("correctAnswers")}>Questions Answered Correctly {arrowState.correctAnswers === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("averageTime")}>
                  Average time taken per Question(in minutes)
                  {arrowState.averageTime === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </th>
                <th onClick={() => sorting("accuracy")}>
                  Accuracy (percent correct of questions answered)
                  {arrowState.accuracy === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}

                </th>
                <th onClick={() => sorting("cv")}>
                  CV {arrowState.cv === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>
                      <NavLink to={`/questionPaper/${val.fullName}/${val.userID}`} className="fw-semibold text-decoration-none">
                        {val.fullName}
                      </NavLink>
                    </td>
                    <td>{val.position}</td>
                    <td>{val?.country || ""}</td>
                    <td>{val.score}</td>
                    <td>{val.questionsAttempted}</td>
                    <td>{val.correctAnswers}</td>
                    <td>{val.averageTime}</td>
                    <td>{val.accuracy}</td>
                    <td>
                      {
                        val?.file ?
                          <a href={val.file} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                            Click to view
                          </a>
                          :
                          <p>Not Found</p>
                      }
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
          :
          <h1>{errMsg}</h1>
      }
    </div>
  );
};

export default UserTable;
