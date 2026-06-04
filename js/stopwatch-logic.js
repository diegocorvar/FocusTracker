let stopwatchRunning = false;

/* =============================================================================
AUDIOS
============================================================================= */

let click_sound = new Audio('../assets/audio/click.mp3');

/* =============================================================================
BUTTONS
============================================================================= */

const startStopBtn = document.getElementById("start-stop-btn");
const restartTimeBtn = document.getElementById("restart-time-btn");
const finishTrackBtn = document.getElementById("finish-track-btn");


/* =============================================================================
SPANS
============================================================================= */

const secSpans = document.querySelectorAll("#seconds-text .time-unit-digit");
const minSpans = document.querySelectorAll("#minutes-text .time-unit-digit");
const hrSpans = document.querySelectorAll("#hours-text .time-unit-digit");

/* =============================================================================
CONTAINERS
============================================================================= */

const taskContainer = document.getElementsByClassName("tasks-container")[0];
const taskOnFocusContainer = document.getElementsByClassName("task-on-focus-container")[0];
const navMenu = document.getElementById("nav-menu");


let totalMiliseconds = 0;
let miliseconds = 0;
let seconds = getTimeFromSpans(secSpans);
let minutes = getTimeFromSpans(minSpans);
let hours = getTimeFromSpans(hrSpans);
let startTime = undefined;

function getTimeFromSpans(spanList) {
    return Number(Array.from(spanList).map(span => span.textContent).join(''));
}

/* =============================================================================
START STOP BUTTON
============================================================================= */

startStopBtn.addEventListener("click", () => {
    stopwatchRunning ? stopStopwatch() : startStopwatch();
    timer();
    toggleStopwatchUI();
});

const PLAY_ICON = 'play_icon.png';
const PAUSE_ICON = 'pause_icon.png';

function startStopwatch() {
    changeBtnIcon(startStopBtn, PAUSE_ICON);
    stopwatchRunning = true;
    startTime = Date.now();
}

function stopStopwatch() {
    changeBtnIcon(startStopBtn, PLAY_ICON);
    stopwatchRunning = false;
    totalMiliseconds += Date.now() - startTime;
}

function changeBtnIcon(button, icon) {
    button.querySelector('.btn-icon').src = `../assets/icons/${icon}`;
}

/* =============================================================================
RESTART BUTTON
============================================================================= */

restartTimeBtn.addEventListener("click", () => {
    restartTimeCounters();
    restartTimeSpans();
});

function restartTimeSpans() {
    updateStopwatchDigits(0, secSpans);
    updateStopwatchDigits(0, minSpans);
    updateStopwatchDigits(0, hrSpans);
}

function restartTimeCounters() {
    totalMiliseconds = 0;
    miliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    startTime = undefined;
}

/* =============================================================================
TIME CONTROLLER
============================================================================= */

function timer() {
    if (stopwatchRunning) {
        miliseconds = totalMiliseconds + (Date.now() - startTime);

        hours = Math.floor(miliseconds / 3600000);
        minutes = Math.floor((miliseconds % 3600000) / 60000);
        seconds = Math.floor((miliseconds % 60000) / 1000);

        updateStopwatchDigits(seconds, secSpans);
        updateStopwatchDigits(minutes, minSpans);
        updateStopwatchDigits(hours, hrSpans);

        setTimeout(timer, 10);
    }
}

function updateStopwatchDigits(timeUnit, currentDigits) {
    const newDigits = getTimerDigits(timeUnit);
    for (let i = 0; i < 2; i ++ ) currentDigits[i].textContent = newDigits[i];
}

function getTimerDigits(timeUnit) {
    return String(timeUnit).padStart(2, '0').split('');
}

/* =============================================================================
UI CONTROLLER
============================================================================= */

function toggleStopwatchUI() {
    console.log('hola');
    if (stopwatchRunning) switchToBigClock();
    else switchToSmallClock();
}

function switchToSmallClock() {
    hideElements([
        taskOnFocusContainer
    ]);
    unhideElements([
        taskContainer,
        restartTimeBtn,
        finishTrackBtn,
        navMenu
    ]);
    document.documentElement.style.setProperty('--clock-size', '10rem');
    document.documentElement.style.setProperty('--main-bg-color2', '(22,22,22)');
}

function switchToBigClock() {
    hideElements([
        taskContainer,
        restartTimeBtn,
        finishTrackBtn,
        navMenu
    ]);
    unhideElements([
        taskOnFocusContainer
    ]);
    document.documentElement.style.setProperty('--clock-size', '23rem');
    document.documentElement.style.setProperty('--main-bg-color2', 'rgb(19,19,19)');
}

function hideElements(elements) {
    for(element of elements) {
        element.classList.add("hide");
    }
}

function unhideElements(elements) {
    for(element of elements) {
        element.classList.remove("hide");
    }
}