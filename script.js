// script.js
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const taskCounter = document.getElementById('taskCounter');
const darkToggle = document.getElementById('darkToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const remaining = total - completed;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed} | Remaining: ${remaining}`;
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;

    const controls = document.createElement('div');
    controls.innerHTML = `
      <button onclick="toggleComplete(${index})">✔</button>
      <button onclick="editTask(${index})">✏️</button>
      <button onclick="deleteTask(${index})">🗑️</button>
    `;

    li.appendChild(span);
    li.appendChild(controls);
    taskList.appendChild(li);
  });

  updateTaskCounter();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveTasks();
  renderTasks(getCurrentFilter());
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(getCurrentFilter());
}

function deleteTask(index) {
  const li = taskList.children[index];
  li.classList.add('fade-out');
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(getCurrentFilter());
  }, 300);
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks(getCurrentFilter());
  }
}

function getCurrentFilter() {
  const activeBtn = document.querySelector('.filter-btn.active');
  return activeBtn ? activeBtn.dataset.filter : 'all';
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-theme');
});

new Sortable(taskList, {
  animation: 150,
  onEnd: function (evt) {
    const [moved] = tasks.splice(evt.oldIndex, 1);
    tasks.splice(evt.newIndex, 0, moved);
    saveTasks();
    renderTasks(getCurrentFilter());
  }
});

renderTasks();
