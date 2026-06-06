const addNewTaskBtn = document.getElementById("add-new-task");

let  currentSelectedTask = null;


loadPendingTasks();

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
    enableDeleteBtn(newPendingTask);
    return newPendingTask;
}

function downPanelScroll() {
    taskContainer.scrollTop = taskContainer.scrollHeight;
}

async function loadPendingTasks() {
    const tasksIds = await window.electronAPI.requestIncompleteTasksIds();
    if (!tasksIds) return;

    for(let taskId of tasksIds){
        const taskName = await window.electronAPI.requestTaskName({id: parseInt(taskId, 10)});
        addTaskToPanel(addNewTaskBtn, taskId, taskName);
    }
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

/* ====== SAVE BUTTON ====== */

function enableSaveBtn(task, btnBehavior) {
    const saveBtn = task.querySelector(".save-task-btn");
    const taskInput = task.querySelector(".task-text-inpt");

    saveBtn.addEventListener("click", async () => {
        const taskName = taskInput.value;
        if (taskName.trim() != ""){
            const taskId = await btnBehavior(task);
            exitTaskOptions(task, taskId, taskName);
        } 
        else{
            showErrorOnElement(task.querySelector(".task-text-inpt"));
        }
    });
}

/* ====== DELETE BUTTON ====== */

function enableDeleteBtn(task) {
    const deleteBtn = task.querySelector(".delete-task-btn");

    deleteBtn.addEventListener("click", async () => {
        if(task.id) 
            if(await !deleteTask(task)) {
                console.log("error deleting the task");
                return
            }
        exitTaskOptions(task);
    });
}

function exitTaskOptions(task, taskId = null, taskName = null) {
    switchElementsAvailability(renableElements);

    task.style.setProperty("--element-size", 0);
    if (taskId !== null) setTimeout(() => addTaskToPanel(task, taskId, taskName), 200);
    setTimeout(() => task.remove(), 250);
}

function focusOnTaskOptions(task) {
    switchElementsAvailability(disableElements);
    task.focus();
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

function disableElements(elementList) {
    for (let element of elementList) {
        element.classList.add("disable-interaction");
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
    const taskAdded = referenceElement.previousElementSibling;
    enableSettingsBtn(taskAdded, taskName);
    enableToSelectTask(taskAdded);
    enableCheckBoxTask(taskAdded);
}

function enableSettingsBtn(task, taskName) {
    const taskSettingsBtn = task.querySelector(".task-settings-btn");

    taskSettingsBtn.addEventListener("click", () => {
        const taskOptions = openTaskOptions(task, taskName, task.id);
        taskOptions.style.setProperty("--element-size", 1);
        enableSaveBtn(taskOptions, renameTask);
        enableDeleteBtn(taskOptions);
        task.remove();
    });
}

function enableToSelectTask(task) {
    

    task.addEventListener("click", () => {
        const checkBoxTask = task.querySelector(".task-checkbox");

        if (checkBoxTask.checked) return;

        if (currentSelectedTask) {
            currentSelectedTask.classList.remove("selected");
        } 
        task.classList.add("selected");
        currentSelectedTask = task; 
    });
}

function enableCheckBoxTask(task) {
    const checkBoxTask = task.querySelector(".task-checkbox");

    checkBoxTask.addEventListener("click", async () => {
        if (!checkBoxTask.checked) {
            setTaskAsIncomplete(task);
            task.classList.remove("finished");
        }
        else {
            setTaskAsComplete(task);
            task.classList.add("finished");
        }
        if(currentSelectedTask === task) {
            currentSelectedTask.classList.remove("selected");
            currentSelectedTask = null;
        }
    });
}

/* =============================================================================
DATABASE QUERIES
============================================================================= */

async function renameTask(task) {
    const taskId = task.id
    const taskName = task.querySelector(".task-text-inpt").value;
    const data = {
        name: taskName,
        id: parseInt(taskId, 10)
    }
    const updatedTaskId = await window.electronAPI.sendTaskToRename(data);
    return updatedTaskId;
}

async function saveNewTask(task) {
    const taskName = task.querySelector(".task-text-inpt").value;
    const data = {name: taskName};
    const id = await window.electronAPI.sendTaskToInsert(data);
    return id;
}

async function deleteTask(task) {
    const taskId = parseInt(task.id, 10);
    const data = {id: taskId};
    const result = await window.electronAPI.sendTaskToDelete(data);
    return result;
}

async function setTaskAsComplete(task) {
    const taskId = parseInt(task.id, 10);
    const data = {id: taskId};
    const result = await window.electronAPI.sendTaskToComplete(data);
    if (!result) console.log("setTaskAsComplete failed");
    return result;
}

async function setTaskAsIncomplete(task) {
    const taskId = parseInt(task.id, 10);
    const data = {id: taskId};
    const result = await window.electronAPI.sendTaskToIncomplete(data);
    if (!result) console.log("setTaskAsIncomplete failed");
    return result;
}