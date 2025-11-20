// State management
let currentWeekOffset = 0;
let tasks = {};
let currentEditingTask = null;
let draggedTask = null;
let currentLanguage = 'en';
let taskPopoverState = { taskId: null, dateKey: null, position: null };
let isCloning = false;
let draggedOverTask = null;

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
        'addTask': 'Add a task...',
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
        'addTask': 'Tilføj opgave...',
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
        'addTask': 'Suliaq ilaat...',
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

    // Render Monday to Friday (indices 0-4)
    for (let i = 0; i < 5; i++) {
        const date = weekDates[i];
        const dateKey = formatDate(date);
        const dayColumn = createDayColumn(date, dateKey);
        weekContainer.appendChild(dayColumn);
    }

    // Create weekend container for Saturday and Sunday
    const weekendContainer = document.createElement('div');
    weekendContainer.className = 'weekend-container';

    // Render Saturday (index 5)
    const satDate = weekDates[5];
    const satDateKey = formatDate(satDate);
    const satColumn = createDayColumn(satDate, satDateKey);
    weekendContainer.appendChild(satColumn);

    // Render Sunday (index 6)
    const sunDate = weekDates[6];
    const sunDateKey = formatDate(sunDate);
    const sunColumn = createDayColumn(sunDate, sunDateKey);
    weekendContainer.appendChild(sunColumn);

    weekContainer.appendChild(weekendContainer);

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
    taskEl.dataset.taskId = task.id;
    taskEl.dataset.color = task.color || 'default';
    taskEl.setAttribute('draggable', 'true');

    // Task text content
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.innerHTML = formatTaskText(task.text);
    taskEl.appendChild(taskText);

    // Clone icon
    const cloneIcon = document.createElement('span');
    cloneIcon.className = 'clone-icon';
    cloneIcon.innerHTML = '⋮⋮';
    cloneIcon.title = 'Drag to copy';
    cloneIcon.draggable = true;
    cloneIcon.addEventListener('dragstart', (e) => {
        e.stopPropagation();
        isCloning = true;
        handleDragStart(e, task, dateKey);
    });
    cloneIcon.addEventListener('dragend', (e) => {
        e.stopPropagation();
        isCloning = false;
        handleDragEnd(e);
    });
    taskEl.appendChild(cloneIcon);

    // Complete overlay (underline effect on hover)
    const completeOverlay = document.createElement('div');
    completeOverlay.className = 'task-complete-overlay';
    completeOverlay.onclick = (e) => {
        e.stopPropagation();
        toggleTaskComplete(task.id, dateKey);
    };
    taskEl.appendChild(completeOverlay);

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

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-action-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.title = 'Delete';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task.id, dateKey);
    };

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);
    taskEl.appendChild(actions);

    // Edit on click - open popover instead of inline editing
    taskEl.onclick = (e) => {
        if (e.target === taskEl || e.target === taskText) {
            openTaskPopover(task.id, dateKey, e.currentTarget);
        }
    };

    // Drag events
    taskEl.addEventListener('dragstart', (e) => handleDragStart(e, task, dateKey));
    taskEl.addEventListener('dragend', handleDragEnd);
    taskEl.addEventListener('dragover', (e) => handleTaskDragOver(e, task, dateKey));
    taskEl.addEventListener('dragleave', handleTaskDragLeave);
    taskEl.addEventListener('drop', (e) => handleTaskDrop(e, task, dateKey));

    return taskEl;
}

