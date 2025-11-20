// State management
let currentWeekOffset = 0;
let tasks = {};
let currentEditingTask = null;
let draggedTask = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderWeek();
    setupEventListeners();
});

// Get date utilities
function getWeekDates(offset = 0) {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);

    // Adjust to Monday (day 1)
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + diff + (offset * 7));

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        weekDates.push(date);
    }

    return weekDates;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

function formatMonthYear(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isToday(date) {
    const today = new Date();
    return formatDate(date) === formatDate(today);
}

// Render week
function renderWeek() {
    const weekDates = getWeekDates(currentWeekOffset);
    const weekContainer = document.getElementById('weekContainer');
    const monthYearEl = document.getElementById('currentMonthYear');

    // Update month/year display
    monthYearEl.textContent = formatMonthYear(weekDates[0]);

    // Clear and render week
    weekContainer.innerHTML = '';

    weekDates.forEach(date => {
        const dateKey = formatDate(date);
        const dayColumn = createDayColumn(date, dateKey);
        weekContainer.appendChild(dayColumn);
    });

    // Render someday tasks
    renderSomedayTasks();
}

// Create day column
function createDayColumn(date, dateKey) {
    const dayColumn = document.createElement('div');
    dayColumn.className = `day-column${isToday(date) ? ' today' : ''}`;

    // Header
    const header = document.createElement('div');
    header.className = 'day-header';

    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    dayName.textContent = formatDayName(date);

    const dayDate = document.createElement('div');
    dayDate.className = 'day-date';
    dayDate.textContent = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;

    header.appendChild(dayName);
    header.appendChild(dayDate);

    // Tasks container
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'day-tasks';
    tasksContainer.dataset.day = dateKey;

    // Render tasks for this day
    if (tasks[dateKey]) {
        tasks[dateKey].forEach(task => {
            const taskEl = createTaskElement(task, dateKey);
            tasksContainer.appendChild(taskEl);
        });
    }

    // Add task area
    const addTaskArea = document.createElement('div');
    addTaskArea.className = 'add-task-area';
    addTaskArea.textContent = '+ Add task';
    addTaskArea.onclick = () => createNewTask(dateKey, tasksContainer);

    // Drag and drop for add task area
    addTaskArea.addEventListener('dragover', handleDragOver);
    addTaskArea.addEventListener('drop', (e) => handleDrop(e, dateKey));
    addTaskArea.addEventListener('dragleave', handleDragLeave);

    dayColumn.appendChild(header);
    dayColumn.appendChild(tasksContainer);
    dayColumn.appendChild(addTaskArea);

    return dayColumn;
}

// Create task element
function createTaskElement(task, dateKey) {
    const taskEl = document.createElement('div');
    taskEl.className = `task-item${task.completed ? ' completed' : ''}`;
    taskEl.textContent = task.text;
    taskEl.dataset.taskId = task.id;
    taskEl.dataset.color = task.color || 'default';
    taskEl.setAttribute('draggable', 'true');

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'task-action-btn';
    completeBtn.innerHTML = task.completed ? '↩' : '✓';
    completeBtn.title = task.completed ? 'Uncomplete' : 'Complete';
    completeBtn.onclick = (e) => {
        e.stopPropagation();
        toggleTaskComplete(task.id, dateKey);
    };

    const colorBtn = document.createElement('button');
    colorBtn.className = 'task-action-btn';
    colorBtn.innerHTML = '🎨';
    colorBtn.title = 'Change color';
    colorBtn.onclick = (e) => {
        e.stopPropagation();
        openColorPicker(task.id, dateKey);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-action-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Delete';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task.id, dateKey);
    };

    actions.appendChild(completeBtn);
    actions.appendChild(colorBtn);
    actions.appendChild(deleteBtn);
    taskEl.appendChild(actions);

    // Edit on click
    taskEl.onclick = (e) => {
        if (e.target === taskEl) {
            editTask(task.id, dateKey, taskEl);
        }
    };

    // Drag events
    taskEl.addEventListener('dragstart', (e) => handleDragStart(e, task, dateKey));
    taskEl.addEventListener('dragend', handleDragEnd);

    return taskEl;
}

// Create new task
function createNewTask(dateKey, container) {
    const input = document.createElement('textarea');
    input.className = 'task-input';
    input.placeholder = 'Enter task...';

    const saveTask = () => {
        const text = input.value.trim();
        if (text) {
            const task = {
                id: Date.now().toString(),
                text: text,
                color: 'default',
                completed: false
            };

            if (!tasks[dateKey]) {
                tasks[dateKey] = [];
            }
            tasks[dateKey].push(task);
            saveTasksToStorage();
            renderWeek();
        } else {
            input.remove();
        }
    };

    input.onblur = saveTask;
    input.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveTask();
        } else if (e.key === 'Escape') {
            input.remove();
        }
    };

    container.appendChild(input);
    input.focus();
}

