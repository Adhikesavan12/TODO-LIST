const toDoButton = document.querySelector(".todo-button");
const toDolist = document.querySelector(".todo-list");
const toDoInput = document.querySelector(".todo-input");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getTodos);
toDoButton.addEventListener("click", addToDO);
toDolist.addEventListener("click", checkDelete);
filterOption.addEventListener("change", filterTodo);
toDolist.addEventListener("dblclick", editTodo);

function addToDO(event) {
  event.preventDefault();
  inputValue = toDoInput.value.trim();
  if (inputValue === "") {
    showTooltip("Task cannot be empty!");
    return;
  }
  if (isTaskAlreadyExists(inputValue)) {
    showTooltip("Task already exists!");
    return;
  }
  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo");

  const newToDo = document.createElement("li");
  newToDo.classList.add("todo-item");
  toDoDiv.appendChild(newToDo);
  newToDo.innerText = inputValue;

  saveToLocalStorage({ text: toDoInput.value, completed: false });

  const completeButton = document.createElement("button");
  completeButton.innerHTML = "<i class='fas fa-check'></i>";
  completeButton.classList.add("complete-btn");
  toDoDiv.appendChild(completeButton);

  const trashButton = document.createElement("button");
  trashButton.classList.add("trash-btn");
  trashButton.innerHTML = "<i class='fas fa-trash'></i>";
  toDoDiv.appendChild(trashButton);

  toDolist.appendChild(toDoDiv);

  toDoInput.value = "";
}

function isTaskAlreadyExists(newTaskText) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos.some((todo) => todo.text === newTaskText);
}

function checkDelete(e) {
  const item = e.target;
  const todo = item.parentElement;
  if (item.classList.contains("trash-btn")) {
    todo.classList.add("fall");
    removeLocalTodo(todo);
    todo.addEventListener("transitionend", () => todo.remove());
  }
  if (item.classList.contains("complete-btn"))
    todo.classList.toggle("completed");
  updateLocalTodoStatus(todo);
}

function filterTodo(event) {
  const todos = toDolist.childNodes;
  todos.forEach(function (todo) {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveToLocalStorage(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.forEach(function (todo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add("todo");

    if (todo.completed) {
      toDoDiv.classList.add("completed");
    }

    const newToDo = document.createElement("li");
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);
    newToDo.innerText = todo.text;

    const completeButton = document.createElement("button");
    completeButton.innerHTML = "<i class='fas fa-check'></i>";
    completeButton.classList.add("complete-btn");
    toDoDiv.appendChild(completeButton);

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    trashButton.innerHTML = "<i class='fas fa-trash'></i>";
    toDoDiv.appendChild(trashButton);

    toDolist.appendChild(toDoDiv);
  });
}

function removeLocalTodo(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const todoText = todo.childNodes[0].innerText;
  todos = todos.filter((todo) => todo.text !== todoText);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateLocalTodoStatus(todo) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const originalText = todo.querySelector(".todo-item").innerText;

  const todoIndex = todos.findIndex((t) => t.text === originalText);

  if (todoIndex !== -1) {
    todos[todoIndex].completed = todo.classList.contains("completed");
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function editTodo(e) {
  const targetLi = e.target.closest(".todo-item");
  if (!targetLi) return;

  const targetTodo = e.target.closest(".todo");
  if (!targetTodo) return;

  const isCompleted = targetTodo.classList.contains("completed");
  const originalText = targetTodo.querySelector(".todo-item").innerText;

  if (isCompleted) {
    showTooltip("Task is completed!");
  } else {
    Swal.fire({
      title: "Edit your task",
      input: "text",
      inputValue: originalText,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "custom-confirm-button",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newText = result.value;
        targetTodo.querySelector(".todo-item").innerText = newText;
        updateLocalTodoText(originalText, newText);
      }
    });
  }
}

function showTooltip(message) {
  Swal.fire({
    title: message,
    icon: "info",
    iconColor: "#ff6f47",
    showConfirmButton: false,
    timer: 1000,
  });
}
function updateLocalTodoText(originalText, newText) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  const todoIndex = todos.findIndex((todo) => todo.text === originalText);
  if (todoIndex !== -1) {
    todos[todoIndex].text = newText;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}
