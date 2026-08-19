const input = document.querySelector("#taskInput");
const addButton = document.querySelector("#addButton");
const taskList = document.querySelector("#taskList");

const searchInput = document.querySelector("#searchInput");

const totalTasks = document.querySelector("#totalTasks");
const completedTasks = document.querySelector("#completedTasks");
const remainingTasks = document.querySelector("#remainingTasks");

const filterButtons = document.querySelectorAll("[data-filter]");

let tasks = JSON.parse(localStorage.getItem("studyflow-tasks")) || [];

let currentFilter = "all";

function saveTasks() {
    localStorage.setItem(
        "studyflow-tasks",
        JSON.stringify(tasks)
    );
}

function updateStats() {

    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    completedTasks.textContent = completed;

    remainingTasks.textContent =
        tasks.length - completed;
}

function displayTasks() {

    taskList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase().trim();

    let filteredTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "completed" && task.completed) ||
            (currentFilter === "remaining" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(function (task) {

        const li = document.createElement("li");

        const text = document.createElement("span");

        text.textContent = task.text;

        text.classList.add("task-text");

        if (task.completed) {
            text.classList.add("completed");
        }

        const actions = document.createElement("div");

        actions.classList.add("task-actions");

        const completeButton =
            document.createElement("button");

        completeButton.textContent =
            task.completed ? "Undo" : "Done";

        completeButton.addEventListener("click", function () {

            task.completed = !task.completed;

            saveTasks();

            displayTasks();
        });

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {

            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();

            displayTasks();
        });

        actions.appendChild(completeButton);
        actions.appendChild(deleteButton);

        li.appendChild(text);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    updateStats();
}

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

addButton.addEventListener(
    "click",
    addTask
);

input.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addTask();
        }
    }
);

searchInput.addEventListener(
    "input",
    displayTasks
);

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;

                displayTasks();
            }
        );
    }
);

displayTasks();
