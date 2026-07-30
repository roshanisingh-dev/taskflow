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

// ================================
// Event Listeners
// ================================

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", addTask);

// ================================
// Functions
// ================================

function addTask(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        priority: priority.value,
        dueDate: dueDate.value,
        completed: false
    };

    tasks.push(task);

    renderTasks();

    updateStats();

    taskInput.value = "";
    priority.value = "Medium";
    dueDate.value = "";
}

function renderTasks() {

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-clipboard"></i>
                <h3>No Tasks Yet</h3>
                <p>Add your first task to get started.</p>
            </div>
        `;

        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.classList.add("task-card");

        taskCard.innerHTML = `
         <div class="task-info">
             <h3>${task.title}</h3>

             <div class="task-meta">
                 <span class="priority ${task.priority.toLowerCase()}">
                     ${task.priority}
                 </span>

                 <span>
                    📅 ${task.dueDate || "No Due Date"}
                 </span>
             </div>
         </div>

         <div class="task-actions">
             <button class="complete-btn">
               <i class="fa-solid fa-check"></i>
             </button>

             <button class="edit-btn">
               <i class="fa-solid fa-pen"></i>
             </button>

             <button class="delete-btn" data-id="${task.id}">
               <i class="fa-solid fa-trash"></i>
               </button>
         </div>
        `;

        taskList.appendChild(taskCard);

        const deleteBtn = taskCard.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
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