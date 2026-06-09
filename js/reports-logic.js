let currentReferenceDate = getTodaysDate();
updateTimeIntervalText();

/* =============================================================================
CHART TO REVIEW TASKS REPORTS BY DAY
============================================================================= */

async function renderPieChart() {
    const ctx = document.getElementById('current-chart').getContext('2d');

    const completedTasks = await getCompletedTasksByDay(currentReferenceDate);

    if (completedTasks.length === 0) {
        inactivityMsgContainer.classList.remove("hide");
        return;
    } 
    inactivityMsgContainer.classList.add("hide");

    const labels = completedTasks.map(task => task.name);
    const dataValues = completedTasks.map(task => task.focusTimeInSec);
    
    const autocolors = window['chartjs-plugin-autocolors']; 

    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: " Seconds",
                data: dataValues,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                autocolors: {
                    mode: 'data'
                },
                legend: {
                    display: false
                }
            }
        },
        plugins: [autocolors]
    });

    const colorList = myPieChart.data.datasets[0].backgroundColor;

    for (let i = 0; i < completedTasks.length; i++) {
        addTaskToList(completedTasks[i], colorList[i]);
    }
}

/* =============================================================================
CHART TO REVIEW TASKS REPORTS BY WEEK OR MONTH
============================================================================= */

async function renderBarChart(intervalSize) {
    const ctx = document.getElementById('current-chart').getContext('2d');

    const totalTimePerDay = [];

    for (let i = intervalSize; i >= 0; i--) {
        await totalTimePerDay.push(await getTotalTimePerDay(getDateFrom(currentReferenceDate, i)));
    }

    const labels = totalTimePerDay.map(day => {
        if(!day.date) return;
        const date = splitDate(day.date);
        return getDayMonthString(date.day, date.month);
    });
    if (!labels.some(label => label !== undefined)) {
        inactivityMsgContainer.classList.remove("hide");
        return;
    }
    inactivityMsgContainer.classList.add("hide"); 
    const dataValues = totalTimePerDay.map(day => (day.totalSec / 60).toFixed(2));
    
    const autocolors = window['chartjs-plugin-autocolors']; 

    myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: " MINUTES",
                data: dataValues,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                autocolors: {
                    mode: 'data'
                },
                legend: {
                    display: false
                }
            }
        },
        plugins: [autocolors]
    });
}

function getTodaysDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function addTaskToList(task, taskColors) {
    const taskHtml = `
        <li id="${task.id}" class="chart-data-item">
            <span class="chart-task-text">${task.name}</span>         
            <span>${getTaskTimeString(task.focusTimeInSec)}</span>
        </li>
    `;

    chartTaskListPanel.insertAdjacentHTML("beforeend", taskHtml);
    const addedTask = chartTaskListPanel.lastElementChild;
    addedTask.style.setProperty('--task-color', `${taskColors}`);
}

function getTaskTimeString(timeInSecs) {
    if (timeInSecs > 3600) return `${(timeInSecs / 3600).toFixed(2)} hrs`;
    if (timeInSecs > 60) return `${(timeInSecs / 60).toFixed(0)} mins`;
    return `${(timeInSecs).toFixed(0)} secs`;
}

/* =============================================================================
BUTTONS TO CHANGE TIME INTERVAL
============================================================================= */

const ONE_DAY_LESS = 1;
const ONE_DAY_MORE = -1;
const SEVEN_DAYS_LESS = 7;
const SEVEN_DAYS_MORE = -7;
const THIRTY_DAYS_LESS = 30;
const THIRTY_DAYS_MORE = -30;

previousIntervalBtn.addEventListener("click", () => {
    if(currentIntervalType === "DAY") 
        currentReferenceDate = getDateFrom(currentReferenceDate, ONE_DAY_LESS);
    if(currentIntervalType === "WEEK")
        currentReferenceDate = getDateFrom(currentReferenceDate, SEVEN_DAYS_LESS);
    if(currentIntervalType === "MONTH")
        currentReferenceDate = getDateFrom(currentReferenceDate, THIRTY_DAYS_LESS);

    handleIntervalBtnsClick();
});

nextIntervalBtn.addEventListener("click", () => {
    if(currentIntervalType === "DAY") 
        currentReferenceDate = getDateFrom(currentReferenceDate, ONE_DAY_MORE);
    if(currentIntervalType === "WEEK")
        currentReferenceDate = getDateFrom(currentReferenceDate, SEVEN_DAYS_MORE);
    if(currentIntervalType === "MONTH")
        currentReferenceDate = getDateFrom(currentReferenceDate, THIRTY_DAYS_MORE);

    handleIntervalBtnsClick();
});

