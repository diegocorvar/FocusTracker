const addNewTaskBtn = document.getElementById("add-new-task");

/* =============================================================================
ADD NEW TASK
============================================================================= */

addNewTaskBtn.addEventListener("click", () => {
    const taskOptions = prepareNewTask();
    taskOptions.style.setProperty("--element-size", 1);
});

function prepareNewTask() {
    const newPendingTask = openTaskOptions(addNewTaskBtn);
    downPanelScroll();
    enableSaveBtn(newPendingTask, saveNewTask);
    return newPendingTask;
}

function downPanelScroll() {
    taskContainer.scrollTop = taskContainer.scrollHeight;
}

/* =============================================================================
OPEN TASK OPTIONS
============================================================================= */

function openTaskOptions(referenceElement, taskName = '', taskId = '') {
    const taskOptions = `
        <li id ="${taskId}" class="task selected task-options hide-by-size">
            <input required title="Click to edit" spellcheck="false" class="task-text-inpt" type="text" value="${taskName}" placeholder="Insert task name">
            <div>
                <img
                    class="task-icon task-settings-btn delete-task-btn"  
                    title="Delete task" 
                    src="../assets/icons/delete_task_icon.png"
                >
                <img
                    class="task-icon task-settings-btn save-task-btn"
                    title="Save changes"
                    src="../assets/icons/save_task_changes_icon.png"
                >
            </div>
        </li>
    `

    referenceElement.insertAdjacentHTML("beforebegin", taskOptions);
    const openedOptions = referenceElement.previousElementSibling;
    focusOnTaskOptions(openedOptions.querySelector(".task-text-inpt"));
    return openedOptions;
}

function focusOnTaskOptions(task) {
    switchElementsAvailability(disableElements);
    task.focus();
}

function disableElements(elementList) {
    for (let element of elementList) {
        element.classList.add("disable-interaction");
    }
}

function enableSaveBtn(task, saveTaskFunction) {
    const currentSaveBtn = task.querySelector(".save-task-btn");
    const currentTaskInput = task.querySelector(".task-text-inpt");

    currentSaveBtn.addEventListener("click", () => {
        if (currentTaskInput.value.trim() != ""){
            saveTaskFunction(task);
            exitTaskOptions(task, currentTaskInput.value);
        } 
        else{
            showErrorOnElement(currentTaskInput);
        }
    });
}

function exitTaskOptions(task, taskName, taskId) {
    switchElementsAvailability(renableElements);

    task.style.setProperty("--element-size", 0);
    setTimeout(() => addTaskToPanel(task, taskId, taskName), 200);
    setTimeout(() => task.remove(), 250);
}

function switchElementsAvailability(switchFunction) {
    switchFunction(document.querySelectorAll(".task:not(.task-options)"));
    switchFunction(document.querySelectorAll(".action-btn"));
    switchFunction(document.querySelectorAll(".nav-options-container"));
    switchFunction(document.querySelectorAll(".clock-container"));
}

function renableElements(elementList) {
    for (let element of elementList) {
        element.classList.remove("disable-interaction");
    }
}

function showErrorOnElement(element) {
    element.classList.add("error");
    element.focus();
    setTimeout(() => element.classList.remove("error"), 200);
}

/* =============================================================================
ADD TASK TO PANEL
============================================================================= */

function addTaskToPanel(referenceElement, taskId, taskName) {
    const task = `
        <li id="${taskId}" class="task">
            <div>
                <input class="task-checkbox" type="checkbox">
                <span class="task-text">${taskName}</span>
            </div>
            <img 
                class="task-icon task-settings-btn" 
                src="../assets/icons/task_options_icon.png"
            >
        </li>
    `

    referenceElement.insertAdjacentHTML("beforebegin", task);
    enableSettingsBtn(referenceElement.previousElementSibling, taskName);
}

function enableSettingsBtn(task, taskName) {
    const taskSettingsBtn = task.querySelector(".task-settings-btn");

    taskSettingsBtn.addEventListener("click", () => {
        const taskOptions = openTaskOptions(task, taskName, task.id);
        taskOptions.style.setProperty("--element-size", 1);
        enableSaveBtn(taskOptions, renameTask);
        task.remove();
    });
}

async function renameTask(task) {
    const taskId = task.id
    const taskName = task.querySelector(".task-text-inpt").value;
    const data = {
        name: taskName,
        id: parseInt(taskId, 10)
    }
    if(await window.electronAPI.sendTaskToRename(data))
        console.log("tarea actualizada correctamente");
    else
        console.log("error al actualizar tarea");
}

async function saveNewTask(task) {
    const taskName = task.querySelector(".task-text-inpt").value;
    const data = {name: taskName};
    const id = await window.electronAPI.sendTaskToInsert(data);
    console.log(`Tarea guardada en SQLite mediante Electron con el ID: ${id}`);
}