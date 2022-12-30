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

let quotes_array = [
    "Push yourself, because no one else is going to do it for you ",
    "water away good want over going where would took school think home know bear again ",
    "Failure is the condiment that gives success its flavor magic shouted other food through been stop must door right ",
    "Wake up with determination. Go to bed with satisfaction know bear again long things after wanted eat ",
    "It's going to be hard, but hard does not mean impossible  good want over going where would took school think ",
    "Learning never exhausts the mind  must door right these began animals next first work ",
    "The only way to do great work is to love what you do  baby fish mouse something ",
    "The clouds formed beautiful animals in the sky that eventually created a tornado to wreak havoc. ",
    "The shark-infested South Pine channel was the only way in or out. He was an introvert that extroverts seemed to love.",
    "I'm worried by the fact that my daughter looks to the local carpet seller as a role model.",
];
const getWords = () => `water away good want over going where would took school think home 
know bear again long things after wanted eat everyone play thought well find more 
round tree magic shouted other food through been stop must door right these began 
animals next first work baby fish mouse something`.toLowerCase().split(' ').sort(() => Math.random() > 0.5 ? 1 : -1)
const getRandomSentences = () => {
    let quotes_array1 = words.sort(() => Math.random() > 0.5 ? 1 : -1).join(" ").toLowerCase();
    let line1 = (quotes_array1.substring(0, 80))
    let line2 = (quotes_array1.substring(80, 150))
    return line1 + line2;
}
const FingerFast = () => {



    const [wordIndex, setIndex] = useState(0);
    const cloud = useRef(getRandomSentences().split(' '));
    Word = React.memo(Word)
    const navigate = useNavigate();
    const [startCounting, setStartCounting] = useState(false);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [correctWordArray, setCorrectWordArray] = useState([]);
    const [timeup, setTimeUp] = useState(false);
    const testID = localStorage.getItem("testID");
    const userID = localStorage.getItem("userID");
    const [mount, setMount] = useState(false);
    const inputRef = useRef();
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
        } else {
            // setUserInput(value)
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
        <Stack sx={{ backgroundColor: '#add5ff', height: "100vh", paddingTop: "5rem", width: "100vw" }}>
            <Container>
                <h2>Speed Typing Test</h2>
                <p className="para" style={{ border: "1px solid #8eb6d8", borderRadius: "9px", }}>{cloud.current.map((word, index) => {
                    return <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
                })}</p>
                <Stack sx={{
                    display: 'flex', flexDirection: 'row',
                    alignItems: 'center', justifyContent: 'center',
                    padding: "4px", borderRadius: "4px",
                    background: "#A7C8E7",
                }}>
                    {/* <Stack stack={"true"} width='50%'> */}
                    <TextField
                        rows={6}
                        inputProps={{
                            style: {
                                boxShadow: "inset 5px 5px 14px -6px black",
                                borderRadius: "4px",
                            },
                        }}
                        inputRef={inputRef}
                        sx={{
                            width: '75%', marginRight: '6px',
                            backgroundColor: 'white', border: 'none', borderRadius: "8px",
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "white"
                            },

                        }}
                        type='text' //value={userInput}
                        disabled={timeup} onChange={(e) => processInput(e.target.value)} />

                    <Timer startCounting={startCounting} correctWords={correctWordArray.filter(Boolean).length} setTimeUp={setTimeUpFun} />
                </Stack>
            </Container>
        </Stack>
    )
}

export default FingerFast;