// Edit task
function editTask(taskId, dateKey, taskEl) {
    const task = tasks[dateKey].find(t => t.id === taskId);
    if (!task) return;

    const input = document.createElement('textarea');
    input.className = 'task-input';
    input.value = task.text;

    const saveEdit = () => {
        const text = input.value.trim();
        if (text) {
            task.text = text;
            saveTasksToStorage();
            renderWeek();
        } else {
            renderWeek();
        }
    };

    input.onblur = saveEdit;
    input.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            renderWeek();
        }
    };

    taskEl.replaceWith(input);
    input.focus();
    input.select();
}

// Delete task
function deleteTask(taskId, dateKey) {
    if (confirm('Delete this task?')) {
        tasks[dateKey] = tasks[dateKey].filter(t => t.id !== taskId);
        if (tasks[dateKey].length === 0) {
            delete tasks[dateKey];
        }
        saveTasksToStorage();
        renderWeek();
    }
}

// Toggle task complete
function toggleTaskComplete(taskId, dateKey) {
    const task = tasks[dateKey].find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderWeek();
    }
}

// Color picker
function openColorPicker(taskId, dateKey) {
    currentEditingTask = { taskId, dateKey };
    const modal = document.getElementById('colorPickerModal');
    modal.classList.add('active');
}

function closeColorPicker() {
    currentEditingTask = null;
    const modal = document.getElementById('colorPickerModal');
    modal.classList.remove('active');
}

function setTaskColor(color) {
    if (currentEditingTask) {
        const { taskId, dateKey } = currentEditingTask;
        const task = tasks[dateKey].find(t => t.id === taskId);
        if (task) {
            task.color = color;
            saveTasksToStorage();
            renderWeek();
        }
    }
    closeColorPicker();
}

// Drag and drop
function handleDragStart(e, task, dateKey) {
    draggedTask = { task, dateKey };
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedTask = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e, targetDateKey) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (draggedTask) {
        const { task, dateKey: sourceDateKey } = draggedTask;

        // Remove from source
        tasks[sourceDateKey] = tasks[sourceDateKey].filter(t => t.id !== task.id);
        if (tasks[sourceDateKey].length === 0) {
            delete tasks[sourceDateKey];
        }

        // Add to target
        if (!tasks[targetDateKey]) {
            tasks[targetDateKey] = [];
        }
        tasks[targetDateKey].push(task);

        saveTasksToStorage();
        renderWeek();
    }
}

// Someday section
function renderSomedayTasks() {
    const somedayContainer = document.getElementById('somedayTasks');
    somedayContainer.innerHTML = '';

    if (tasks['someday']) {
        tasks['someday'].forEach(task => {
            const taskEl = createTaskElement(task, 'someday');
            somedayContainer.appendChild(taskEl);
        });
    }

    const addTaskArea = document.createElement('div');
    addTaskArea.className = 'add-task-area';
    addTaskArea.textContent = '+ Add task';
    addTaskArea.onclick = () => createNewTask('someday', somedayContainer);

    // Drag and drop
    addTaskArea.addEventListener('dragover', handleDragOver);
    addTaskArea.addEventListener('drop', (e) => handleDrop(e, 'someday'));
    addTaskArea.addEventListener('dragleave', handleDragLeave);

    somedayContainer.appendChild(addTaskArea);
}

// Week navigation
function navigateWeek(direction) {
    currentWeekOffset += direction;
    renderWeek();
}

// Local storage
function saveTasksToStorage() {
    localStorage.setItem('weeklyPlannerTasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const stored = localStorage.getItem('weeklyPlannerTasks');
    if (stored) {
        tasks = JSON.parse(stored);
    }
}

// Event listeners
function setupEventListeners() {
    // Week navigation
    document.getElementById('prevWeekBtn').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('nextWeekBtn').addEventListener('click', () => navigateWeek(1));

    // Color picker
    document.getElementById('colorPickerModal').addEventListener('click', (e) => {
        if (e.target.id === 'colorPickerModal') {
            closeColorPicker();
        }
    });

    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            setTaskColor(color);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeColorPicker();
        }
    });
}
