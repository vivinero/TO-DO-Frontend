const API_URL = "https://to-do-list-backendd.onrender.com";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const res = await fetch(`${API_URL}/task`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });

        const data = await res.json();

        if (res.ok) {
            const save = confirm("Do you want to save this task and view it later?");
            if (save) {
                window.location.href = "signup.html";
            } else {
                loadTasks();
            }
        } else {
            alert(data.error || "Failed to create task");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }

    taskInput.value = "";
});

async function loadTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`);
        const data = await res.json();

        taskList.innerHTML = "";
        if (data.data) {
            data.data.forEach(renderTask);
        }
    } catch (err) {
        console.error("Failed to load tasks:", err);
    }
}

function renderTask(task) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.title;
    input.disabled = true;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.style.display = "none";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // Edit
    editBtn.addEventListener("click", () => {
        input.disabled = false;
        input.focus();
        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
    });

    // Save
    saveBtn.addEventListener("click", async () => {
        await fetch(`${API_URL}/task/${task._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: input.value }),
        });
        input.disabled = true;
        editBtn.style.display = "inline-block";
        saveBtn.style.display = "none";
        loadTasks();
    });

    // Delete
    deleteBtn.addEventListener("click", async () => {
        await fetch(`${API_URL}/task/${task._id}`, {
            method: "DELETE",
        });
        loadTasks();
    });

    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(saveBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Initial load
loadTasks();