// Format task text with basic markdown-like formatting
function formatTaskText(text) {
    if (!text) return '';

    // Support for bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Support for italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Support for links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" onclick="event.stopPropagation()">$1</a>');

    // Support for bullet lists (lines starting with -)
    const lines = text.split('\n');
    let inList = false;
    let result = [];

    lines.forEach(line => {
        if (line.trim().startsWith('-')) {
            if (!inList) {
                result.push('<ul style="margin: 4px 0; padding-left: 20px;">');
                inList = true;
            }
            result.push(`<li>${line.trim().substring(1).trim()}</li>`);
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            result.push(line);
        }
    });

    if (inList) {
        result.push('</ul>');
    }

    return result.join('<br>');
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

// Open task popover editor
function openTaskPopover(taskId, dateKey, taskElement) {
    const task = tasks[dateKey]?.find(t => t.id === taskId);
    if (!task) return;

    taskPopoverState = { taskId, dateKey, taskElement };

    const popover = document.getElementById('taskPopover');
    const backdrop = document.getElementById('taskPopoverBackdrop');
    const textarea = document.getElementById('taskEditorTextarea');

    // Set textarea value
    textarea.value = task.text;

    // Set current color selection
    document.querySelectorAll('.color-option-small').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === (task.color || 'default')) {
            btn.classList.add('selected');
        }
    });

    // Display attached files if any
    displayAttachedFiles(task);

    // Position popover near the task
    const rect = taskElement.getBoundingClientRect();
    const popoverWidth = 400;
    const popoverHeight = 450;

    let left = rect.right + 10;
    let top = rect.top;

    // Adjust if popover goes off screen
    if (left + popoverWidth > window.innerWidth) {
        left = rect.left - popoverWidth - 10;
    }

    if (top + popoverHeight > window.innerHeight) {
        top = window.innerHeight - popoverHeight - 20;
    }

    if (left < 10) {
        left = 10;
    }

    if (top < 10) {
        top = 10;
    }

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;

    // Show backdrop and popover
    backdrop.classList.add('active');
    popover.classList.add('active');

    // Focus textarea
    textarea.focus();
    textarea.select();
}

// Close task popover
function closeTaskPopover() {
    const popover = document.getElementById('taskPopover');
    const backdrop = document.getElementById('taskPopoverBackdrop');
    const textarea = document.getElementById('taskEditorTextarea');
    const moveDropdown = document.getElementById('taskMoveDropdown');

    // Save changes
    if (taskPopoverState.taskId && taskPopoverState.dateKey) {
        const task = tasks[taskPopoverState.dateKey]?.find(t => t.id === taskPopoverState.taskId);
        if (task) {
            const newText = textarea.value.trim();
            if (newText) {
                task.text = newText;
                saveTasksToStorage();
                renderWeek();
            }
        }
    }

    // Hide popover, backdrop, and dropdown
    popover.classList.remove('active');
    backdrop.classList.remove('active');
    moveDropdown.classList.remove('active');
    taskPopoverState = { taskId: null, dateKey: null, taskElement: null };
}

