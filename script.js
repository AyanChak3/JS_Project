function loadTodos() {
    // Load the todos from the browser storage
    const todos = JSON.parse(localStorage.getItem("todos")) || { "todoList": [] };
    return todos;
}

function refreshTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Function to add todoText to the local storage of the browser
function addTodoToLocalStorage(todo) {
    const todos = loadTodos(); // Load existing todos from local storage
    todos.todoList.push({ ...todo });
    localStorage.setItem("todos", JSON.stringify(todos)); // Save updated todos back to local storage
}

function executeFilterAction(event) {
    const todoList = document.getElementById("todoList");
    const element = event.target;
    const value = element.getAttribute("data-filter");
    todoList.innerHTML = '';
    const todos = loadTodos();
    if (value == "all") {
        todos.todoList.forEach(todo => {
            appendTodoInHtml(todo);
        });
    } else if (value == "pending") {
        todos.todoList.forEach(todo => {
            if (!todo.isCompleted)
                appendTodoInHtml(todo);
        });
    } else {
        todos.todoList.forEach(todo => {
            if (todo.isCompleted)
                appendTodoInHtml(todo);
        });
    }
}

function appendTodoInHtml(todo) {
    const todoList = document.getElementById("todoList");
    const todoItem = document.createElement("li");

    todoItem.setAttribute("data-id", todo.id); // Unique identifier for the todo item

    const textDiv = document.createElement("div");

    if (todo.isCompleted) {
        textDiv.classList.add("completed");
    }
    textDiv.textContent = todo.text;
    todoItem.classList.add("todoItem");

    const wrapper = document.createElement("div");
    wrapper.classList.add("todoButtons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");
    editBtn.addEventListener("click", editTodo);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click", deleteTodo);

    const completedBtn = document.createElement("button");
    completedBtn.textContent = (todo.isCompleted) ? "Reset" : "Completed";
    completedBtn.classList.add("completeBtn");
    completedBtn.addEventListener("click", toggleTodo);

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(completedBtn);

    todoItem.appendChild(textDiv);
    todoItem.appendChild(wrapper);

    todoList.appendChild(todoItem);
}

function resetHtmlTodos(todos) {
    const todoList = document.getElementById("todoList");
    todoList.innerHTML = '';
    todos.todoList.forEach(todo => {
        appendTodoInHtml(todo); // Re-append all todos to HTML
    });
}

function toggleTodo(event) {
    console.log("toggling");
    const todoItem = event.target.parentElement.parentElement;
    const todoId = todoItem.getAttribute("data-id"); // Get todo id
    const todos = loadTodos();
    todos.todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.isCompleted = !todo.isCompleted;
        }
    });
    console.log(todos);
    refreshTodos(todos); // Update the local storage with the toggled state
    resetHtmlTodos(todos);
}

function editTodo(event) {
    const todoItem = event.target.parentElement.parentElement;
    const todoId = todoItem.getAttribute("data-id"); // Get todo id
    let todos = loadTodos(); // Load todos
    const response = prompt("What is the new todo value you want to set?");
    todos.todoList.forEach(todo => {
        if (todo.id == todoId) {
            todo.text = response;
        }
    });
    refreshTodos(todos); // Update the local storage with the edited todo
    resetHtmlTodos(todos);
}

function deleteTodo(event) {
    const todoItem = event.target.parentElement.parentElement;
    const todoId = todoItem.getAttribute("data-id"); // Get todo id
    let todos = loadTodos(); // Load todos
    todos.todoList = todos.todoList.filter(todo => todo.id != todoId); // Filter out the deleted todo
    refreshTodos(todos); // Update the local storage with the remaining todos
    resetHtmlTodos(todos); // Refresh the HTML representation
}

function addNewTodo() {
    const todoText = document.getElementById("todoInput").value;
    if (todoText == '') {
        alert("Please write something for the todo");
    } else {
        const todos = loadTodos();
        const id = todos.todoList.length;
        const newTodo = { text: todoText, isCompleted: false, id };
        addTodoToLocalStorage(newTodo);
        appendTodoInHtml(newTodo);
        document.getElementById("todoInput").value = ''; // Clear the input after adding the todo
    }
}

// Execute when the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const submitButton = document.getElementById("addTodo");
    let todos = loadTodos();
    const todoList = document.getElementById("todoList");
    const filterBtns = document.getElementsByClassName("filterBtn");

    for (const btn of filterBtns) {
        btn.addEventListener("click", executeFilterAction);
    }

    submitButton.addEventListener("click", addNewTodo);
    todoInput.addEventListener("change", (event) => {
        const todoText = event.target.value;
        event.target.value = todoText.trim(); // Remove leading and trailing spaces
    });

    // Show all the todos (which have already been added), even after reloading the browser
    todos.todoList.forEach(todo => {
        appendTodoInHtml(todo);
    });
    //To ensure that todo is added by clicking the "Add todo" option
    document.addEventListener("keypress", (event) => {
        if (event.code == 'Enter') {
            addNewTodo();
        }
    });
});
