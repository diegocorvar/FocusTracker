const monthsAbreviations = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
]

/* =============================================================================
AUDIOS
============================================================================= */

const BASE_CLICK_SOUND = 1;
const DELETE_TASK_SOUND = 8;
const SAVE_NEW_TASK_SOUND = 7;
const SAVE_TASK_CHANGES_SOUND = 9;

const Sounds = [
    new Audio('../assets/audio/click-sound-1.mp3'),
    new Audio('../assets/audio/click-sound-2.mp3'),
    new Audio('../assets/audio/click-sound-3.mp3'),
    new Audio('../assets/audio/click-sound-4.mp3'),
    new Audio('../assets/audio/click-sound-5.mp3'),
    new Audio('../assets/audio/click-sound-6.mp3'),
    new Audio('../assets/audio/click-sound-7.mp3'),
    new Audio('../assets/audio/click-sound-8.mp3'),
    new Audio('../assets/audio/click-sound-9.mp3'),
    new Audio('../assets/audio/click-sound-10.mp3')
];

/* =============================================================================
BUTTONS
============================================================================= */

const startStopBtn = document.getElementById("start-stop-btn");
const restartTimeBtn = document.getElementById("restart-time-btn");
const finishSessionTrackBtn = document.getElementById("finish-track-btn");
const enlargeClockBtn = document.getElementById("enlarge-clock-size-btn");
const shrinkClockBtn = document.getElementById("shrink-clock-size-btn");
const addNewTaskBtn = document.getElementById("add-new-task");
const stopwatchNavBtn = document.getElementById("show-stopwatch-window");
const reportsNavBtn = document.getElementById("show-reports-window");
const previousPeriodBtn = document.getElementById("previous-time-period-btn");
const nextPeriodBtn = document.getElementById("next-time-period-btn");

/* =============================================================================
SPANS
============================================================================= */

const secSpan = document.getElementById("seconds-text");
const minSpan = document.getElementById("minutes-text");
const hrSpan = document.getElementById("hours-text");
const taskOnFocusP = document.getElementById("task-on-focus");
const currentPeriodText = document.getElementById("current-period-text");

/* =============================================================================
CONTAINERS
============================================================================= */

const taskContainer = document.getElementsByClassName("tasks-container")[0];
const taskOnFocusContainer = document.getElementsByClassName("task-on-focus-container")[0];
const navMenu = document.getElementById("nav-menu");
const clockSizeContainer = document.getElementsByClassName("clock-size-options")[0];
const stopwatchWindow = document.getElementById("stopwatch-window");
const reportsWindow = document.getElementById("reports-window");
const chartTaskListPanel = document.querySelector(".chart-data-list-panel");

/* =============================================================================
CHARTS
============================================================================= */

let myPieChart = null

/* =============================================================================
GLOBAL VARIABLES
============================================================================= */

let stopwatchRunning = false;

let totalMiliseconds = 0;
let miliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let startTime = undefined;

let currentClockSize = 35;

let  currentSelectedTask = null;

let currentPeriodType = "DAY";

