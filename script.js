// State management
let currentWeekOffset = 0;
let tasks = {};
let currentEditingTask = null;
let draggedTask = null;
let currentLanguage = 'en';

// Internationalization
const translations = {
    en: {
        'menu.print': 'Print',
        'menu.share': 'Share',
        'menu.support': 'Support',
        'support.title': 'Support',
        'support.howToUse': 'How to use',
        'support.instruction1': 'Click on any day to add a task',
        'support.instruction2': 'Hover over tasks to see actions (complete, color, delete)',
        'support.instruction3': 'Drag and drop tasks to move them between days',
        'support.instruction4': 'Click on a task to edit it',
        'support.instruction5': 'Use the arrows to navigate between weeks',
        'support.shortcuts': 'Keyboard shortcuts',
        'support.escAction': 'Close modals',
        'support.enterAction': 'Save task',
        'someday': 'Someday',
        'addTask': '+ Add task',
        'deleteConfirm': 'Delete this task?',
        'days': {
            'Sun': 'Sun',
            'Mon': 'Mon',
            'Tue': 'Tue',
            'Wed': 'Wed',
            'Thu': 'Thu',
            'Fri': 'Fri',
            'Sat': 'Sat'
        },
        'months': ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    },
    da: {
        'menu.print': 'Udskriv',
        'menu.share': 'Del',
        'menu.support': 'Hjælp',
        'support.title': 'Hjælp',
        'support.howToUse': 'Sådan bruges',
        'support.instruction1': 'Klik på en dag for at tilføje en opgave',
        'support.instruction2': 'Hold musen over opgaver for at se handlinger (fuldført, farve, slet)',
        'support.instruction3': 'Træk og slip opgaver for at flytte dem mellem dage',
        'support.instruction4': 'Klik på en opgave for at redigere den',
        'support.instruction5': 'Brug pilene til at navigere mellem uger',
        'support.shortcuts': 'Tastaturgenveje',
        'support.escAction': 'Luk modaler',
        'support.enterAction': 'Gem opgave',
        'someday': 'En dag',
        'addTask': '+ Tilføj opgave',
        'deleteConfirm': 'Slet denne opgave?',
        'days': {
            'Sun': 'Søn',
            'Mon': 'Man',
            'Tue': 'Tir',
            'Wed': 'Ons',
            'Thu': 'Tor',
            'Fri': 'Fre',
            'Sat': 'Lør'
        },
        'months': ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
                   'Juli', 'August', 'September', 'Oktober', 'November', 'December']
    },
    kl: {
        'menu.print': 'Qalersitsineq',
        'menu.share': 'Akissut',
        'menu.support': 'Ikiuutit',
        'support.title': 'Ikiuutit',
        'support.howToUse': 'Qanoq atorneqartoq',
        'support.instruction1': 'Ulloq ilassutit suliaq ilaasortussannilluinnarpoq',
        'support.instruction2': 'Suliaq quppaligu ineriartortinneqartussannerat takusartussannilluinnarpoq',
        'support.instruction3': 'Suliaq aqusaaruk allannguutinullu ilalluinnarpoq',
        'support.instruction4': 'Suliaq ilassutit allannguutissavai',
        'support.instruction5': 'Sapaatip akunnera marluk atorlugo',
        'support.shortcuts': 'Tastatuurip akiussai',
        'support.escAction': 'Matussanik pissarineq',
        'support.enterAction': 'Suliaq aqutsissivik',
        'someday': 'Ulluinnarmi',
        'addTask': '+ Suliaq ilaat',
        'deleteConfirm': 'Suliaq peeruk?',
        'days': {
            'Sun': 'Sap',
            'Mon': 'Ata',
            'Tue': 'Mar',
            'Wed': 'Pin',
            'Thu': 'Sis',
            'Fri': 'Tal',
            'Sat': 'Arf'
        },
        'months': ['Januaari', 'Februaari', 'Marsi', 'Apriili', 'Maaji', 'Juuni',
                   'Juuli', 'Aggusti', 'Septembari', 'Oktobari', 'Novembari', 'Decembari']
    }
};

// Helper function to get translation
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
}

// Update all translated elements
function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // Update someday header
    const somedayHeader = document.querySelector('.someday-header');
    if (somedayHeader) {
        somedayHeader.textContent = t('someday');
    }

    // Re-render week to update day names and month
    renderWeek();
}

// Change language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('weeklyPlannerLanguage', lang);
    updateTranslations();
}

// Load language from storage
function loadLanguageFromStorage() {
    const stored = localStorage.getItem('weeklyPlannerLanguage');
    if (stored && translations[stored]) {
        currentLanguage = stored;
        document.getElementById('languageSelect').value = stored;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    loadLanguageFromStorage();
    updateTranslations();
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
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayKey = daysEn[date.getDay()];
    return t(`days.${dayKey}`);
}

function formatMonthYear(date) {
    const months = t('months');
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
    const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
    dayColumn.className = `day-column${isToday(date) ? ' today' : ''}${isWeekend ? ' weekend' : ''}`;

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
    addTaskArea.textContent = t('addTask');
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
    if (confirm(t('deleteConfirm'))) {
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
    addTaskArea.textContent = t('addTask');
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

// Menu functions
function toggleMenu() {
    const menu = document.getElementById('menuDropdown');
    menu.classList.toggle('active');
}

function closeMenu() {
    const menu = document.getElementById('menuDropdown');
    menu.classList.remove('active');
}

function handlePrint() {
    closeMenu();
    window.print();
}

function handleShare() {
    closeMenu();
    const weekDates = getWeekDates(currentWeekOffset);
    const startDate = formatDate(weekDates[0]);
    const endDate = formatDate(weekDates[6]);
    const title = `Weekly Planner - ${formatMonthYear(weekDates[0])}`;
    const text = `My weekly planner for ${startDate} to ${endDate}`;

    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: window.location.href
        }).catch((error) => {
            console.log('Error sharing:', error);
        });
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        }).catch((error) => {
            console.log('Error copying to clipboard:', error);
        });
    }
}

function openSupportModal() {
    closeMenu();
    const modal = document.getElementById('supportModal');
    modal.classList.add('active');
}

function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    modal.classList.remove('active');
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

    // Menu
    document.getElementById('menuBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.getElementById('printBtn').addEventListener('click', handlePrint);
    document.getElementById('shareBtn').addEventListener('click', handleShare);
    document.getElementById('supportBtn').addEventListener('click', openSupportModal);

    document.getElementById('languageSelect').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('menuDropdown');
        const menuBtn = document.getElementById('menuBtn');
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Support modal
    document.getElementById('closeSupportBtn').addEventListener('click', closeSupportModal);
    document.getElementById('supportModal').addEventListener('click', (e) => {
        if (e.target.id === 'supportModal') {
            closeSupportModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeColorPicker();
            closeSupportModal();
            closeMenu();
        }
    });
}
