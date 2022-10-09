// todo

const url = "https://cryptic-thicket-06903.herokuapp.com/api/todo";
class Todo {
    #items;
    #onStateCall;
    constructor() {
      this.#items = [];
      this.#onStateCall = null;
    }
    get items() {
      return this.#items;
    }
    // push
    addTodo(value) {
      const item = {
        title: value,
        status: false,
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      })
        .then((res) => {
          console.log("success");
          this.getTodos();
        })
        .catch((res) => {});
    }
  
    deleteTodo(id) {
      return fetch(`${url}/` + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return this.getTodos();
        })
        .catch((res) => {
          console.log("Error");
        });
    }
  
    toggleStatus(id, newStatus) {
      return fetch(`${url}/` + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })
        .then((res) => {
          return this.getTodos();
        })
        .catch((res) => {
          console.log("Error");
        });
    }
  
    //
    getTodos() {
      return fetch(url)
        .then((res) => res.json())
        .then((res) => {
          this.#items = res;
          this.statusUpdate();
          console.log(res)
        })
        .catch((er) => {});
    }
  
    statusUpdate() {
      if (this.#onStateCall) {
        this.#onStateCall();
      }
    }
    addStateChange(func) {
      this.#onStateCall = func;
    }
  
    // getMethod
    //postmethod
  }
  
  const todo = new Todo();
  
  todo.addStateChange(function () {
    renderItems(todo.items);
  });
  todo.getTodos();
  function createTodoElements(item) {
    const div = document.createElement("div");
    const title = document.createElement("p");
    const button = document.createElement("button");
    const deleteBtn = document.createElement("button");
    button.addEventListener("click", () => {
      todo.toggleStatus(item.id, !item.status);
      console.log(item);
    });
    deleteBtn.addEventListener("click", () => {
      todo.deleteTodo(item.id);
      console.log(item);
    });
    title.innerText = item.title;
    button.textContent = item.status.toString();
    deleteBtn.innerText = "Delete";
    div.append(title, button, deleteBtn);
  
    return div;
  }
  
  window.addEventListener("load", () => {
    const addBtn = document.getElementById("add-todo");
  
    addBtn.addEventListener("click", () => {
      const input = document.getElementById("todo-input");
      const text = input.value;
      todo.addTodo(text).then(() => {
        renderItems(todo.items);
      });
    });
  });
  
  function renderItems(items) {
    const target = document.getElementById("listView");
    const itemElements = items.map((item) => createTodoElements(item));
    target.innerHTML = null;
    target.append(...itemElements);
  }
  