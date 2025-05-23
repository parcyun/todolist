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
let scrollY = 0;

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

// ====== 빈 공간 클릭 시 오버레이 열기/닫기 및 스크롤 고정 ======
document.body.addEventListener("click", (e) => {
  // 할 일 항목, 입력창 클릭 시 오버레이 열지 않음
  if (
    e.target.closest('#todo-list li') ||
    e.target === todoInput
  ) return;

  // 오버레이가 열려 있으면 닫기 + 스크롤 복원
  if (!inputOverlay.classList.contains("hidden")) {
    inputOverlay.classList.add("hidden");
    document.body.classList.remove("overlay-open");
    // 스크롤 위치 복원
    window.scrollTo(0, scrollY);
    document.body.style.top = '';
    return;
  }
  // 오버레이 열기 + 스크롤 고정
  inputOverlay.classList.remove("hidden");
  scrollY = window.scrollY;
  document.body.classList.add("overlay-open");
  document.body.style.top = `-${scrollY}px`;
  todoInput.value = '';
  todoInput.placeholder = "오늘 새롭게 할 일을 입력하세요.";
  todoInput.focus();
  adjustInputPosition();
});

// ====== 입력창에서 Enter 입력 시 할 일 추가 ======
todoInput.addEventListener("keydown", (e) => {
  // Enter 키 입력 시 할 일 추가
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

// ====== 입력창 위치를 동적으로 조정(키보드 대응) ======
function adjustInputPosition() {
  // 입력창이 키보드에 가리지 않도록 위치 조정
  const overlay = document.getElementById('inputOverlay');
  const input = document.getElementById('todoInput');
  if (!overlay || !input) return;

  // 전체 높이와 현재 뷰포트 높이 차이 계산
  const windowHeight = window.innerHeight;
  // 오버레이가 열려 있을 때만 조정
  if (!overlay.classList.contains('hidden')) {
    // 화면의 20% 아래에 위치, 단 키보드가 올라오면 자동으로 위로
    input.style.marginTop = Math.max(windowHeight * 0.18, 32) + 'px';
  }
}

// ====== 오버레이 열릴 때, 리사이즈, 방향 전환, 첫 로딩 시 위치 조정 ======
document.getElementById('inputOverlay').addEventListener('transitionend', adjustInputPosition);
window.addEventListener('resize', adjustInputPosition);
window.addEventListener('orientationchange', adjustInputPosition);
document.addEventListener('DOMContentLoaded', adjustInputPosition);

// ====== 날짜 표시 및 할 일 목록 초기 렌더링 ======
updateDate();
renderTodos();
