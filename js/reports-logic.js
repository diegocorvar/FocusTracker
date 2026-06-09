let currentReferenceDate = getTodaysDate();
updateTimePeriodText();

async function renderPieChart() {
    const ctx = document.getElementById('current-chart').getContext('2d');

    const completedTasks = await getCompletedTasksByDay(currentReferenceDate);

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
CHANGE TIME PERIOD BUTTONS
============================================================================= */

const ONE_DAY_LESS = 1;
const ONE_DAY_MORE = -1;

previousPeriodBtn.addEventListener("click", () => {
    if(currentPeriodType === "DAY") changeDateByDay(ONE_DAY_LESS);
    restartChart();
    updateTimePeriodText();
    playSound(BASE_CLICK_SOUND);
});

nextPeriodBtn.addEventListener("click", () => {
    if(currentPeriodType === "DAY") changeDateByDay(ONE_DAY_MORE);
    restartChart();
    updateTimePeriodText();
    playSound(BASE_CLICK_SOUND);
});

function changeDateByDay(increment) {
    const newDate = new Date(currentReferenceDate);
    newDate.setDate(newDate.getDate() - increment);
    currentReferenceDate = newDate.toISOString().split('T')[0];    
}

function deconstructDate(dateString) {
    const dateInArray = dateString.split("-");
    const date = {
        day: Number(dateInArray[2]),
        month: Number(dateInArray[1]),
        year: Number(dateInArray[0])
    };
    return date;
}

function restartChart() {
    if (myPieChart !== null) {
        myPieChart.destroy();
        cleanChartTaskListPanel();
    }
    renderPieChart();
}

/* =============================================================================
CHANGE TIME PERIOD TEXT
============================================================================= */

function updateTimePeriodText() {
    const date = deconstructDate(currentReferenceDate);
    currentPeriodText.textContent = `${String(date.day).padStart(2, '0')}-${monthsAbreviations[date.month - 1]}`;
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