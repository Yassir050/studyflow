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

let tasks =
    JSON.parse(localStorage.getItem("studyflow-tasks")) || [];

let currentFilter = "all";


// -------------------------
// Save Tasks
// -------------------------

function saveTasks() {

    localStorage.setItem(
        "studyflow-tasks",
        JSON.stringify(tasks)
    );
}


// -------------------------
// Update Statistics
// -------------------------

function updateStats() {

    const completed =
        tasks.filter(task => task.completed).length;

    totalTasks.textContent = tasks.length;

    completedTasks.textContent = completed;

    remainingTasks.textContent =
        tasks.length - completed;
}


// -------------------------
// Display Tasks
// -------------------------

function displayTasks() {

    taskList.innerHTML = "";

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
                (currentFilter === "completed" &&
                    task.completed) ||
                (currentFilter === "remaining" &&
                    !task.completed);

            return matchesSearch && matchesFilter;
        });


    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");


        // Task text
        const text =
            document.createElement("span");

        text.textContent = task.text;

        text.className = "task-text";


        if (task.completed) {
            text.classList.add("completed");
        }


        // Buttons container
        const actions =
            document.createElement("div");

        actions.className =
            "task-actions";


        // Complete button
        const completeButton =
            document.createElement("button");

        completeButton.textContent =
            task.completed ? "Undo" : "Done";

        completeButton.className =
            "complete-button";


        completeButton.addEventListener(
            "click",
            function () {

                task.completed =
                    !task.completed;

                saveTasks();

                displayTasks();
            }
        );


        // Delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.textContent =
            "Delete";

        deleteButton.className =
            "delete-button";


        deleteButton.addEventListener(
            "click",
            function () {

                tasks =
                    tasks.filter(
                        item => item.id !== task.id
                    );

                saveTasks();

                displayTasks();
            }
        );


        actions.appendChild(
            completeButton
        );

        actions.appendChild(
            deleteButton
        );


        li.appendChild(text);

        li.appendChild(actions);

        taskList.appendChild(li);
    });


    updateStats();


    if (filteredTasks.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";
    }
}


// -------------------------
// Add Task
// -------------------------

function addTask() {

    const taskText =
        input.value.trim();


    if (taskText === "") {

        return;
    }


    const newTask = {

        id: Date.now(),

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
    function (event) {

        if (event.key === "Enter") {

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

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                displayTasks();
            }
        );
    }
);


// -------------------------
// Dark Mode
// -------------------------

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "studyflow-dark-mode",
            darkMode
        );


        themeButton.textContent =
            darkMode ? "☀️" : "🌙";
    }
);


// -------------------------
// Load Dark Mode
// -------------------------

const savedTheme =
    localStorage.getItem(
        "studyflow-dark-mode"
    );


if (savedTheme === "true") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";
}


// -------------------------
// Start App
// -------------------------

displayTasks();
