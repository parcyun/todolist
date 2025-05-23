// ====== DOM 요소 선택 ======
const inputOverlay = document.getElementById("inputOverlay"); // 오버레이 배경
const todoInput = document.getElementById("todoInput");       // 입력창
const todoList = document.getElementById("todo-list");        // 할 일 목록
const dateTitle = document.getElementById("date-title");      // 날짜 표시 영역

// ====== 오늘 날짜 표시 ======
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

// ====== 할 일 목록 로드 및 저장 ======
function loadTodos() {
  return JSON.parse(localStorage.getItem("todos") || "null") || [
    { text: "빈 공간 터치해서 할 일 입력", done: false },
    { text: "체크박스 클릭해서 완료", done: false }
  ];
}
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ====== 할 일 목록 렌더링 ======
function renderTodos(todos) {
  todoList.innerHTML = "";
  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todos[i].done = checkbox.checked;
      saveTodos(todos);
      renderTodos(todos);
    });
    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.done) span.classList.add("completed");
    li.appendChild(checkbox);
    li.appendChild(span);
    todoList.appendChild(li);
  });
}

// ====== 오버레이 열기/닫기 ======
function openOverlay() {
  window.scrollTo(0, 0); // 오버레이 열릴 때 스크롤 최상단 고정
  inputOverlay.classList.remove("hidden");
  document.body.classList.add("overlay-open");
  todoInput.value = '';
  todoInput.placeholder = "오늘 새롭게 할 일을 입력하세요.";
  setTimeout(() => { todoInput.focus(); }, 10); // 반드시 키보드가 뜨도록 약간의 딜레이 후 focus
  // placeholder 위치 조정 (CSS에서 margin-top: 30vh;로 이미 적용)
}
function closeOverlay() {
  inputOverlay.classList.add("hidden");
  document.body.classList.remove("overlay-open");
  window.scrollTo(0, 0);
}

// ====== 빈 공간 클릭 시 오버레이 토글 ======
document.body.addEventListener("click", (e) => {
  if (
    e.target.closest('#todo-list li') ||
    e.target === todoInput
  ) return;
  if (!inputOverlay.classList.contains("hidden")) {
    closeOverlay();
    return;
  }
  openOverlay();
});

// ====== 입력창에서 Enter 입력 시 할 일 추가 ======
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (value) {
      todos.unshift({ text: value, done: false });
      saveTodos(todos);
      renderTodos(todos);
    }
    todoInput.value = "";
    closeOverlay();
  }
});

// ====== 초기화 ======
updateDate();
let todos = loadTodos();
renderTodos(todos);
