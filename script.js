const input = document.querySelector("input");
const button = document.querySelector("button");
const taskList = document.querySelector("ul");

let tasks = JSON.parse(localStorage.getItem("studyflow-tasks")) || [];

function saveTasks() {
    localStorage.setItem("studyflow-tasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = task.text;

        if (task.completed) {
            text.classList.add("completed");
        }

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Done";

        completeButton.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.appendChild(text);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

button.addEventListener("click", function () {
    const taskText = input.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    displayTasks();

    input.value = "";
});

displayTasks();
