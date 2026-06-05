const addNewTaskBtn = document.getElementById("add-new-task");

/* =============================================================================
ADD NEW TASK
============================================================================= */

addNewTaskBtn.addEventListener("click", () => {
    createNewTask();
    focusOnTaskOptions();
    document.querySelector(".hide-by-size").style.setProperty("--element-size", 1);
});

function createNewTask() {
    const newTask = `
        <li class="task selected task-options hide-by-size">
            <input title="Click to edit" spellcheck="false" class="task-text-inpt" type="text" value="" placeholder="Insert task name">
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

    addNewTaskBtn.insertAdjacentHTML("beforebegin", newTask);

    const taskAdded = addNewTaskBtn.previousElementSibling;
    const taskInput = taskAdded.querySelector(".task-text-inpt");

    const currentSaveBtn = taskAdded.querySelector(".save-task-btn");
    const currentDeleteBtn = taskAdded.querySelector(".delete-task-btn");

    currentSaveBtn.addEventListener("click", () => {
        if (taskInput.value.trim() != ""){
            saveNewTask(taskInput);
            exitTaskOptions();
        } 
        else{
            taskInput.focus();
        }
    });
}

function focusOnTaskOptions() {
    disableElements(document.querySelectorAll(".task:not(.task-options)"));
    disableElements(document.querySelectorAll(".action-btn"));
    disableElements(document.querySelectorAll(".nav-options-container"));
    disableElements(document.querySelectorAll(".clock-container"));
    document.getElementsByClassName("task-text-inpt")[0].focus();
}

function exitTaskOptions() {
    renableElements(document.querySelectorAll(".task:not(.task-options)"));
    renableElements(document.querySelectorAll(".action-btn"));
    renableElements(document.querySelectorAll(".nav-options-container"));
    renableElements(document.querySelectorAll(".clock-container"));
}

function disableElements(elementList) {
    for (let element of elementList) {
        element.classList.add("disable-interaction");
    }
}

function renableElements(elementList) {
    for (let element of elementList) {
        element.classList.remove("disable-interaction");
    }
}

async function saveNewTask(task) {
    const taskName = task.value;
    const data = {name: taskName};
    const id = await window.electronAPI.sendTask(data);
    console.log(`Tarea guardada en SQLite mediante Electron con el ID: ${id}`);
}