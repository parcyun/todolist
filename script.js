const inputOverlay = document.getElementById("inputOverlay");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todo-list");
const main = document.getElementById("main");
const dateTitle = document.getElementById("date-title");

let todos = JSON.parse(localStorage.getItem("todos") || "null");

if (!todos) {
  todos = [
    { text: "빈 공간 터치해서 할 일 입력", done: false },
    { text: "체크박스 클릭해서 완료", done: false }
  ];
  localStorage.setItem("todos", JSON.stringify(todos));
}


function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${d}.`;
}

function updateDate() {
  const today = new Date();
  dateTitle.textContent = formatDate(today);
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todos[i].done = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.done) span.classList.add("completed");

    li.appendChild(checkbox);
    li.appendChild(span);
    todoList.appendChild(li);
  });
}

document.body.addEventListener("click", (e) => {
  // 이미 입력된 텍스트(할 일 목록의 li), 체크박스, 입력창, 오버레이 클릭 시는 무시
  if (
    e.target.closest('#todo-list li') ||
    e.target === todoInput
  ) return;

  // 오버레이가 열려 있으면 닫기, 아니면 열기
  if (!inputOverlay.classList.contains("hidden")) {
    inputOverlay.classList.add("hidden");
    return;
  }
  inputOverlay.classList.remove("hidden");
  todoInput.value = '';
  todoInput.placeholder = "오늘 새롭게 할 일을 입력하세요.";
  todoInput.focus();
});

// blur 이벤트는 제거 (불필요)

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (value) {
      todos.unshift({ text: value, done: false });
      saveTodos();
      renderTodos();
    }
    todoInput.value = "";
    inputOverlay.classList.add("hidden");
  }
});

updateDate();
renderTodos();
