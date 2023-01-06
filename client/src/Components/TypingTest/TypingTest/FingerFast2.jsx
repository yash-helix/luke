import React, { useRef, useState, useEffect } from "react";
import { Stack, Container } from "@mui/system";
import { useNavigate } from "react-router";
import { TextField } from '@mui/material';
import axios from "axios";
import { typeOfTest } from "../../../testTypeModal"
import './TypingTest.css';
import Timer from "../Timer/Timer";
import { words } from "../../../static/words";
let Word = (props) => {

    const { index, text, active, correct } = props;

    if (correct === true && !active) {
        return <span className="correct">{text + " "}</span>
    }

    if (correct === false && !active) {
        return <span className="incorrect">{text + " "}</span>
    }

    if (active) {
        if (!correct && correct !== undefined) {
            return <span className="activeAndIncorrect">{text + " "}</span>
        }
        return <span className={`active text${index}`}>{text + " "}</span>
    }
    return <span className={"text" + index}>{text} </span>
}


const getRandomSentences = () => {
    let quotes_array1 = words.sort(() => Math.random() > 0.5 ? 1 : -1).join(" ").toLowerCase();
    let line1 = (quotes_array1.substring(0, 80))
    let line2 = (quotes_array1.substring(80, 150))
    line2 = line2.trim();

    return quotes_array1;
    return line1 + line2;
}

let index = 0, correctWordArrayStatic = [],
    previous_position_top = 0,
    line_height = 61, row_counter = 0;

const FingerFast = () => {

    Word = React.memo(Word)
    const navigate = useNavigate();
    const inputRef = useRef();
    const rowRef = useRef();
    let cloud = useRef(getRandomSentences().split(' '));

    const [wordIndex, setIndex] = useState(0);
    const [startCounting, setStartCounting] = useState(false);
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [correctWordArray, setCorrectWordArray] = useState([]);
    const [timeup, setTimeUp] = useState(false);
    const [mount, setMount] = useState(false);

    useEffect(() => {
        if (!mount) return;
        correctWordArrayStatic = []; line_height = 53;
        previous_position_top = index = row_counter = 0;
        setMount(true);
    }, [mount]);

    // useEffect(() => {
    //     setCorrectWordArray([])
    //     setActiveWordIndex(0)
    // }, [wordIndex])

    const processInput = (value) => {

        if (!startCounting) {
            // setStartCounting(true)
        }


        if (value.endsWith(' ')) {
            setActiveWordIndex(index => index + 1)
            inputRef.current.value = "";
            // Correct Word
            const word = value.trim()
            setCorrectWordArray(data => {
                const newResult = [...data]
                newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
                return newResult
            })
        }
        else {
            const word = value.trim()

            setCorrectWordArray(data => {
                const newResult = [...data]
                let size = word.length
                let correct = true
                for (let i = 0; i < size; i++) {
                    if (word[i] != cloud.current[activeWordIndex][i]) {
                        correct = false
                        break
                    }
                }
                newResult[activeWordIndex] = correct
                return newResult
            })
        }
        let p = document.getElementsByClassName("text" + (activeWordIndex + 1))[0];

        if (p.offsetTop > previous_position_top + 10) {
            row_counter++;
            previous_position_top = p.offsetTop;
            let top = -1 * (line_height * row_counter);
            rowRef.current.top = top + "px";
        }

    }
    //submit the typing test
    const SubmitTest = async () => {
        try {
            let userID = localStorage.getItem("userID");
            const testID = localStorage.getItem("testID");
            const wordsPerMinute = (correctWordArrayStatic.filter(Boolean).length)

            const trues = correctWordArrayStatic.filter(c => c === true)
            const accuracy = (trues.length * 100) / (trues.length + (correctWordArrayStatic.length - trues.length))
            const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/submitTypingTest`,
                { testID, userID, wpm: wordsPerMinute, accuracy: accuracy.toFixed(2) });

            const type = res.data.testType ?? typeOfTest.Typing;
            if (type === typeOfTest.Typing_MCQs) { //Typing + Mcq
                navigate('/WaitingComponent', { replace: true, state: { type } });
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
            height: "100vh", paddingTop: "5rem", width: "100vw"
        }}>
            <Container>
                <h2>Speed Typing Test</h2>



                <div className="para" style={{
                    border: "1px solid #8eb6d8", borderRadius: "9px",
                    height: "9rem", overflow: 'hidden'
                }}>

                    <div ref={rowRef} id={'row-1'} style={{ position: 'relative', top: rowRef.current?.top ?? '-1px' }}>{cloud.current.map((word, index) => {
                        return <Word index={index} key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
                    })}</div>
                </div>



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
                    <Timer startCounting={startCounting} setTimeUp={setTimeUpFun} />
                </Stack>
            </Container>
        </Stack>
    )
}

export default FingerFast;
