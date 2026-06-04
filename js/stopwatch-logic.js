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

const secSpan = document.getElementById("seconds-text");
const minSpan = document.getElementById("minutes-text");
const hrSpan = document.getElementById("hours-text");

/* =============================================================================
CONTAINERS
============================================================================= */

const taskContainer = document.getElementsByClassName("tasks-container")[0];
const taskOnFocusContainer = document.getElementsByClassName("task-on-focus-container")[0];
const navMenu = document.getElementById("nav-menu");
const clockSizeContainer = document.getElementsByClassName("clock-size-options")[0];


let totalMiliseconds = 0;
let miliseconds = 0;
let seconds = getTimeFromSpan(secSpan);
let minutes = getTimeFromSpan(minSpan);
let hours = getTimeFromSpan(hrSpan);
let startTime = undefined;

let currentClockSize = 35;

function getTimeFromSpan(span) {
    return Number(span.textContent);
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
    updateStopwatchDigits(0, secSpan);
    updateStopwatchDigits(0, minSpan);
    updateStopwatchDigits(0, hrSpan);
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

        updateStopwatchDigits(seconds, secSpan);
        updateStopwatchDigits(minutes, minSpan);
        updateStopwatchDigits(hours, hrSpan);

        setTimeout(timer, 10);
    }
}

function updateStopwatchDigits(timeUnit, currentDigits) {
    const newDigits = getTimerDigits(timeUnit);
    currentDigits.textContent = newDigits;
}

function getTimerDigits(timeUnit) {
    return String(timeUnit).padStart(2, '0');
}

/* =============================================================================
UI CONTROLLER
============================================================================= */

function toggleStopwatchUI() {
    if (stopwatchRunning){
        switchToBigClock();
    } 
    else{
        switchToSmallClock();
    } 
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
    changeClockSize('10rem');
    changeBackgroundColor('rgb(22,22,22)');
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
    changeClockSize('23rem');
    changeBackgroundColor('rgb(19,19,19)');
}

function changeClockSize(size){
    document.documentElement.style.setProperty('--clock-size', size);
}

function changeBackgroundColor(color){
    document.documentElement.style.setProperty('--main-bg-color2', color);
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