// Apply text formatting in popover
function applyTextFormatting(format) {
    const textarea = document.getElementById('taskEditorTextarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let newText = '';
    let cursorOffset = 0;

    switch (format) {
        case 'bold':
            newText = `${beforeText}**${selectedText}**${afterText}`;
            cursorOffset = selectedText ? 2 : 2;
            break;
        case 'italic':
            newText = `${beforeText}*${selectedText}*${afterText}`;
            cursorOffset = selectedText ? 1 : 1;
            break;
        case 'list':
            if (selectedText) {
                const lines = selectedText.split('\n');
                const bulletedLines = lines.map(line => line.trim() ? `- ${line}` : line).join('\n');
                newText = `${beforeText}${bulletedLines}${afterText}`;
                cursorOffset = 2;
            } else {
                newText = `${beforeText}- ${afterText}`;
                cursorOffset = 2;
            }
            break;
        case 'link':
            const url = prompt('Enter URL:');
            if (url) {
                const linkText = selectedText || 'Link';
                newText = `${beforeText}[${linkText}](${url})${afterText}`;
                cursorOffset = selectedText ? 0 : linkText.length + url.length + 4;
            } else {
                return;
            }
            break;
        case 'emoji':
            // Trigger native emoji picker if available
            const fileInput = document.getElementById('fileInput');
            if (typeof fileInput.showPicker === 'undefined') {
                // Fallback: insert common emojis
                const emoji = prompt('Enter emoji or choose: 😀 ✅ ❤️ 🎉 ⭐ 📝 💡 🔥');
                if (emoji) {
                    newText = `${beforeText}${emoji}${afterText}`;
                    cursorOffset = emoji.length;
                }
            } else {
                // For browsers that support it, try to use native picker
                const emoji = prompt('Enter emoji: 😀 ✅ ❤️ 🎉 ⭐ 📝 💡 🔥 👍 ✨');
                if (emoji) {
                    newText = `${beforeText}${emoji}${afterText}`;
                    cursorOffset = emoji.length;
                }
            }
            break;
        case 'file':
            // Trigger file input
            document.getElementById('fileInput').click();
            return;
    }

    if (newText) {
        textarea.value = newText;
        textarea.focus();

        if (format === 'bold' || format === 'italic') {
            textarea.setSelectionRange(start + cursorOffset, end + cursorOffset);
        } else {
            textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
        }
    }
}

// Move task to different date
function moveTask(action) {
    if (!taskPopoverState.taskId || !taskPopoverState.dateKey) return;

    const task = tasks[taskPopoverState.dateKey]?.find(t => t.id === taskPopoverState.taskId);
    if (!task) return;

    let targetDateKey = null;

    switch (action) {
        case 'tomorrow':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            targetDateKey = formatDate(tomorrow);
            break;
        case 'nextweek':
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            targetDateKey = formatDate(nextWeek);
            break;
        case 'someday':
            targetDateKey = 'someday';
            break;
    }

    if (!targetDateKey) return;

    // Remove from source
    tasks[taskPopoverState.dateKey] = tasks[taskPopoverState.dateKey].filter(t => t.id !== task.id);
    if (tasks[taskPopoverState.dateKey].length === 0 && taskPopoverState.dateKey !== 'someday') {
        delete tasks[taskPopoverState.dateKey];
    }

    // Add to target
    if (!tasks[targetDateKey]) {
        tasks[targetDateKey] = [];
    }
    tasks[targetDateKey].push(task);

    saveTasksToStorage();
    closeTaskPopover();
    renderWeek();
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

        if (isCloning) {
            // Clone the task
            const clonedTask = {
                ...task,
                id: Date.now().toString()
            };

            // Add to target
            if (!tasks[targetDateKey]) {
                tasks[targetDateKey] = [];
            }
            tasks[targetDateKey].push(clonedTask);
        } else {
            // Move the task
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
        }

        saveTasksToStorage();
        renderWeek();
    }
}

// Handle drag over task (for reordering)
function handleTaskDragOver(e, targetTask, targetDateKey) {
    if (!draggedTask) return;

    e.preventDefault();
    e.stopPropagation();

    const { task: draggedTaskData, dateKey: sourceDateKey } = draggedTask;

    // Don't allow dropping on itself
    if (draggedTaskData.id === targetTask.id) return;

    e.currentTarget.classList.add('drag-over-task');
    draggedOverTask = { task: targetTask, dateKey: targetDateKey, element: e.currentTarget };
}

// Handle drag leave task
function handleTaskDragLeave(e) {
    e.currentTarget.classList.remove('drag-over-task');
}

// Handle drop on task (for reordering)
function handleTaskDrop(e, targetTask, targetDateKey) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over-task');

    if (!draggedTask) return;

    const { task: draggedTaskData, dateKey: sourceDateKey } = draggedTask;

    // Don't allow dropping on itself
    if (draggedTaskData.id === targetTask.id) return;

    // Determine if we're dropping above or below the target
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const targetMiddle = rect.top + rect.height / 2;
    const insertBefore = mouseY < targetMiddle;

    if (isCloning) {
        // Clone the task
        const clonedTask = {
            ...draggedTaskData,
            id: Date.now().toString()
        };

        if (!tasks[targetDateKey]) {
            tasks[targetDateKey] = [];
        }

        const targetIndex = tasks[targetDateKey].findIndex(t => t.id === targetTask.id);
        const insertIndex = insertBefore ? targetIndex : targetIndex + 1;
        tasks[targetDateKey].splice(insertIndex, 0, clonedTask);
    } else {
        // Move the task
        if (sourceDateKey === targetDateKey) {
            // Reordering within the same day
            const taskArray = tasks[sourceDateKey];
            const draggedIndex = taskArray.findIndex(t => t.id === draggedTaskData.id);
            const targetIndex = taskArray.findIndex(t => t.id === targetTask.id);

            // Remove from old position
            taskArray.splice(draggedIndex, 1);

            // Calculate new index (account for removal)
            let newTargetIndex = taskArray.findIndex(t => t.id === targetTask.id);
            const insertIndex = insertBefore ? newTargetIndex : newTargetIndex + 1;

            // Insert at new position
            taskArray.splice(insertIndex, 0, draggedTaskData);
        } else {
            // Moving between different days
            // Remove from source
            tasks[sourceDateKey] = tasks[sourceDateKey].filter(t => t.id !== draggedTaskData.id);
            if (tasks[sourceDateKey].length === 0) {
                delete tasks[sourceDateKey];
            }

            // Add to target at specific position
            if (!tasks[targetDateKey]) {
                tasks[targetDateKey] = [];
            }

            const targetIndex = tasks[targetDateKey].findIndex(t => t.id === targetTask.id);
            const insertIndex = insertBefore ? targetIndex : targetIndex + 1;
            tasks[targetDateKey].splice(insertIndex, 0, draggedTaskData);
        }
    }

    saveTasksToStorage();
    renderWeek();
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

