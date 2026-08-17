const input = document.querySelector("input");
const button = document.querySelector("button");
const taskList = document.querySelector("ul");

let tasks = JSON.parse(localStorage.getItem("studyflow-tasks")) || [];

function saveTasks() {
    localStorage.setItem("studyflow-tasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (taskText) {
        const task = document.createElement("li");
        task.textContent = taskText;

        taskList.appendChild(task);
    });
}

button.addEventListener("click", function () {
    const taskText = input.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.push(taskText);
    saveTasks();
    displayTasks();

    input.value = "";
});

displayTasks();
