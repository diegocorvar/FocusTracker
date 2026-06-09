let myPieChart = null

async function renderPieChart() {
    const ctx = document.getElementById('current-chart').getContext('2d');

    const completedTasks = await getCompletedTasksByDay(getTodaysDate());

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

async function getCompletedTasksByDay(day) {
    const data = {
        day: day
    };
    const completedTasks = await window.electronAPI.requestCompletedTasksByDay(data);
    return completedTasks;
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