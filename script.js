// ====== DOM 요소 선택 ======
const inputOverlay = document.getElementById("inputOverlay"); // 입력 오버레이(배경)
const todoInput = document.getElementById("todoInput");       // 할 일 입력창
const todoList = document.getElementById("todo-list");        // 할 일 목록
const main = document.getElementById("main");                 // 메인 컨테이너
const dateTitle = document.getElementById("date-title");      // 날짜 표시 영역

// ====== 로컬스토리지에서 할 일 목록 불러오기 ======
let todos = JSON.parse(localStorage.getItem("todos") || "null");

// ====== 첫 방문 시 예시 할 일 추가 ======
if (!todos) {
  todos = [
    { text: "빈 공간 터치해서 할 일 입력", done: false },
    { text: "체크박스 클릭해서 완료", done: false }
  ];
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ====== 오버레이 열릴 때 스크롤 위치 저장용 ======

// ====== 날짜 포맷 함수 ======
function formatDate(date) {
  // 날짜를 'YYYY. MM. DD.' 형식으로 반환
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${d}.`;
}

// ====== 오늘 날짜를 화면에 표시 ======
function updateDate() {
  const today = new Date();
  dateTitle.textContent = formatDate(today);
}

// ====== 할 일 목록을 로컬스토리지에 저장 ======
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ====== 할 일 목록을 화면에 렌더링 ======
function renderTodos() {
  // 할 일 목록을 모두 지우고 다시 그림
  todoList.innerHTML = "";
  todos.forEach((todo, i) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    // 체크박스 클릭 시 완료/미완료 토글
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

// ====== 빈 공간 클릭 시 오버레이 열기/닫기 및 화면 고정 ======
document.body.addEventListener("click", (e) => {
    // 할 일 항목, 입력창 클릭 시 오버레이 열지 않음
    if (
      e.target.closest('#todo-list li') ||
      e.target === todoInput
    ) return;
  
    // 오버레이가 열려 있으면 닫기
    if (!inputOverlay.classList.contains("hidden")) {
      inputOverlay.classList.add("hidden");
      document.body.classList.remove("overlay-open");
      return;
    }
    // 오버레이 열기 + body 고정
    inputOverlay.classList.remove("hidden");
    document.body.classList.add("overlay-open");
    todoInput.value = '';
    todoInput.placeholder = "오늘 새롭게 할 일을 입력하세요.";
    todoInput.focus();
    adjustInputPosition();
  });

// ====== 날짜 표시 및 할 일 목록 초기 렌더링 ======
updateDate();
renderTodos();
