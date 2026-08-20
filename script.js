// ========================================
// StudyFlow - Task Manager
// ========================================

// -------------------------
// DOM Elements
// -------------------------

const input = document.querySelector("#taskInput");
const addButton = document.querySelector("#addButton");
const taskList = document.querySelector("#taskList");
const searchInput = document.querySelector("#searchInput");

const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const remainingTasks = document.querySelector("#remainingTasks");

const emptyMessage = document.querySelector("#emptyMessage");
const filterButtons = document.querySelectorAll(".filter-button");
const themeButton = document.querySelector("#themeButton");


// -------------------------
// App State
// -------------------------

const STORAGE_KEY = "studyflow-tasks";
const THEME_KEY = "studyflow-dark-mode";

let tasks = loadTasks();
let currentFilter = "all";


// -------------------------
// Load Tasks
// -------------------------

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        return parsedTasks.filter(task =>
            task &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );

    } catch (error) {
        console.error("Could not load StudyFlow tasks:", error);
        return [];
    }
}


// -------------------------
// Save Tasks
// -------------------------

function saveTasks() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );
    } catch (error) {
        console.error("Could not save StudyFlow tasks:", error);
    }
}


// -------------------------
// Update Statistics
// -------------------------

function updateStats() {

    const completed =
        tasks.filter(task => task.completed).length;

    const remaining =
        tasks.length - completed;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
}


// -------------------------
// Create Task Button
// -------------------------

function createActionButton(
    text,
    className,
    label,
    onClick
) {

    const button =
        document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;
    button.setAttribute("aria-label", label);

    button.addEventListener("click", onClick);

    return button;
}


// -------------------------
// Display Tasks
// -------------------------

function displayTasks() {

    taskList.replaceChildren();

    const searchText =
        searchInput.value.toLowerCase().trim();

    const filteredTasks =
        tasks.filter(task => {

            const matchesSearch =
                task.text
                    .toLowerCase()
                    .includes(searchText);

            const matchesFilter =
                currentFilter === "all" ||
                (
                    currentFilter === "completed" &&
                    task.completed
                ) ||
                (
                    currentFilter === "remaining" &&
                    !task.completed
                );

            return matchesSearch && matchesFilter;
        });


    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");

        li.className = "task-item";


        // -------------------------
        // Task Text
        // -------------------------

        const text =
            document.createElement("span");

        text.textContent = task.text;
        text.className = "task-text";

        if (task.completed) {
            text.classList.add("completed");
        }


        // -------------------------
        // Actions
        // -------------------------

        const actions =
            document.createElement("div");

        actions.className = "task-actions";


        // Complete / Undo
        const completeButton =
            createActionButton(
                task.completed ? "Undo" : "Done",
                "complete-button",
                task.completed
                    ? `Mark "${task.text}" as incomplete`
                    : `Mark "${task.text}" as completed`,
                () => {

                    task.completed =
                        !task.completed;

                    saveTasks();
                    displayTasks();
                }
            );


        // Delete
        const deleteButton =
            createActionButton(
                "Delete",
                "delete-button",
                `Delete "${task.text}"`,
                () => {

                    tasks =
                        tasks.filter(
                            item => item.id !== task.id
                        );

                    saveTasks();
                    displayTasks();
                }
            );


        actions.append(
            completeButton,
            deleteButton
        );


        li.append(
            text,
            actions
        );

        taskList.appendChild(li);
    });


    updateStats();


    // -------------------------
    // Empty State
    // -------------------------

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (tasks.length > 0) {

            emptyMessage.textContent =
                "No tasks match your current search or filter.";

        } else {

            emptyMessage.textContent =
                "No tasks yet. Add your first study task! 🎯";
        }

    } else {

        emptyMessage.style.display = "none";
    }
}


// -------------------------
// Add Task
// -------------------------

function addTask() {

    const taskText =
        input.value.trim();


    if (!taskText) {
        input.focus();
        return;
    }


    const newTask = {

        id:
            `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,

        text: taskText,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();
    displayTasks();


    input.value = "";
    input.focus();
}


// -------------------------
// Add Button
// -------------------------

addButton.addEventListener(
    "click",
    addTask
);


// -------------------------
// Enter Key
// -------------------------

input.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();
            addTask();
        }
    }
);


// -------------------------
// Search
// -------------------------

searchInput.addEventListener(
    "input",
    displayTasks
);


// -------------------------
// Filters
// -------------------------

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            currentFilter =
                button.dataset.filter;


            filterButtons.forEach(btn => {

                const isActive =
                    btn === button;

                btn.classList.toggle(
                    "active",
                    isActive
                );

                btn.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });


            displayTasks();
        }
    );
});


// -------------------------
// Theme
// -------------------------

function updateThemeButton(isDark) {

    themeButton.textContent =
        isDark ? "☀️" : "🌙";

    themeButton.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

    themeButton.setAttribute(
        "title",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}


function setTheme(isDark) {

    document.body.classList.toggle(
        "dark",
        isDark
    );

    localStorage.setItem(
        THEME_KEY,
        String(isDark)
    );

    updateThemeButton(isDark);
}


themeButton.addEventListener(
    "click",
    () => {

        const isDark =
            !document.body.classList.contains("dark");

        setTheme(isDark);
    }
);


// -------------------------
// Load Theme
// -------------------------

const savedTheme =
    localStorage.getItem(THEME_KEY);

setTheme(savedTheme === "true");


// -------------------------
// Start App
// -------------------------

displayTasks();
