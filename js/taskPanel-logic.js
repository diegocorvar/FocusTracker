/* =============================================================================
ON PAGE LOAD
============================================================================= */

loadPendingTasks();

async function loadPendingTasks() {
    const tasks = await window.electronAPI.requestIncompleteTasks();
    if (!tasks) return;

    for(let task of tasks){
        await addTaskToPanel(addNewTaskBtn, task.id, task.name);
    }
    toggleShowFinishFocusTrackBtn();
}

/* =============================================================================
ADD NEW TASK BTN
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

/* =============================================================================
TASK OPTIONS CONTROLLER
============================================================================= */

function openTaskOptions(referenceElement, taskName = '', taskId = '') {
    const taskOptions = `
        <li id ="${taskId}" class="task selected task-options hide-by-size">
            <input required title="Click to edit" spellcheck="false" class="task-text-inpt" type="text" value="${taskName}" placeholder="Insert task name">
            <div class="task-options-container">
                <div class="delete-task-btn-container">
                    <div class="popup-message hide-by-size">
                        <div class="warning-message-container">
                            <span class="warning-message-text">Are you sure?</span>
                            <div>
                                <button class="decision-btn afirmative-btn">YEP</button>
                                <button class="decision-btn negative-btn">NOP</button>
                            </div>
                        </div>
                    </div>
                    <img
                        class="task-icon task-settings-btn delete-task-btn"  
                        title="Delete task" 
                        src="../assets/icons/delete_task_icon.png"
                    >
                </div>
                <img
                    class="task-icon task-settings-btn save-task-btn"
                    title="Save changes"
                    src="../assets/icons/save_task_changes_icon.png"
                >
            </div>
        </li>
    `;

    referenceElement.insertAdjacentHTML("beforebegin", taskOptions);
    const openedOptions = referenceElement.previousElementSibling;
    focusOnTaskOptions(openedOptions.querySelector(".task-text-inpt"));
    return openedOptions;
}

/* --------------------------------------------------------------------------
WHITIN TASK OPTIONS: SAVE TASK BUTTON
-------------------------------------------------------------------------- */

function enableSaveBtn(task, btnBehavior) {
    const saveBtn = task.querySelector(".save-task-btn");
    const taskInput = task.querySelector(".task-text-inpt");

    saveBtn.addEventListener("click", async () => {
        playSound(7);
        const taskName = taskInput.value;
        if (taskName.trim() != ""){
            const taskId = await btnBehavior(task);
            exitTaskOptions(task, taskId, taskName);
        } 
        else{
            showErrorOnElement(task.querySelector(".task-text-inpt"));
        }

        if (task.id) playSound(SAVE_TASK_CHANGES_SOUND);
        else playSound(SAVE_NEW_TASK_SOUND);
    });
}


/* --------------------------------------------------------------------------
WHITIN TASK OPTIONS: DELETE TASK BUTTON
-------------------------------------------------------------------------- */

function enableDeleteBtn(task) {
    const deleteBtn = task.querySelector(".delete-task-btn");

    deleteBtn.addEventListener("click", async () => {
        const warningMessage = task.querySelector(".popup-message");
        warningMessage.style.setProperty("--element-size", 1);
        enableDeleteConfirmMessage(task);
        playSound(BASE_CLICK_SOUND);
    });
}

/* --------------------------------------------------------------------------
WHITIN TASK OPTIONS: WARNING MESSAGE FOR DELETE TASK BUTTON
-------------------------------------------------------------------------- */

function enableDeleteConfirmMessage(task) {
    const warningMessage = task.querySelector(".popup-message");
    const confirmDeleteBtn = task.querySelector(".afirmative-btn");
    const cancelDeleteBtn = task.querySelector(".negative-btn");

    confirmDeleteBtn.addEventListener("click", async () => {
        if(task.id) 
            if(await !deleteTask(task)) {
                console.log("error deleting the task");
                return
            }
        if(currentSelectedTask.id === task.id) {
            currentSelectedTask = null;
            taskOnFocusP.textContent = "Something";
        } 
        exitTaskOptions(task);
        playSound(DELETE_TASK_SOUND);
    });
    cancelDeleteBtn.addEventListener("click", () => {
        playSound(BASE_CLICK_SOUND);
        warningMessage.style.setProperty("--element-size", 0);
    })
}

/* --------------------------------------------------------------------------
TASK OPTIONS LOGIC
-------------------------------------------------------------------------- */

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

async function addTaskToPanel(referenceElement, taskId, taskName) {
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
    `;

    referenceElement.insertAdjacentHTML("beforebegin", task);
    const taskAdded = referenceElement.previousElementSibling;
    enableTaskFeatures(taskAdded);

    if ((await getTask(taskAdded)).completionDate){
        taskAdded.classList.add("finished");
        taskAdded.querySelector(".task-checkbox").checked = true;
    }

    return taskAdded;
}

function enableTaskFeatures(task) {
    enableSettingsBtn(task);
    enableToSelectTask(task);
    enableCheckBoxTask(task);
}

function enableSettingsBtn(task) {
    const taskSettingsBtn = task.querySelector(".task-settings-btn");
    const taskName = task.querySelector(".task-text").textContent;

    taskSettingsBtn.addEventListener("click", () => {
        const taskOptions = openTaskOptions(task, taskName, task.id);
        taskOptions.style.setProperty("--element-size", 1);
        enableSaveBtn(taskOptions, renameTask);
        enableDeleteBtn(taskOptions);
        playSound(BASE_CLICK_SOUND);
        task.remove();
    });
}

function enableToSelectTask(task) {
    task.addEventListener("click", () => {
        if (task.classList.contains("selected")) return;
        if (task.classList.contains("finished")) return;
        playSound(BASE_CLICK_SOUND);
    });
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
            if (await removeFinishDateOf(task)){
                task.classList.remove("finished");
                playSound(BASE_CLICK_SOUND);
            }
        }
        else {
            if (await setFinishDateTo(task)) {
                task.classList.add("finished");
                playSound(6);
            }
                
        }
        if(currentSelectedTask === task) {
            currentSelectedTask.classList.remove("selected");
            currentSelectedTask = null;
            taskOnFocusP.textContent = "Something";
        }
        toggleShowFinishFocusTrackBtn();
    });
}

function toggleShowFinishFocusTrackBtn() {
    const completedTasks = document.querySelectorAll(".finished");

    if(completedTasks.length) {
        finishSessionTrackBtn.classList.remove("hide");
    }
    else {
        finishSessionTrackBtn.classList.add("hide");
    }
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

async function setFinishDateTo(task) {
    const taskId = parseInt(task.id, 10);
    const data = {id: taskId};
    const result = await window.electronAPI.sendTaskToSetFinishDate(data);
    if (!result) console.log("setFinishDateTo failed");
    return result;
}

async function removeFinishDateOf(task) {
    const taskId = parseInt(task.id, 10);
    const data = {id: taskId};
    const result = await window.electronAPI.sendTaskToRemoveFinishDate(data);
    if (!result) console.log("removeFinishDateOf failed");
    return result;
}

async function getTask(task) {
    const taskId = parseInt(task.id, 10);
    const data = {id: taskId};
    const result = await window.electronAPI.requestTask(data);
    if (!result) console.log("getTask failed");
    return result;
}