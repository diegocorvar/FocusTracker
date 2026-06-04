const addNewTaskBtn = document.getElementById("add-new-task");

const modalOverlay = document.getElementsByClassName("modal-overlay")[0];

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
                    class="task-icon task-settings-btn"
                    title="Save changes"
                    src="../assets/icons/save_task_changes_icon.png"
                >
            </div>
        </li>
    `

    addNewTaskBtn.insertAdjacentHTML("beforebegin", newTask);
}

function focusOnTaskOptions() {
    const taskOptions = document.getElementsByClassName("task-text-inpt")[0];
    disableElements(document.querySelectorAll(".task:not(.task-options)"));
    disableElements(document.querySelectorAll(".action-btn"));
    disableElements(document.querySelectorAll(".nav-options-container"));
    disableElements(document.querySelectorAll(".clock-container"));
    taskOptions.focus();
}

function disableElements(elementList) {
    for (element of elementList) {
        element.classList.add("disable-interaction");
    }
}

/* =============================================================================
CONTAINERS
============================================================================= */