let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskPriority = document.getElementById('taskPriority');
const taskDeadline = document.getElementById('taskDeadline');
const tasksContainer = document.getElementById('tasksContainer');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    title: taskTitle.value,
    priority: taskPriority.value,
    deadline: taskDeadline.value,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  taskForm.reset();
  renderTasks();
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit Task Title", task.title);
  const newDeadline = prompt("Edit Deadline (YYYY-MM-DD)", task.deadline);
  const newPriority = prompt("Edit Priority (Low, Medium, High)", task.priority);
  if (newTitle && newDeadline && newPriority) {
    task.title = newTitle;
    task.deadline = newDeadline;
    task.priority = newPriority;
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  tasksContainer.innerHTML = "";

  const sortedTasks = tasks.slice().sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    const prioOrder = { High: 1, Medium: 2, Low: 3 };
    if (prioOrder[a.priority] !== prioOrder[b.priority])
      return prioOrder[a.priority] - prioOrder[b.priority];
    return new Date(a.deadline) - new Date(b.deadline);
  });

  sortedTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.className = `task ${task.completed ? 'completed' : ''} ${task.priority.toLowerCase()}`;

    const taskDetails = document.createElement('div');
    taskDetails.className = "task-details";
    taskDetails.innerHTML = `<strong>${task.title}</strong><br>
      Priority: ${task.priority} | Deadline: ${task.deadline}`;

    const buttons = document.createElement('div');
    buttons.className = 'task-buttons';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? 'Undo' : 'Done';
    toggleBtn.onclick = () => toggleComplete(task.id);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.id);

    buttons.append(toggleBtn, editBtn, deleteBtn);
    taskEl.append(taskDetails, buttons);
    tasksContainer.appendChild(taskEl);
  });
}

renderTasks();
