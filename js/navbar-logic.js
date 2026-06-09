stopwatchNavBtn.addEventListener("click", () => {
    playSound(BASE_CLICK_SOUND);
    stopwatchWindow.classList.remove("hide");
    reportsWindow.classList.add("hide");

    if (myPieChart !== null) {
        myPieChart.destroy();
        cleanChartTaskListPanel();
    }
});

reportsNavBtn.addEventListener("click", () => {
    playSound(BASE_CLICK_SOUND);
    stopwatchWindow.classList.add("hide");
    reportsWindow.classList.remove("hide");

    renderPieChart();
});

function cleanChartTaskListPanel() {
    const tasks = chartTaskListPanel.querySelectorAll(".chart-data-item");

    for(let task of tasks) {
        task.remove();
    }
}