import React, { useEffect, useState, useRef } from "react";
import { Stack } from "@mui/system";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Button } from "@material-ui/core";

const Timer = (props) => {

    const { correctWords, startCounting, setTimeUp } = props
    const countRef = useRef(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [open, setOpen] = useState(true);


    const timeOut = () => {

        if (startCounting) {
            countRef.current = setInterval(() => {
                setTimeElapsed(oldSpeed => oldSpeed + 1)
            }, 1000);
        }
    }

    useEffect(() => {
        if (timeElapsed < 60) return;
        clearInterval(countRef.current);
        setTimeUp(true);

    }, [timeElapsed])

    useEffect(() => {
        timeOut();
    }, [startCounting])

    const minutes = timeElapsed / 60;

    return (timeElapsed === 60 ?
        (
            <Dialog open={open} fullWidth>
                <DialogContent>
                    <DialogTitle>{'Results'}</DialogTitle>
                    <DialogContentText>
                        <p style={{ fontSize: '20px', padding: '20px' }}>Time: {timeElapsed} second(s)</p>
                        <span style={{ fontSize: '20px', padding: '20px' }}>Speed : {((correctWords / minutes) || 0).toFixed(0)} WPM</span>
                        <h2 style={{ padding: '20px' }}>Your Time's Up!! Thank You!!</h2>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>

        ) : (
            <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button variant="contained" size="large">Time: {timeElapsed}</Button>
                <Button variant="contained" size="large">Speed : {((correctWords / minutes) || 0).toFixed(0)} WPM</Button>
            </Stack>
        )
    )

}

export default Timer;