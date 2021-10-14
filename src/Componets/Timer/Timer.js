import React, { useState, useEffect } from 'react'
import "./timer.css"

function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [time, setTime] = useState({ "h": "0", "m": "0", "s": "0" });
    const [running, setRunning] = useState(false);
    const [timerReset, setReset] = useState(false);
    let timer;

    let manageTimer = () => {
        if (running)
            clearTimeout(timer);

        setRunning(!running);
    }

    const reset = () => {
        clearTimeout(timer);
        setReset(true);
        setTime({ "h": "0", "m": "0", "s": "0" });
    }

    const counter = () => {
        if (timerReset) {
            secontToTime(0);
            setRunning(false);
            setReset(false);
        }
        else {
            let tempSeconds = seconds + 1;
            secontToTime(tempSeconds);
        }
    }

    useEffect(() => {
        if (timerReset) {
            counter()
            return;
        }

        if (running)
            timer = setTimeout(counter, 1000)
    }, [seconds, running, timerReset])

    const secontToTime = (currentSeconds) => {

        let hours = Math.floor(currentSeconds / (60 * 60));

        let divisor_for_minutes = currentSeconds % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let _seconds = Math.ceil(divisor_for_seconds);

        setTime({
            "h": hours,
            "m": minutes,
            "s": _seconds
        })
        setSeconds(currentSeconds);
    }


    return (
        <div className="timer-container">
            <div className="timer flex">
                <p>{time.h <= 9 ? "0" + time.h : time.h}</p>:
                <p>{time.m <= 9 ? "0" + time.m : time.m}</p>:
                <p>{time.s <= 9 ? "0" + time.s : time.s}</p>
            </div>
            <div className="timer-start">
                <button onClick={manageTimer}>Start/Stop</button>
                <button onClick={reset}>Reset</button>
            </div>
        </div>
    )
}

export default Timer