function handleIntervalBtnsClick() {
    restartCharts();
    updateTimeIntervalText();
    playSound(BASE_CLICK_SOUND);
}

function getDateFrom(date, increment) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - increment);
    date = newDate.toISOString().split('T')[0];
    return date;  
}

function splitDate(dateString) {
    const dateInArray = dateString.split("-");
    const date = {
        day: Number(dateInArray[2]),
        month: Number(dateInArray[1]),
        year: Number(dateInArray[0])
    };
    return date;
}

function restartCharts() {
    if (myPieChart !== null) {
        myPieChart.destroy();
        cleanChartTaskListPanel();
    }
    if (myBarChart !== null) {
        myBarChart.destroy();
    }

    
    if(currentIntervalType === "DAY") renderPieChart();
    if(currentIntervalType === "WEEK") renderBarChart(SEVEN_DAYS);
    if(currentIntervalType === "MONTH") renderBarChart(THIRY_DAYS);
}

/* =============================================================================
TIME INTERVAL OPTIONS BUTTONS
============================================================================= */

dailyIntervalOptionBtn.addEventListener("click", () => {
    currentIntervalType = "DAY";
    handleIntervalOptionBtnsClick();
});
weeklyIntervalOptionBtn.addEventListener("click", () => {
    currentIntervalType = "WEEK";
    handleIntervalOptionBtnsClick();
});
monthlyIntervalOptionBtn.addEventListener("click", () => {
    currentIntervalType = "MONTH";
    handleIntervalOptionBtnsClick();
});

function handleIntervalOptionBtnsClick() {
    currentReferenceDate = getTodaysDate();
    restartCharts();
    if (currentIntervalType === "DAY"){
        showChartTasksPanel();
    }
    else hideChartTasksPanel();
        
    updateTimeIntervalText();
    playSound(BASE_CLICK_SOUND);
}

function hideChartTasksPanel() {
    chartTasksContainer.classList.add("hide");
}
function showChartTasksPanel() {
    chartTasksContainer.classList.remove("hide");
}

/* =============================================================================
CHANGE TIME INTERVAL TEXT
============================================================================= */

function updateTimeIntervalText() {
    if (currentIntervalType === "DAY") {
        timeIntervalText.textContent = getIntervalStrWithin(A_DAY);
        timeIntervalTitle.textContent = "DAILY REPORTS"
    }
    if (currentIntervalType === "WEEK") {
        timeIntervalText.textContent = getIntervalStrWithin(SEVEN_DAYS);
        timeIntervalTitle.textContent = "WEEKLY REPORTS"
    }
    if (currentIntervalType === "MONTH") {
        timeIntervalText.textContent = getIntervalStrWithin(THIRY_DAYS);
        timeIntervalTitle.textContent = "MONTHLY REPORTS"
    }
    toggleShowNextIntervalBtn();    
}

function getIntervalStrWithin(intervalSize) {
    let endDate = splitDate(currentReferenceDate);
    if (intervalSize === A_DAY) return getDayMonthString(endDate.day, endDate.month);
    let startDate = splitDate(getDateFrom(currentReferenceDate, intervalSize));

    endDate = getDayMonthString(endDate.day, endDate.month);
    startDate = getDayMonthString(startDate.day, startDate.month);
    return `${startDate} - ${endDate}`;
}

function getDayMonthString(dayNumber, monthNumber) {
    return `${getDayString(dayNumber)}-${getMonthAbbr(monthNumber)}`;
}

function getDayString(dayInNumber) {
    return String(dayInNumber).padStart(2, '0')
}

function getMonthAbbr(monthInNumber) {
    return monthsAbbreviations[monthInNumber - 1];
}

function toggleShowNextIntervalBtn() {
    if (currentReferenceDate === getTodaysDate()) {
        nextIntervalBtn.classList.add("hide");
    }
    else {
        nextIntervalBtn.classList.remove("hide");
    }
}

/* =============================================================================
DATABASE QUERIES
============================================================================= */

async function getCompletedTasksByDay(day) {
    const data = {
        day: day
    };
    const completedTasks = await window.electronAPI.requestCompletedTasksByDay(data);
    return completedTasks;
}

async function getTotalTimePerDay(day) {
    const data = {
        day: day
    };
    const row = await window.electronAPI.requestTotalFocusTimePerDay(data);
    return row;
}