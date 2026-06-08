/* =============================================================================
ON PAGE LOAD
============================================================================= */

loadLastSesionTime();

async function loadLastSesionTime() {
    const sesionTime = await getCurrentSesionFocusTime();

    hours = sesionTime.hours;
    minutes = sesionTime.minutes;
    seconds = sesionTime.seconds;

    updateStopwatch();

    totalMiliseconds = calculateMiliseconds(seconds, minutes, hours);
} 

function calculateMiliseconds(secs = 0, mins = 0, hrs = 0) {
    return (secs * 1000) + (mins * 60000) + (hrs * 3600000);
}

/* =============================================================================
SOUNDS CONTROLLER
============================================================================= */

startStopBtn.addEventListener("click", () => playSound(BASE_CLICK_SOUND));
restartTimeBtn.addEventListener("click", () => playSound(BASE_CLICK_SOUND));
finishSessionTrackBtn.addEventListener("click", () => playSound(3));
addNewTaskBtn.addEventListener("click", () => playSound(BASE_CLICK_SOUND));

function playSound(sound) {
    Sounds.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    Sounds[sound].play();
}

/* =============================================================================
START STOP BUTTON
============================================================================= */

startStopBtn.addEventListener("click", () => {
    stopwatchRunning ? stopStopwatch() : startStopwatch();
    timer();
    toggleStopwatchUI();
    if (currentSelectedTask)
        taskOnFocusP.textContent = currentSelectedTask.querySelector(".task-text").textContent;
});

const PLAY_ICON = 'play_icon.png';
const PAUSE_ICON = 'pause_icon.png';

function startStopwatch() {
    changeBtnIcon(startStopBtn, PAUSE_ICON);
    stopwatchRunning = true;
    startTime = Date.now();
}

async function stopStopwatch() {
    changeBtnIcon(startStopBtn, PLAY_ICON);
    updateCurrentSesionFocusTime(hours, minutes, seconds);

    stopwatchRunning = false;

    if(currentSelectedTask) await increaseTaskFocusTime(currentSelectedTask);
    totalMiliseconds += Date.now() - startTime;
}

function changeBtnIcon(button, icon) {
    button.querySelector('.btn-icon').src = `../assets/icons/${icon}`;
}

/* =============================================================================
RESTART BUTTON
============================================================================= */

restartTimeBtn.addEventListener("click", () => {
    restartStopwatch();
    
});

function restartStopwatch() {
    restartTimeCounters();
    restartTimeSpans();
    updateCurrentSesionFocusTime(0, 0, 0);
}

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
FINISH FOCUS SESSION TRACK BUTTON
============================================================================= */

finishSessionTrackBtn.addEventListener("click", async () => {
    const completedTasks = document.querySelectorAll(".finished");

    if (!completedTasks) return;

    for(let task of completedTasks) {
        if(await setTaskAsComplete(task)) task.remove();
    }
    restartStopwatch();
    toggleShowFinishFocusTrackBtn();
})

/* =============================================================================
TIME CONTROLLER
============================================================================= */

function timer() {
    if (stopwatchRunning) {
        miliseconds = totalMiliseconds + (Date.now() - startTime);

        hours = Math.floor(miliseconds / 3600000);
        minutes = Math.floor((miliseconds % 3600000) / 60000);
        seconds = Math.floor((miliseconds % 60000) / 1000);

        updateStopwatch();

        setTimeout(timer, 10);
    }
}

function updateStopwatch() {
    updateStopwatchDigits(seconds, secSpan);
    updateStopwatchDigits(minutes, minSpan);
    updateStopwatchDigits(hours, hrSpan);
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
        taskOnFocusContainer,
        clockSizeContainer
    ]);
    unhideElements([
        taskContainer,
        restartTimeBtn,
        finishSessionTrackBtn,
        navMenu
    ]);
    changeClockSize('10rem');
    changeBackgroundColor('rgb(22,22,22)');
    toggleShowFinishFocusTrackBtn();
}

function switchToBigClock() {
    hideElements([
        taskContainer,
        restartTimeBtn,
        finishSessionTrackBtn,
        navMenu
    ]);
    unhideElements([
        taskOnFocusContainer,
        clockSizeContainer
    ]);
    changeClockSize(`${currentClockSize}rem`);
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

/* =============================================================================
CLOCK SIZE CONTROLLER
============================================================================= */

enlargeClockBtn.addEventListener("click", () => {
    changeClockSize(`${currentClockSize + 1}rem`);
    currentClockSize++;
});

shrinkClockBtn.addEventListener("click", () => {
    changeClockSize(`${currentClockSize - 1}rem`);
    currentClockSize--;
});

/* =============================================================================
DATABASE QUERIES
============================================================================= */

async function increaseTaskFocusTime(task) {
    const taskId = task.id;
    const focusTime = (Date.now() - startTime) / 1000;
    const data = {
        id: parseInt(taskId, 10),
        focusTimeInSec: focusTime
    }
    const result = await window.electronAPI.sendTaskToIncreseFocusTime(data);
    if (!result) console.log("increaseTaskFocusTime failed");
    return result;
}

async function updateCurrentSesionFocusTime(hours, minutes, seconds) {
    const data = {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
    const result = await window.electronAPI.sendTimeToUpdateFocusTime(data);
    if (!result) console.log("updateCurrentSesionFocusTime failed");
    return result;
}

async function getCurrentSesionFocusTime() {
    const time = await window.electronAPI.requestCurrentFocusTime();
    if (!time) console.log("getCurrentSesionFocusTime failed");
    return time;
}

