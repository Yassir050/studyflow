// ========================================
// StudyFlow - Multilingual Task Manager
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
const themeIcon = document.querySelector("#themeIcon");

const languageSelect =
    document.querySelector("#languageSelect");


// -------------------------
// App Configuration
// -------------------------

const STORAGE_KEY = "studyflow-tasks";
const THEME_KEY = "studyflow-dark-mode";
const LANGUAGE_KEY = "studyflow-language";

const DEFAULT_LANGUAGE = "en";


// -------------------------
// App State
// -------------------------

let tasks = loadTasks();

let currentFilter = "all";

let currentLanguage =
    loadLanguage();


// -------------------------
// Translation Helper
// -------------------------

function t(key) {

    const translations =
        window.STUDYFLOW_TRANSLATIONS;

    if (
        !translations ||
        !translations[currentLanguage]
    ) {
        return key;
    }

    return (
        translations[currentLanguage][key] ||
        key
    );
}


// -------------------------
// Load Language
// -------------------------

function loadLanguage() {

    const savedLanguage =
        localStorage.getItem(LANGUAGE_KEY);

    if (
        savedLanguage === "en" ||
        savedLanguage === "ar"
    ) {
        return savedLanguage;
    }

    return DEFAULT_LANGUAGE;
}


// -------------------------
// Save Language
// -------------------------

function saveLanguage(language) {

    localStorage.setItem(
        LANGUAGE_KEY,
        language
    );
}


// -------------------------
// Apply Language
// -------------------------

function applyLanguage(language) {

    if (
        language !== "en" &&
        language !== "ar"
    ) {
        language = DEFAULT_LANGUAGE;
    }


    currentLanguage = language;

    saveLanguage(language);


    // -------------------------
    // Document direction
    // -------------------------

    document.documentElement.lang =
        language;

    document.documentElement.dir =
        language === "ar"
            ? "rtl"
            : "ltr";


    // -------------------------
    // Font
    // -------------------------

    document.body.classList.toggle(
        "arabic",
        language === "ar"
    );


    // -------------------------
    // Selected language
    // -------------------------

    if (languageSelect) {

        languageSelect.value =
            language;

        languageSelect.setAttribute(
            "aria-label",
            t("languageLabel")
        );
    }


    // -------------------------
    // Normal text
    // -------------------------

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            element.textContent =
                t(key);
        });


    // -------------------------
    // Placeholders
    // -------------------------

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;

            element.placeholder =
                t(key);
        });


    // -------------------------
    // ARIA labels
    // -------------------------

    document
        .querySelectorAll("[data-i18n-aria]")
        .forEach(element => {

            const key =
                element.dataset.i18nAria;

            element.setAttribute(
                "aria-label",
                t(key)
            );
        });


    // -------------------------
    // Theme button
    // -------------------------

    updateThemeButton(
        document.body.classList.contains("dark")
    );


    // -------------------------
    // Refresh dynamic tasks
    // -------------------------

    displayTasks();
}


// -------------------------
// Language Selector
// -------------------------

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        event => {

            applyLanguage(
                event.target.value
            );
        }
    );
}


// -------------------------
// Load Tasks
// -------------------------

function loadTasks() {

    try {

        const savedTasks =
            localStorage.getItem(
                STORAGE_KEY
            );


        if (!savedTasks) {
            return [];
        }


        const parsedTasks =
            JSON.parse(savedTasks);


        if (!Array.isArray(parsedTasks)) {
            return [];
        }


        return parsedTasks.filter(task => {

            return (
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            );

        });

    } catch (error) {

        console.error(
            "Could not load StudyFlow tasks:",
            error
        );

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

        console.error(
            "Could not save StudyFlow tasks:",
            error
        );
    }
}


// -------------------------
// Update Statistics
// -------------------------

function updateStats() {

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const remaining =
        tasks.length - completed;


    totalTasks.textContent =
        tasks.length;

    completedTasks.textContent =
        completed;

    remainingTasks.textContent =
        remaining;
}


// -------------------------
// Create Action Button
// -------------------------

function createActionButton(
    text,
    className,
    label,
    onClick
) {

    const button =
        document.createElement("button");


    button.type =
        "button";


    button.textContent =
        text;


    button.className =
        className;


    button.setAttribute(
        "aria-label",
        label
    );


    button.addEventListener(
        "click",
        onClick
    );


    return button;
}


// -------------------------
// Get Empty State
// -------------------------

