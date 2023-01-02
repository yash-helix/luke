import React, { useRef, useState, useEffect } from "react";
import { Stack, Container } from "@mui/system";
import { useNavigate } from "react-router";
import { OutlinedInput, TextField } from '@mui/material';
import axios from "axios";
import { typeOfTest, routeTypeTest } from "../../../testTypeModal"
import './TypingTest.css';
import Timer from "../Timer/Timer";
import { words } from "../../../static/words";
let Word = (props) => {

    const { text, active, correct } = props;

    if (correct === true) {
        return <span className="correct">{text + " "}</span>
    }

    if (correct === false) {
        return <span className="incorrect">{text + " "}</span>
    }

    if (active) {
        return <span className="active">{text + " "}</span>
    }
    return <span>{text} </span>
}


const getRandomSentences = () => {
    let quotes_array1 = words.sort(() => Math.random() > 0.5 ? 1 : -1).join(" ").toLowerCase();
    let line1 = (quotes_array1.substring(0, 80))
    let line2 = (quotes_array1.substring(80, 150))
    return line1 + line2;
}


const FingerFast = () => {
    Word = React.memo(Word)
    const navigate = useNavigate();
    const inputRef = useRef();
    const cloud = useRef(getRandomSentences().split(' '));

    const [wordIndex, setIndex] = useState(0);
    const [startCounting, setStartCounting] = useState(false);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [correctWordArray, setCorrectWordArray] = useState([]);
    const [timeup, setTimeUp] = useState(false);
    const [mount, setMount] = useState(false);

    const testID = localStorage.getItem("testID");
    const userID = localStorage.getItem("userID");
    useEffect(() => {
        if (mount) {
            const data = { testID, userID, isTypingTest: true }
            const res = axios.post(`${process.env.REACT_APP_SERVER}/user/getQuestionFromId`, data)
                .then(res => console.log(res));
        }
        setMount(true);
    }, [mount]);

    useEffect(() => {
        setCorrectWordArray([])
        setActiveWordIndex(0)
    }, [wordIndex])

    const processInput = (value) => {

        if (!startCounting) {
            setStartCounting(true)
        }

        if (value.endsWith(' ')) {
            setActiveWordIndex(index => index + 1)
            if (cloud.current.length - 2 == activeWordIndex) {
                setIndex(i => i + 1);
                //cloud.current = (getRandomSentences()).split(' ')
                cloud.current = (getRandomSentences()).split(' ')
            }

            inputRef.current.value = "";
            // Correct Word
            setCorrectWordArray(data => {
                const word = value.trim()
                const newResult = [...data]
                newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
                return newResult
            })
        }
    }
    //submit the typing test
    const SubmitTest = async () => {
        try {
            let userID = localStorage.getItem("userID");
            const testID = localStorage.getItem("testID");
            const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/submitTypingTest`,
                { testID, userID, score: correctWordArray.filter(Boolean).length });
            const type = res.data.testType ?? typeOfTest.Typing;
            if (type === typeOfTest.Typing_MCQs) { //Typing + Mcq
                navigate('/WaitingComponent', { replace: true, state: { type } });
                setTimeout(() => {
                    navigate(routeTypeTest.MCQs, { replace: true, state: { userID } });
                }, 5000)
                return;
            }

            if (res.data.success) {
                navigate("/testCompleted", { replace: true, state: { userID: userID } });
            }

            else {
                console.log(res.data.msg)
            }
        }
        catch (error) {
            console.log(error)
            console.log(error.response.data.error)
        }
    }

    function setTimeUpFun(timeup) {
        setTimeUp(timeup);
        SubmitTest();
    }

    return (
        <Stack sx={{
            backgroundColor: '#add5ff',
            //background: 'url(https://img.10fastfingers.com/img/layout/sprite-horizontal.png) 0px -200px repeat-x #add5ff;',
            height: "100vh", paddingTop: "5rem", width: "100vw"
        }}>
            <Container>
                <h2>Speed Typing Test</h2>
                <p className="para" style={{ border: "1px solid #8eb6d8", borderRadius: "9px", }}>{cloud.current.map((word, index) => {
                    return <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
                })}</p>
                <Stack sx={{
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center',
                    padding: "6px 4px", borderRadius: "4px",
                    background: "#A7C8E7",
                }}>
                    <TextField inputRef={inputRef} type='text' disabled={timeup}
                        onChange={(e) => processInput(e.target.value)}

                        inputProps={{
                            style: {
                                boxShadow: "#6d6161  5px 5px  3px -2px inset",
                                borderRadius: "4px", height: '2rem'
                            },
                        }}

                        sx={{
                            width: '75%', marginRight: '6px',
                            backgroundColor: 'white', border: 'none', borderRadius: "8px",
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "white"
                            },

                        }} />

                    <Timer startCounting={startCounting} correctWords={correctWordArray.filter(Boolean).length} setTimeUp={setTimeUpFun} />
                </Stack>
            </Container>
        </Stack>
    )
}

export default FingerFast;
