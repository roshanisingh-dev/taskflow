// ================================
// DOM Elements
// ================================

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");

const searchInput = document.getElementById("searchInput");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

// ================================
// Global Variables
// ================================

let tasks = [];
let currentFilter = "all";
let editingTaskId = null;

// ================================
// Event Listeners
// ================================

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", addTask);

searchInput.addEventListener("input", renderTasks);

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// ================================
// Functions
// ================================


function addTask(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    if (editingTaskId !== null) {
        // Update the existing task
        tasks = tasks.map(task => {
            if (task.id === editingTaskId) {
                return {
                    ...task,
                    title: title,
                    priority: priority.value,
                    dueDate: dueDate.value
                };
            }

            return task;
        });

        editingTaskId = null;
        addTaskBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Task';
    } else {
        // Create a new task
        const task = {
            id: Date.now(),
            title: title,
            priority: priority.value,
            dueDate: dueDate.value,
            completed: false
        };

        tasks.push(task);
    }

    renderTasks();
    updateStats();

    taskInput.value = "";
    priority.value = "Medium";
    dueDate.value = "";
}



function getFilteredTasks() {
    let filteredTasks = tasks;

    // Filter by completion status
    if (currentFilter === "pending") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Filter by search text
    const searchText = searchInput.value.trim().toLowerCase();

    if (searchText !== "") {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchText)
        );
    }

    return filteredTasks;
}



function renderTasks() {

    taskList.innerHTML = "";
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
             <div class="empty-state">
                <i class="fa-regular fa-clipboard"></i>
                <h3>No Matching Tasks</h3>
                <p>Try another search or filter.</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");

        if (task.completed) {
            taskCard.classList.add("completed");
        }

        taskCard.innerHTML = `
            <div class="task-info">
                <h3></h3>
                <div class="task-meta">
                    <span class="priority ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>
                    <span>
                        <i class="fa-regular fa-calendar"></i>
                        ${task.dueDate || "No Due Date"}
                    </span>
                </div>
            </div>

            <div class="task-actions">
                <button type="button" class="complete-btn"
                    aria-label="Toggle task completion">
                    <i class="fa-solid fa-check"></i>
                </button>
                <button type="button" class="edit-btn"
                    aria-label="Edit task">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="delete-btn"
                    aria-label="Delete task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        // Use textContent for the user-provided task title.
        taskCard.querySelector(".task-info h3").textContent = task.title;

        taskList.appendChild(taskCard);

        taskCard.querySelector(".delete-btn").addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskCard.querySelector(".complete-btn").addEventListener("click", () => {
            toggleTask(task.id);
        });
        
        taskCard.querySelector(".edit-btn").addEventListener("click", () => {
             editTask(task.id);
        });

    });
}


function updateStats() {

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = completed;

    pendingTasks.textContent = tasks.length - completed;
}

function deleteTask(id){
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateStats();
}

function toggleTask(id){
    tasks = tasks.map(task =>{

        if(task.id === id){
            task.completed = !task.completed;
        }
        return task;
    });

    renderTasks();
    updateStats();
}


function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    editingTaskId = task.id;

    taskInput.value = task.title;
    priority.value = task.priority;
    dueDate.value = task.dueDate;

    addTaskBtn.innerHTML =
        '<i class="fa-solid fa-check"></i> Update Task';

    taskInput.focus();
}