function updateEmptyMessage(
    filteredTasks
) {

    const emptyIcon =
        emptyMessage.querySelector(
            ".empty-icon"
        );

    const emptyTitle =
        emptyMessage.querySelector(
            ".empty-title"
        );

    const emptyDescription =
        emptyMessage.querySelector(
            ".empty-description"
        );


    if (filteredTasks.length > 0) {

        emptyMessage.style.display =
            "none";

        return;
    }


    emptyMessage.style.display =
        "flex";


    // -------------------------
    // No tasks at all
    // -------------------------

    if (tasks.length === 0) {

        if (emptyIcon) {
            emptyIcon.textContent = "🎯";
        }

        if (emptyTitle) {
            emptyTitle.textContent =
                t("emptyTitle");
        }

        if (emptyDescription) {
            emptyDescription.textContent =
                t("emptyDescription");
        }

        return;
    }


    // -------------------------
    // Search / filter results
    // -------------------------

    if (emptyIcon) {
        emptyIcon.textContent = "🔎";
    }


    if (emptyTitle) {

        if (
            searchInput.value
                .trim()
                .length > 0
        ) {

            emptyTitle.textContent =
                t("noSearchResults");

        } else if (
            currentFilter === "completed"
        ) {

            emptyTitle.textContent =
                t("noCompletedTasks");

        } else if (
            currentFilter === "remaining"
        ) {

            emptyTitle.textContent =
                t("noRemainingTasks");

        } else {

            emptyTitle.textContent =
                t("noSearchResults");
        }
    }


    if (emptyDescription) {

        emptyDescription.textContent =
            "";
    }
}


// -------------------------
// Display Tasks
// -------------------------

function displayTasks() {

    taskList.replaceChildren();


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


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


            return (
                matchesSearch &&
                matchesFilter
            );
        });


    // -------------------------
    // Create task elements
    // -------------------------

    filteredTasks.forEach(task => {

        const li =
            document.createElement("li");


        li.className =
            "task-item";


        // -------------------------
        // Task Text
        // -------------------------

        const text =
            document.createElement("span");


        text.textContent =
            task.text;


        text.className =
            "task-text";


        if (task.completed) {

            text.classList.add(
                "completed"
            );
        }


        // -------------------------
        // Actions
        // -------------------------

        const actions =
            document.createElement("div");


        actions.className =
            "task-actions";


        // -------------------------
        // Complete / Undo
        // -------------------------

        const completeButton =
            createActionButton(

                task.completed
                    ? `↩ ${t("undo")}`
                    : `✓ ${t("done")}`,

                "complete-button",

                task.completed
                    ? `${t("undo")}: ${task.text}`
                    : `${t("done")}: ${task.text}`,

                () => {

                    task.completed =
                        !task.completed;


                    saveTasks();

                    displayTasks();
                }
            );


        // -------------------------
        // Delete
        // -------------------------

        const deleteButton =
            createActionButton(

                `🗑 ${t("delete")}`,

                "delete-button",

                `${t("delete")}: ${task.text}`,

                () => {

                    tasks =
                        tasks.filter(
                            item =>
                                item.id !== task.id
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


    // -------------------------
    // Statistics
    // -------------------------

    updateStats();


    // -------------------------
    // Empty State
    // -------------------------

    updateEmptyMessage(
        filteredTasks
    );
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

        text:
            taskText,

        completed:
            false
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

        if (
            event.key === "Enter"
        ) {

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

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    btn => {

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
                    }
                );


                displayTasks();
            }
        );
    }
);


// -------------------------
// Theme Button
// -------------------------

function updateThemeButton(
    isDark
) {

    // Keep the icon span instead
    // of replacing the whole button.

    if (themeIcon) {

        themeIcon.textContent =
            isDark
                ? "☀️"
                : "🌙";
    }


    const label =
        isDark
            ? t("lightMode")
            : t("darkMode");


    themeButton.setAttribute(
        "aria-label",
        label
    );


    themeButton.setAttribute(
        "title",
        label
    );
}


// -------------------------
// Set Theme
// -------------------------

function setTheme(isDark) {

    document.body.classList.toggle(
        "dark",
        isDark
    );


    localStorage.setItem(
        THEME_KEY,
        String(isDark)
    );


    updateThemeButton(
        isDark
    );
}


// -------------------------
// Theme Event
// -------------------------

themeButton.addEventListener(
    "click",
    () => {

        const isDark =
            !document.body.classList.contains(
                "dark"
            );


        setTheme(isDark);
    }
);


// -------------------------
// Load Theme
// -------------------------

const savedTheme =
    localStorage.getItem(
        THEME_KEY
    );


setTheme(
    savedTheme === "true"
);


// -------------------------
// Start Application
// -------------------------

applyLanguage(
    currentLanguage
);