// Display attached files
function displayAttachedFiles(task) {
    const attachedFilesContainer = document.getElementById('attachedFiles');
    attachedFilesContainer.innerHTML = '';

    if (task.attachedFiles && task.attachedFiles.length > 0) {
        task.attachedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'attached-file-item';
            fileItem.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <span class="attached-file-name">${file.name}</span>
                <button class="attached-file-remove" onclick="removeAttachedFile(${index})" aria-label="Remove file">✕</button>
            `;
            attachedFilesContainer.appendChild(fileItem);
        });
    }
}

// Handle file input change
function handleFileInput(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !taskPopoverState.taskId || !taskPopoverState.dateKey) return;

    const task = tasks[taskPopoverState.dateKey]?.find(t => t.id === taskPopoverState.taskId);
    if (!task) return;

    // Initialize attachedFiles if not exists
    if (!task.attachedFiles) {
        task.attachedFiles = [];
    }

    // Add files (store only file names and sizes for now)
    files.forEach(file => {
        task.attachedFiles.push({
            name: file.name,
            size: file.size,
            type: file.type
        });
    });

    saveTasksToStorage();
    displayAttachedFiles(task);

    // Clear file input
    e.target.value = '';
}

// Remove attached file
function removeAttachedFile(index) {
    if (!taskPopoverState.taskId || !taskPopoverState.dateKey) return;

    const task = tasks[taskPopoverState.dateKey]?.find(t => t.id === taskPopoverState.taskId);
    if (!task || !task.attachedFiles) return;

    task.attachedFiles.splice(index, 1);
    saveTasksToStorage();
    displayAttachedFiles(task);
}

// Toggle move dropdown menu
function toggleMoveDropdown() {
    const dropdown = document.getElementById('taskMoveDropdown');
    dropdown.classList.toggle('active');
}

// Set task color from popover
function setTaskColorFromPopover(color) {
    if (!taskPopoverState.taskId || !taskPopoverState.dateKey) return;

    const task = tasks[taskPopoverState.dateKey]?.find(t => t.id === taskPopoverState.taskId);
    if (!task) return;

    task.color = color;

    // Update selected color button
    document.querySelectorAll('.color-option-small').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === color) {
            btn.classList.add('selected');
        }
    });

    saveTasksToStorage();
    renderWeek();
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

    // Task popover
    document.getElementById('closeTaskPopover').addEventListener('click', closeTaskPopover);
    document.getElementById('taskPopoverBackdrop').addEventListener('click', closeTaskPopover);

    // Three-dots menu in popover
    document.getElementById('taskPopoverMenuBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMoveDropdown();
    });

    // Toolbar buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            applyTextFormatting(format);
        });
    });

    // Move task buttons (dropdown items)
    document.querySelectorAll('.move-dropdown-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.move;
            moveTask(action);
        });
    });

    // Color picker in popover
    document.querySelectorAll('.color-option-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            setTaskColorFromPopover(color);
        });
    });

    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileInput);

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
        const popover = document.getElementById('taskPopover');
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
        // Close popover when clicking outside
        if (!popover.contains(e.target) && !e.target.closest('.task-item')) {
            if (popover.classList.contains('active')) {
                closeTaskPopover();
            }
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
            closeTaskPopover();
        }
    });
}
