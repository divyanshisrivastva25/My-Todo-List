const inputTodo = document.getElementById("input-todo"),
  addButton = document.getElementById("addButton"),
  todoList = document.getElementById("todo-list");

//function to create todo lists.........
function addTodoList() {
  
  const newId = Date.now(); // Unique ID based on current time
  let newTodoList = document.createElement("ul");

  // remove any leading or trailing spaces.
  let inputTodos = inputTodo.value.trim();

  if (inputTodos === "") {
    alert("please write something!");
    return;
  }
  else {
    newTodoList.innerHTML = `<p class ="todoText" contenteditable="false">${inputTodos}</p>
                              <span class = "material-icons edit" data-id="${newId}">edit</span> 
                              <span class= "material-icons delete" data-id="${newId}">delete</span>`;
    todoList.appendChild(newTodoList);
    inputTodo.value = "";
    const todoText = newTodoList.querySelector(".todoText");
    saveTodoList(todoText.innerText, newId);
  }
}

//function to update todo lists(like - edit/delete)
function updateTodolist(e) {
  //e(Event Object):
  //e.target(trigger element)
  const todoText = e.target.parentElement.querySelector(".todoText");

  //code for delete
  if (e.target.classList.contains("delete")) {
    todoList.removeChild(e.target.parentElement);
    deleteTodoList(todoText.innerText);   
  }

  //code for edit
  if (e.target.classList.contains("edit")) {
    const todoText = e.target.parentElement.querySelector(".todoText");
    todoText.contentEditable = true;
    todoText.focus();
    todoText.addEventListener("blur", () => {
      saveTodoList(todoText.innerText, e.target.dataset.id); // Now passing the id to save the specific todo's updated text
      todoText.contentEditable = false;
    });
  }
}

//function for save todo list in local storage
function saveTodoList(todo, id) {
  let todoArray = JSON.parse(localStorage.getItem("todoArray")) || [];
  console.log(todoArray);

  // Find the index of the todo text (if already exists)
  const index = todoArray.findIndex((item) => item.id == id);
  console.log(index);
  if (index != -1) {
    // Update existing todo
    todoArray[index].todoText = todo;
  } else {
    // Add new todo  with a unique id
    //Date.now() ek built-in JavaScript method hai
    todoArray.push({ todoText: todo, id: Date.now() });
  }

  // todoArray.push(todo);
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

//delete todo list from storage
function deleteTodoList(id) {
  let todoArray = JSON.parse(localStorage.getItem("todoArray"));
  const index = todoArray.findIndex((item) => item.todoText === id);
  if (index !== -1) {
    todoArray.splice(index, 1);
    localStorage.setItem("todoArray", JSON.stringify(todoArray));
  }
}

//show todo list when page loaded.
function showTodoList() {
  let todoArray = JSON.parse(localStorage.getItem("todoArray"));
  if (todoArray) {
    todoArray.forEach((todo) => {
      let newTodoList = document.createElement("ul");
      newTodoList.innerHTML = `
      <p class="todoText" contenteditable="false">${todo.todoText}</p>
      <span class="material-icons edit" data-id="${todo.id}">edit</span>
      <span class="material-icons delete" data-id="${todo.id}">delete</span>
    `;
      todoList.appendChild(newTodoList);
    });
  }
}
showTodoList();

addButton.addEventListener("click", addTodoList);
todoList.addEventListener("click", updateTodolist);
