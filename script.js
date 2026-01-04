// ============================================
// 상수 및 설정
// ============================================
const CONFIG = {
    storageKey: 'taskmaster_tasks',
    themeKey: 'taskmaster_theme',
    mandalartKey: 'taskmaster_mandalart',
    booksKey: 'taskmaster_books',
    notifiedKey: 'taskmaster_notified'
};

// ============================================
// Supabase 설정
// ============================================
const SUPABASE_URL = 'https://zwyhygngftrdkmvcicrb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3eWh5Z25nZnRyZGttdmNpY3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NDI2MDQsImV4cCI6MjA4MzAxODYwNH0.wWbxl4ehTlzTUq-ZYIJYArKJMAFNpf8k5Quy4G7k0NM';

let supabaseClient = null;
let currentUser = null;

// Supabase 초기화
function initSupabase() {
    if (window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    persistSession: true,
                    storageKey: 'taskmaster-auth',
                    storage: window.localStorage,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
            checkAuthState();
        } catch (e) {
            showToast('Supabase 초기화 오류', 'error');
        }
    } else {
        showToast('클라우드 연결 실패', 'error');
    }
}

const PRIORITY_LABELS = {
    high: '높음',
    medium: '보통',
    low: '낮음'
};

// ============================================
// 토스트 알림
// ============================================
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    toast.style.cssText = `background:${colors[type] || colors.info};color:white;padding:12px 20px;border-radius:8px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);opacity:0;transition:opacity 0.3s;`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.style.opacity = '1');

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================
// DOM 요소
// ============================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const elements = {
    // Header
    themeToggle: $('#themeToggle'),
    totalTasks: $('#totalTasks'),
    completedTasks: $('#completedTasks'),
    completionRate: $('#completionRate'),

    // Search & Filter
    searchInput: $('#searchInput'),
    searchClear: $('#searchClear'),
    priorityChips: $('#priorityChips'),
    filterDue: $('#filterDue'),

    // Tabs
    tabBtns: $$('.tab-btn'),
    views: $$('.view'),
    kanbanView: $('#kanbanView'),
    matrixView: $('#matrixView'),
    completedView: $('#completedView'),
    completedList: $('#completedList'),
    clearAllCompleted: $('#clearAllCompleted'),

    // Report View
    reportView: $('#reportView'),
    reportWeek: $('#reportWeek'),
    weeklyCompleted: $('#weeklyCompleted'),
    weeklyRate: $('#weeklyRate'),
    onTimeRate: $('#onTimeRate'),
    streakDays: $('#streakDays'),
    dailyChart: $('#dailyChart'),
    priorityChart: $('#priorityChart'),
    achievementsList: $('#achievementsList'),
    pendingList: $('#pendingList'),

    // Calendar View
    calendarView: $('#calendarView'),
    calendarDays: $('#calendarDays'),
    currentMonth: $('#currentMonth'),
    prevMonth: $('#prevMonth'),
    nextMonth: $('#nextMonth'),
    todayBtn: $('#todayBtn'),
    dayDetail: $('#dayDetail'),
    dayDetailTitle: $('#dayDetailTitle'),
    dayDetailTasks: $('#dayDetailTasks'),
    addTaskToDay: $('#addTaskToDay'),

    // Task Lists
    todoList: $('#todoList'),
    inprogressList: $('#inprogressList'),
    doneList: $('#doneList'),
    q1List: $('#q1List'),
    q2List: $('#q2List'),
    q3List: $('#q3List'),
    q4List: $('#q4List'),

    // Counts
    todoCount: $('#todoCount'),
    inprogressCount: $('#inprogressCount'),
    doneCount: $('#doneCount'),

    // Add Buttons
    addTaskBtns: $$('.add-task-btn, .add-task-btn-icon'),

    // Task Modal
    taskModal: $('#taskModal'),
    taskForm: $('#taskForm'),
    modalTitle: $('#modalTitle'),
    modalClose: $('#modalClose'),
    cancelBtn: $('#cancelBtn'),
    taskId: $('#taskId'),
    taskTarget: $('#taskTarget'),
    taskTitle: $('#taskTitle'),
    taskDesc: $('#taskDesc'),
    taskPriority: $('#taskPriority'),
    taskDueDate: $('#taskDueDate'),

    // Delete Modal
    deleteModal: $('#deleteModal'),
    deleteModalClose: $('#deleteModalClose'),
    deleteTaskTitle: $('#deleteTaskTitle'),
    cancelDeleteBtn: $('#cancelDeleteBtn'),
    confirmDeleteBtn: $('#confirmDeleteBtn'),

    // Backup
    exportBtn: $('#exportBtn'),
    importBtn: $('#importBtn'),
    importFile: $('#importFile'),

    // Mandal-Art
    mandalartView: $('#mandalartView'),
    mandalartGrid: $('#mandalartGrid'),
    mandalartModal: $('#mandalartModal'),
    mandalartForm: $('#mandalartForm'),
    mandalartModalClose: $('#mandalartModalClose'),
    mandalartCancelBtn: $('#mandalartCancelBtn'),
    mandalartCellIndex: $('#mandalartCellIndex'),
    mandalartCellType: $('#mandalartCellType'),
    mandalartContent: $('#mandalartContent'),
    mandalartModalTitle: $('#mandalartModalTitle'),
    resetMandalart: $('#resetMandalart'),
    generateTasks: $('#generateTasks'),

    // Task Reminder
    taskReminderDate: $('#taskReminderDate'),
    taskReminderTime: $('#taskReminderTime'),

    // Books
    booksView: $('#booksView'),
    booksGrid: $('#booksGrid'),
    totalBooks: $('#totalBooks'),
    readingBooks: $('#readingBooks'),
    addBookBtn: $('#addBookBtn'),
    bookModal: $('#bookModal'),
    bookForm: $('#bookForm'),
    bookModalTitle: $('#bookModalTitle'),
    bookModalClose: $('#bookModalClose'),
    bookCancelBtn: $('#bookCancelBtn'),
    bookId: $('#bookId'),
    bookTitle: $('#bookTitle'),
    bookAuthor: $('#bookAuthor'),
    bookStatus: $('#bookStatus'),
    bookRating: $('#bookRating'),
    bookNotes: $('#bookNotes'),
    bookCoverData: $('#bookCoverData'),
    coverPreview: $('#coverPreview'),
    clearCover: $('#clearCover'),
    starRating: $('#starRating'),

    // Auth
    authSection: $('#authSection'),
    userSection: $('#userSection'),
    loginBtn: $('#loginBtn'),
    logoutBtn: $('#logoutBtn'),
    syncBtn: $('#syncBtn'),
    userEmail: $('#userEmail'),
    authModal: $('#authModal'),
    authForm: $('#authForm'),
    authModalTitle: $('#authModalTitle'),
    authModalClose: $('#authModalClose'),
    authEmail: $('#authEmail'),
    authPassword: $('#authPassword'),
    authError: $('#authError'),
    authSubmitBtn: $('#authSubmitBtn'),
    authSwitchText: $('#authSwitchText'),
    authSwitchBtn: $('#authSwitchBtn')
};

// ============================================
// 상태 관리
// ============================================
let tasks = [];
let currentView = 'kanban';
let deleteTaskId = null;
let draggedTask = null;
let selectedTaskId = null;
let copiedTask = null;
let searchQuery = '';
let filterPriority = 'all';
let filterDue = 'all';

// Calendar state
let calendarDate = new Date();
let selectedDate = null;

// Mandal-Art state
let mandalartData = createEmptyMandalart();

// Books state
let books = [];
let bookFilter = 'all';
let notifiedReminders = [];
let completedDates = [];

// ============================================
// 유틸리티 함수
// ============================================
const Storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }
};

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((taskDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: '기한 초과', overdue: true };
    if (diffDays === 0) return { text: '오늘', overdue: false };
    if (diffDays === 1) return { text: '내일', overdue: false };
    return { text: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }), overdue: false };
}

function showToast(message, type = 'info') {
    const existing = $('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function highlightText(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<span class="highlight">$1</span>');
}

function createEmptyMandalart() {
    // 9x9 grid = 81 cells
    // Center (index 40) = main goal
    // 8 surrounding centers = sub-goals
    return Array(81).fill('');
}

function createDefaultMandalart() {
    const data = Array(81).fill('');
    // 핵심 목표
    data[40] = '이직하기';

    // 중앙 블록 - 8개 하위 목표
    data[30] = '연봉 30% 이상';
    data[31] = '업무향상';
    data[32] = '일정관리';
    data[39] = '이력서';
    data[41] = '포트폴리오';
    data[48] = '의사소통 구조화';
    data[49] = '면접';
    data[50] = '책읽기';

    // 서브골 센터에 동일 목표 복사
    data[10] = '연봉 30% 이상';
    data[13] = '업무향상';
    data[16] = '일정관리';
    data[37] = '이력서';
    data[43] = '포트폴리오';
    data[64] = '의사소통 구조화';
    data[67] = '면접';
    data[70] = '책읽기';

    // 연봉협상 블록 (좌상단, 서브골 10)
    data[0] = '연봉협상';
    data[9] = '회고잘쓰기';
    data[18] = '이직처 연협 성공히';
    data[19] = '시장가 및 평균 연봉 파악하기';
    data[20] = 'AI 경쟁력 만들기';
    data[21] = '업무 사용툴 20개 익히기';

    return data;
}

function getMandalartCellType(index) {
    // Main goal center
    if (index === 40) return 'main';

    // Sub-goal centers (centers of each 3x3 block)
    const subGoalCenters = [10, 13, 16, 37, 43, 64, 67, 70];
    if (subGoalCenters.includes(index)) return 'subgoal';

    // Central block cells (surrounding main goal)
    const centralBlock = [30, 31, 32, 39, 41, 48, 49, 50];
    if (centralBlock.includes(index)) return 'central';

    return 'action';
}

// Export/Import functions
function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        tasks: tasks,
        mandalart: mandalartData
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `taskmaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('데이터가 내보내기 되었습니다', 'success');
}

function importData(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            if (!data.tasks || !Array.isArray(data.tasks)) {
                throw new Error('유효하지 않은 백업 파일입니다');
            }

            // Confirm before importing
            const taskCount = data.tasks.length;
            if (!confirm(`${taskCount}개의 태스크를 가져오시겠습니까?\n현재 데이터가 대체됩니다.`)) {
                return;
            }

            tasks = data.tasks;
            saveTasks();

            if (data.mandalart && Array.isArray(data.mandalart)) {
                mandalartData = data.mandalart;
                saveMandalart();
            }

            render();
            showToast(`${taskCount}개 태스크를 가져왔습니다`, 'success');
        } catch (error) {
            showToast('파일을 읽을 수 없습니다: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
}

function loadMandalart() {
    const saved = Storage.get(CONFIG.mandalartKey);
    if (saved && saved.some(cell => cell !== '')) {
        mandalartData = saved;
    } else {
        mandalartData = createDefaultMandalart();
        saveMandalart();
    }
}

function saveMandalart() {
    Storage.set(CONFIG.mandalartKey, mandalartData);
    syncAfterChange();
}

// Books functions
function loadBooks() {
    books = Storage.get(CONFIG.booksKey) || [];
}

function saveBooks() {
    Storage.set(CONFIG.booksKey, books);
    syncAfterChange();
}

// Notification/Reminder functions
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showToast('이 브라우저는 알림을 지원하지 않습니다', 'error');
        return;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('알림이 활성화되었습니다', 'success');
            }
        });
    }
}

function sendNotification(title, body, taskId) {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
        body: body,
        icon: '📋',
        tag: taskId,
        requireInteraction: true
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };
}

function checkReminders() {
    const now = new Date();
    const notified = Storage.get(CONFIG.notifiedKey) || [];

    tasks.forEach(task => {
        if (!task.reminderDate || !task.reminderTime || task.completed) return;

        const reminderId = `${task.id}-${task.reminderDate}-${task.reminderTime}`;
        if (notified.includes(reminderId)) return;

        const reminderDateTime = new Date(`${task.reminderDate}T${task.reminderTime}`);

        if (now >= reminderDateTime) {
            sendNotification(
                '📋 태스크 알림',
                task.title,
                task.id
            );

            notified.push(reminderId);
            Storage.set(CONFIG.notifiedKey, notified);
            showToast(`🔔 ${task.title}`, 'info');
        }
    });
}

function startReminderChecker() {
    // 권한 요청
    requestNotificationPermission();

    // 1분마다 알림 체크
    setInterval(checkReminders, 60000);

    // 초기 체크
    checkReminders();
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
}

function isToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
}

function isThisWeek(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekLater = new Date(today);
    weekLater.setDate(weekLater.getDate() + 7);
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= today && taskDate <= weekLater;
}

function filterTasks(taskList) {
    return taskList.filter(task => {
        // 검색 필터
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchTitle = task.title.toLowerCase().includes(query);
            const matchDesc = task.description && task.description.toLowerCase().includes(query);
            if (!matchTitle && !matchDesc) return false;
        }

        // 우선순위 필터
        if (filterPriority !== 'all' && task.priority !== filterPriority) {
            return false;
        }

        // 마감일 필터
        if (filterDue !== 'all') {
            if (filterDue === 'overdue' && !isOverdue(task.dueDate)) return false;
            if (filterDue === 'today' && !isToday(task.dueDate)) return false;
            if (filterDue === 'week' && !isThisWeek(task.dueDate)) return false;
            if (filterDue === 'nodue' && task.dueDate) return false;
        }

        return true;
    });
}

// ============================================
// 테마 관리
// ============================================
function initTheme() {
    const savedTheme = Storage.get(CONFIG.themeKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set(CONFIG.themeKey, theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// ============================================
// 뷰 전환
// ============================================
function switchView(view) {
    currentView = view;

    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    elements.views.forEach(v => {
        v.classList.toggle('active', v.id === `${view}View`);
    });

    deselectTask();
    render();
}

// ============================================
// 태스크 CRUD
// ============================================
function loadTasks() {
    tasks = Storage.get(CONFIG.storageKey) || [];
}

function saveTasks() {
    Storage.set(CONFIG.storageKey, tasks);
    syncAfterChange();
}

function addTask(taskData) {
    const newTask = {
        id: generateId(),
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        status: taskData.status || 'todo',
        quadrant: taskData.quadrant || 'q1',
        completed: false,
        createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    render();
}

function updateTask(id, updates) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates };
        saveTasks();
        render();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            task.status = 'done';
        }
        saveTasks();
        render();
    }
}

function moveTask(taskId, target, type) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        if (type === 'status') {
            task.status = target;
            if (target === 'done') {
                task.completed = true;
            } else if (task.completed && target !== 'done') {
                task.completed = false;
            }
        } else if (type === 'quadrant') {
            task.quadrant = target;
        }
        saveTasks();
        render();
    }
}

// ============================================
// 선택 및 복사/붙여넣기
// ============================================
function selectTask(taskId) {
    selectedTaskId = taskId;
    $$('.task-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.id === taskId);
    });
}

function deselectTask() {
    selectedTaskId = null;
    $$('.task-card').forEach(card => card.classList.remove('selected'));
}

function copyTask() {
    if (!selectedTaskId) {
        showToast('복사할 태스크를 선택해주세요', 'error');
        return;
    }

    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
        copiedTask = { ...task };
        showToast(`"${task.title}" 복사됨`, 'success');
    }
}

function pasteTask() {
    if (!copiedTask) {
        showToast('붙여넣기할 태스크가 없습니다', 'error');
        return;
    }

    const newTask = {
        ...copiedTask,
        id: generateId(),
        title: copiedTask.title + ' (복사본)',
        completed: false,
        createdAt: Date.now()
    };

    if (currentView === 'kanban') {
        newTask.status = 'todo';
    }

    tasks.unshift(newTask);
    saveTasks();
    render();
    showToast(`"${newTask.title}" 붙여넣기 완료`, 'success');
}

// ============================================
// 렌더링
// ============================================
function render() {
    if (currentView === 'kanban') {
        renderKanban();
    } else if (currentView === 'matrix') {
        renderMatrix();
    } else if (currentView === 'calendar') {
        renderCalendar();
    } else if (currentView === 'mandalart') {
        renderMandalart();
    } else if (currentView === 'books') {
        renderBooks();
    } else if (currentView === 'completed') {
        renderCompleted();
    } else if (currentView === 'report') {
        renderReport();
    }
    updateStats();
}

function renderKanban() {
    const todoTasks = filterTasks(tasks.filter(t => t.status === 'todo'));
    const inprogressTasks = filterTasks(tasks.filter(t => t.status === 'inprogress'));
    const doneTasks = filterTasks(tasks.filter(t => t.status === 'done'));

    elements.todoList.innerHTML = renderTaskCards(todoTasks, 'status', 'todo');
    elements.inprogressList.innerHTML = renderTaskCards(inprogressTasks, 'status', 'inprogress');
    elements.doneList.innerHTML = renderTaskCards(doneTasks, 'status', 'done');

    elements.todoCount.textContent = todoTasks.length;
    elements.inprogressCount.textContent = inprogressTasks.length;
    elements.doneCount.textContent = doneTasks.length;

    initDragAndDrop();
}

function renderMatrix() {
    const q1Tasks = filterTasks(tasks.filter(t => t.quadrant === 'q1' && !t.completed));
    const q2Tasks = filterTasks(tasks.filter(t => t.quadrant === 'q2' && !t.completed));
    const q3Tasks = filterTasks(tasks.filter(t => t.quadrant === 'q3' && !t.completed));
    const q4Tasks = filterTasks(tasks.filter(t => t.quadrant === 'q4' && !t.completed));

    elements.q1List.innerHTML = renderTaskCards(q1Tasks, 'quadrant', 'q1');
    elements.q2List.innerHTML = renderTaskCards(q2Tasks, 'quadrant', 'q2');
    elements.q3List.innerHTML = renderTaskCards(q3Tasks, 'quadrant', 'q3');
    elements.q4List.innerHTML = renderTaskCards(q4Tasks, 'quadrant', 'q4');

    initDragAndDrop();
}

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    // 현재 월 표시
    elements.currentMonth.textContent = `${year}년 ${month + 1}월`;

    // 달력 그리드 생성
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0 = 일요일
    const totalDays = lastDay.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';

    // 이전 달의 빈 칸
    const prevMonthLast = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonthLast - i;
        const dateStr = formatDateStr(year, month - 1, day);
        html += `
            <div class="calendar-day other-month" data-date="${dateStr}">
                <div class="day-number">${day}</div>
            </div>
        `;
    }

    // 현재 달의 날짜
    for (let day = 1; day <= totalDays; day++) {
        const currentDate = new Date(year, month, day);
        currentDate.setHours(0, 0, 0, 0);
        const dateStr = formatDateStr(year, month, day);
        const isToday = currentDate.getTime() === today.getTime();
        const isSelected = selectedDate === dateStr;

        // 해당 날짜의 태스크 (생성일자 기준)
        const dayTasks = tasks.filter(t => {
            if (!t.createdAt) return false;
            const created = new Date(t.createdAt);
            const createdDateStr = formatDateStr(created.getFullYear(), created.getMonth(), created.getDate());
            return createdDateStr === dateStr;
        });
        const hasTasks = dayTasks.length > 0;

        let tasksHtml = '';
        if (dayTasks.length > 0) {
            const displayTasks = dayTasks.slice(0, 3);
            tasksHtml = displayTasks.map(t => `
                <div class="day-task ${t.priority} ${t.completed ? 'completed' : ''}" data-id="${t.id}">
                    ${escapeHtml(t.title)}
                </div>
            `).join('');

            if (dayTasks.length > 3) {
                tasksHtml += `<div class="day-more">+${dayTasks.length - 3} 더보기</div>`;
            }
        }

        // 툴팁용 전체 태스크 목록
        const tooltipTasks = dayTasks.map(t => `• ${t.title}`).join('\n');

        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTasks ? 'has-tasks' : ''}"
                 data-date="${dateStr}"
                 ${hasTasks ? `title="${dayTasks.length}개 태스크:\n${tooltipTasks}"` : ''}>
                <div class="day-number">${day}</div>
                <div class="day-tasks">${tasksHtml}</div>
            </div>
        `;
    }

    // 다음 달의 빈 칸
    const remainingDays = 42 - (startDay + totalDays); // 6주 그리드
    for (let i = 1; i <= remainingDays; i++) {
        const dateStr = formatDateStr(year, month + 1, i);
        html += `
            <div class="calendar-day other-month" data-date="${dateStr}">
                <div class="day-number">${i}</div>
            </div>
        `;
    }

    elements.calendarDays.innerHTML = html;

    // 선택된 날짜의 상세 정보 표시
    if (selectedDate) {
        renderDayDetail(selectedDate);
    }
}

function formatDateStr(year, month, day) {
    // month가 범위를 벗어나면 조정
    const date = new Date(year, month, day);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function renderMandalart() {
    let html = '';

    // 만다라트 내용과 태스크 매칭하여 진행률 계산
    const progressMap = calculateMandalartProgress();

    for (let i = 0; i < 81; i++) {
        const cellType = getMandalartCellType(i);
        const content = mandalartData[i] || '';
        const isEmpty = !content;

        // Determine which 3x3 block this cell belongs to
        const blockRow = Math.floor(Math.floor(i / 9) / 3);
        const blockCol = Math.floor((i % 9) / 3);
        const blockIndex = blockRow * 3 + blockCol;

        // 진행률 기반 스타일
        const progress = progressMap[i] || 0;
        let progressClass = '';
        if (content && cellType === 'action') {
            if (progress >= 100) progressClass = 'progress-complete';
            else if (progress > 0) progressClass = 'progress-partial';
        }

        html += `
            <div class="mandalart-cell ${cellType} ${isEmpty ? 'empty' : ''} ${progressClass}"
                 data-index="${i}"
                 data-block="${blockIndex}"
                 data-type="${cellType}"
                 ${progress > 0 ? `title="진행률: ${progress}%"` : ''}>
                <span class="cell-content">${escapeHtml(content)}</span>
                ${isEmpty ? '<span class="cell-placeholder">+</span>' : ''}
                ${progressClass === 'progress-complete' ? '<span class="cell-check">✓</span>' : ''}
            </div>
        `;
    }

    elements.mandalartGrid.innerHTML = html;
}

function calculateMandalartProgress() {
    const progressMap = {};

    // 각 만다라트 셀에 대해 동일한 제목의 태스크가 있는지 확인
    for (let i = 0; i < 81; i++) {
        const content = mandalartData[i];
        if (!content) continue;

        // 태스크에서 동일한 제목 찾기
        const matchingTasks = tasks.filter(t =>
            t.title.toLowerCase() === content.toLowerCase()
        );

        if (matchingTasks.length > 0) {
            const completedCount = matchingTasks.filter(t => t.completed).length;
            progressMap[i] = Math.round((completedCount / matchingTasks.length) * 100);
        }
    }

    return progressMap;
}

function openMandalartModal(index, type) {
    const content = mandalartData[index] || '';
    let title = '';

    switch (type) {
        case 'main':
            title = '핵심 목표 설정';
            break;
        case 'subgoal':
            title = '세부 목표 설정';
            break;
        case 'central':
            title = '세부 목표 설정';
            break;
        case 'action':
            title = '실행 항목 설정';
            break;
    }

    elements.mandalartModalTitle.textContent = title;
    elements.mandalartCellIndex.value = index;
    elements.mandalartCellType.value = type;
    elements.mandalartContent.value = content;
    elements.mandalartModal.classList.add('active');
    elements.mandalartContent.focus();
}

function closeMandalartModal() {
    elements.mandalartModal.classList.remove('active');
}

function deleteMandalartCell() {
    const index = parseInt(elements.mandalartCellIndex.value);
    const type = elements.mandalartCellType.value;

    mandalartData[index] = '';

    // If this is a sub-goal (in central block), also clear corresponding outer block center
    if (type === 'central') {
        const centralBlock = [30, 31, 32, 39, 41, 48, 49, 50];
        const subGoalCenters = [10, 13, 16, 37, 43, 64, 67, 70];
        const centralIndex = centralBlock.indexOf(index);
        if (centralIndex !== -1) {
            mandalartData[subGoalCenters[centralIndex]] = '';
        }
    }

    // If this is a sub-goal center, also clear central block
    const subGoalCenters = [10, 13, 16, 37, 43, 64, 67, 70];
    const centralBlock = [30, 31, 32, 39, 41, 48, 49, 50];
    const subGoalIndex = subGoalCenters.indexOf(index);
    if (subGoalIndex !== -1) {
        mandalartData[centralBlock[subGoalIndex]] = '';
    }

    saveMandalart();
    closeMandalartModal();
    render();
    showToast('삭제되었습니다', 'info');
}

function saveMandalartCell() {
    const index = parseInt(elements.mandalartCellIndex.value);
    const content = elements.mandalartContent.value.trim();
    const type = elements.mandalartCellType.value;

    mandalartData[index] = content;

    // If this is a sub-goal (in central block), copy to corresponding outer block center
    if (type === 'central') {
        const centralBlock = [30, 31, 32, 39, 41, 48, 49, 50];
        const subGoalCenters = [10, 13, 16, 37, 43, 64, 67, 70];
        const centralIndex = centralBlock.indexOf(index);
        if (centralIndex !== -1) {
            mandalartData[subGoalCenters[centralIndex]] = content;
        }
    }

    // If this is a sub-goal center, also update central block
    const subGoalCenters = [10, 13, 16, 37, 43, 64, 67, 70];
    const centralBlock = [30, 31, 32, 39, 41, 48, 49, 50];
    const subGoalIndex = subGoalCenters.indexOf(index);
    if (subGoalIndex !== -1) {
        mandalartData[centralBlock[subGoalIndex]] = content;
    }

    saveMandalart();
    closeMandalartModal();
    render();
    showToast('저장되었습니다', 'success');
}

function resetMandalartData() {
    if (!confirm('만다라트를 초기화하시겠습니까?\n모든 내용이 삭제됩니다.')) return;

    mandalartData = createEmptyMandalart();
    saveMandalart();
    render();
    showToast('만다라트가 초기화되었습니다', 'success');
}

// ============================================
// Books Rendering
// ============================================
function renderBooks() {
    const statusLabels = {
        reading: '읽는중',
        completed: '완독',
        wishlist: '위시'
    };

    // 필터링
    let filteredBooks = books;
    if (bookFilter !== 'all') {
        filteredBooks = books.filter(b => b.status === bookFilter);
    }

    // 통계 업데이트
    elements.totalBooks.textContent = books.filter(b => b.status === 'completed').length;
    elements.readingBooks.textContent = books.filter(b => b.status === 'reading').length;

    if (filteredBooks.length === 0) {
        elements.booksGrid.innerHTML = `
            <div class="books-empty">
                <div class="books-empty-icon">📚</div>
                <p>책장이 비어있습니다</p>
                <button class="btn btn-primary btn-sm" onclick="openBookModal()">+ 첫 번째 책 추가</button>
            </div>
        `;
        return;
    }

    elements.booksGrid.innerHTML = filteredBooks.map(book => {
        const ratingStars = book.rating > 0 ? '★'.repeat(book.rating) : '';
        const coverHtml = book.cover
            ? `<img class="book-cover" src="${book.cover}" alt="${escapeHtml(book.title)}">`
            : `<div class="book-cover-placeholder">📖</div>`;

        return `
            <div class="book-card ${book.status}" data-id="${book.id}">
                <div class="book-status-ribbon">${statusLabels[book.status]}</div>
                ${coverHtml}
                <div class="book-info">
                    <div class="book-title">${escapeHtml(book.title)}</div>
                    ${book.author ? `<div class="book-author">${escapeHtml(book.author)}</div>` : ''}
                    ${ratingStars ? `<div class="book-rating">${ratingStars}</div>` : ''}
                </div>
                <div class="book-actions">
                    <button class="task-action-btn edit" title="수정">✏️</button>
                    <button class="task-action-btn delete" title="삭제">🗑️</button>
                </div>
                ${book.notes ? `
                    <div class="book-tooltip">
                        <div class="tooltip-notes">${escapeHtml(book.notes)}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function openBookModal(book = null) {
    if (book) {
        elements.bookModalTitle.textContent = '책 수정';
        elements.bookId.value = book.id;
        elements.bookTitle.value = book.title;
        elements.bookAuthor.value = book.author || '';
        elements.bookStatus.value = book.status;
        elements.bookNotes.value = book.notes || '';

        // 표지 이미지
        if (book.cover) {
            elements.coverPreview.innerHTML = `<img src="${book.cover}" alt="표지">`;
            elements.coverPreview.classList.add('has-image');
            elements.bookCoverData.value = book.cover;
        } else {
            resetCoverPreview();
        }

        // 별점
        setStarRating(book.rating || 0);
    } else {
        elements.bookModalTitle.textContent = '새 책 추가';
        elements.bookId.value = '';
        elements.bookForm.reset();
        resetCoverPreview();
        setStarRating(0);
    }

    elements.bookModal.classList.add('active');
    elements.bookTitle.focus();
}

function resetCoverPreview() {
    elements.coverPreview.innerHTML = `<span class="cover-placeholder">📚<br>이미지를 붙여넣기<br>(Ctrl+V)</span>`;
    elements.coverPreview.classList.remove('has-image');
    elements.bookCoverData.value = '';
}

function setStarRating(rating) {
    elements.bookRating.value = rating;
    const stars = elements.starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
}

function handleImagePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            const reader = new FileReader();

            reader.onload = (event) => {
                const dataUrl = event.target.result;
                elements.coverPreview.innerHTML = `<img src="${dataUrl}" alt="표지">`;
                elements.coverPreview.classList.add('has-image');
                elements.bookCoverData.value = dataUrl;
            };

            reader.readAsDataURL(file);
            break;
        }
    }
}

function closeBookModal() {
    elements.bookModal.classList.remove('active');
}

function saveBook(bookData) {
    const id = elements.bookId.value;

    if (id) {
        // 수정
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books[index] = { ...books[index], ...bookData };
        }
    } else {
        // 신규
        const newBook = {
            id: generateId(),
            ...bookData,
            createdAt: Date.now()
        };
        books.unshift(newBook);
    }

    saveBooks();
    closeBookModal();
    render();
    showToast('책이 저장되었습니다', 'success');
}

function deleteBook(id) {
    if (!confirm('이 책을 삭제하시겠습니까?')) return;

    books = books.filter(b => b.id !== id);
    saveBooks();
    render();
    showToast('책이 삭제되었습니다', 'success');
}

function generateTasksFromMandalart() {
    // 만다라트에서 실행 항목(action)만 추출하여 태스크 생성
    const mainGoal = mandalartData[40]; // 핵심 목표
    const subGoalCenters = [10, 13, 16, 37, 43, 64, 67, 70];
    const centralBlock = [30, 31, 32, 39, 41, 48, 49, 50];

    // 블록별 실행 항목 매핑
    const blockActions = {
        0: [0, 1, 2, 9, 11, 18, 19, 20],      // 블록 0 (세부목표: index 10)
        1: [3, 4, 5, 12, 14, 21, 22, 23],     // 블록 1 (세부목표: index 13)
        2: [6, 7, 8, 15, 17, 24, 25, 26],     // 블록 2 (세부목표: index 16)
        3: [27, 28, 29, 36, 38, 45, 46, 47],  // 블록 3 (세부목표: index 37)
        5: [33, 34, 35, 42, 44, 51, 52, 53],  // 블록 5 (세부목표: index 43)
        6: [54, 55, 56, 63, 65, 72, 73, 74],  // 블록 6 (세부목표: index 64)
        7: [57, 58, 59, 66, 68, 75, 76, 77],  // 블록 7 (세부목표: index 67)
        8: [60, 61, 62, 69, 71, 78, 79, 80]   // 블록 8 (세부목표: index 70)
    };

    const blockToSubGoal = {
        0: 10, 1: 13, 2: 16,
        3: 37, 5: 43,
        6: 64, 7: 67, 8: 70
    };

    // 우선순위 매핑 (Q1~Q4 순서)
    const priorityMap = {
        0: 'high', 1: 'high', 2: 'medium',
        3: 'medium', 5: 'medium',
        6: 'low', 7: 'low', 8: 'low'
    };

    let createdCount = 0;
    const existingTitles = tasks.map(t => t.title.toLowerCase());

    // 각 블록의 실행 항목들을 태스크로 변환
    Object.entries(blockActions).forEach(([blockIdx, actionIndices]) => {
        const subGoalIndex = blockToSubGoal[blockIdx];
        const subGoal = mandalartData[subGoalIndex];

        if (!subGoal) return; // 세부 목표가 없으면 스킵

        actionIndices.forEach(actionIndex => {
            const actionContent = mandalartData[actionIndex];
            if (!actionContent) return; // 내용이 없으면 스킵

            // 이미 같은 제목의 태스크가 있으면 스킵
            if (existingTitles.includes(actionContent.toLowerCase())) return;

            const newTask = {
                id: generateId(),
                title: actionContent,
                description: `[${mainGoal || '핵심 목표'}] > ${subGoal}`,
                priority: priorityMap[blockIdx] || 'medium',
                dueDate: null,
                status: 'todo',
                quadrant: blockIdx <= 2 ? 'q1' : blockIdx <= 5 ? 'q2' : 'q3',
                completed: false,
                createdAt: Date.now(),
                epic: mainGoal || '',
                story: subGoal || ''
            };

            tasks.unshift(newTask);
            existingTitles.push(actionContent.toLowerCase());
            createdCount++;
        });
    });

    if (createdCount === 0) {
        showToast('생성할 태스크가 없습니다. 만다라트에 실행 항목을 채워주세요.', 'info');
        return;
    }

    saveTasks();
    showToast(`${createdCount}개의 태스크가 생성되었습니다!`, 'success');

    // 칸반 뷰로 전환
    switchView('kanban');
}

function renderDayDetail(dateStr) {
    // 생성일자 기준으로 필터링
    const dayTasks = tasks.filter(t => {
        if (!t.createdAt) return false;
        const created = new Date(t.createdAt);
        const createdDateStr = formatDateStr(created.getFullYear(), created.getMonth(), created.getDate());
        return createdDateStr === dateStr;
    });
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    elements.dayDetailTitle.textContent = dateFormatted;
    elements.dayDetail.style.display = 'block';

    if (dayTasks.length === 0) {
        elements.dayDetailTasks.innerHTML = `
            <div class="day-detail-empty">
                <span>📭</span> 이 날짜에 생성된 태스크가 없습니다
            </div>
        `;
        return;
    }

    elements.dayDetailTasks.innerHTML = dayTasks.map(task => `
        <div class="day-detail-task" data-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" role="checkbox" aria-checked="${task.completed}"></div>
            <span class="task-priority ${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
            <span class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</span>
            <div class="task-actions" style="position: static; opacity: 1;">
                <button class="task-action-btn edit" title="수정">✏️</button>
                <button class="task-action-btn delete" title="삭제">🗑️</button>
            </div>
        </div>
    `).join('');
}

function renderCompleted() {
    const completedTasks = filterTasks(tasks.filter(t => t.completed));

    if (completedTasks.length === 0) {
        elements.completedList.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🎉</div>
                <p>완료된 태스크가 없습니다</p>
            </div>
        `;
        return;
    }

    elements.completedList.innerHTML = completedTasks.map(task => {
        const completedDate = new Date(task.createdAt).toLocaleDateString('ko-KR');
        return `
            <div class="completed-task" data-id="${task.id}">
                <div class="task-checkbox" role="checkbox" aria-checked="true"></div>
                <div class="task-info">
                    <div class="task-title">${highlightText(task.title, searchQuery)}</div>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
                        <span>완료됨</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn restore" title="복원">↩️</button>
                    <button class="task-action-btn delete" title="삭제">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderReport() {
    // 이번 주 날짜 범위 계산
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDateKR = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
    elements.reportWeek.textContent = `${formatDateKR(monday)} ~ ${formatDateKR(sunday)}`;

    // 이번 주 완료 태스크 필터링
    const weekStart = new Date(monday);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(sunday);
    weekEnd.setHours(23, 59, 59, 999);

    const weeklyTasks = tasks.filter(t => {
        if (!t.completed) return false;
        const completedDate = new Date(t.createdAt);
        return completedDate >= weekStart && completedDate <= weekEnd;
    });

    // 요약 통계
    const totalWeekly = tasks.filter(t => {
        const created = new Date(t.createdAt);
        return created >= weekStart && created <= weekEnd;
    }).length;

    const completedCount = weeklyTasks.length;
    const rate = totalWeekly > 0 ? Math.round((completedCount / totalWeekly) * 100) : 0;

    elements.weeklyCompleted.textContent = completedCount;
    elements.weeklyRate.textContent = `${rate}%`;

    // 기한 준수율 계산
    const tasksWithDue = weeklyTasks.filter(t => t.dueDate);
    const onTime = tasksWithDue.filter(t => {
        const due = new Date(t.dueDate);
        const completed = new Date(t.createdAt);
        return completed <= due;
    }).length;
    const onTimePercent = tasksWithDue.length > 0 ? Math.round((onTime / tasksWithDue.length) * 100) : 100;
    elements.onTimeRate.textContent = `${onTimePercent}%`;

    // 연속 달성일 계산
    let streak = 0;
    const checkDate = new Date(today);
    while (true) {
        const dayStart = new Date(checkDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const dayCompleted = tasks.filter(t => {
            if (!t.completed) return false;
            const completed = new Date(t.createdAt);
            return completed >= dayStart && completed <= dayEnd;
        }).length;

        if (dayCompleted > 0) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    elements.streakDays.textContent = `${streak}일`;

    // 요일별 차트
    renderDailyChart(monday, weeklyTasks);

    // 우선순위별 차트
    renderPriorityChart(weeklyTasks);

    // 성과 배지
    renderAchievements(completedCount, streak, onTimePercent);

    // 주의 필요 태스크
    renderPendingTasks();
}

function renderDailyChart(monday, weeklyTasks) {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const today = new Date();
    const todayDay = today.getDay();
    const todayIndex = todayDay === 0 ? 6 : todayDay - 1;

    const dailyCounts = days.map((_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return weeklyTasks.filter(t => {
            const completed = new Date(t.createdAt);
            return completed >= dayStart && completed <= dayEnd;
        }).length;
    });

    const maxCount = Math.max(...dailyCounts, 1);

    elements.dailyChart.innerHTML = days.map((day, index) => {
        const count = dailyCounts[index];
        const height = (count / maxCount) * 100;
        const isToday = index === todayIndex;

        return `
            <div class="daily-bar">
                <div class="bar-count">${count}</div>
                <div class="bar-fill ${isToday ? 'today' : ''}" style="height: ${Math.max(height, 5)}%"></div>
                <div class="bar-label ${isToday ? 'today' : ''}">${day}</div>
            </div>
        `;
    }).join('');
}

function renderPriorityChart(weeklyTasks) {
    const priorities = [
        { key: 'high', label: '높음', color: 'high' },
        { key: 'medium', label: '보통', color: 'medium' },
        { key: 'low', label: '낮음', color: 'low' }
    ];

    const total = weeklyTasks.length || 1;

    elements.priorityChart.innerHTML = priorities.map(p => {
        const count = weeklyTasks.filter(t => t.priority === p.key).length;
        const percent = Math.round((count / total) * 100);

        return `
            <div class="priority-bar">
                <div class="priority-label">${p.label}</div>
                <div class="priority-track">
                    <div class="priority-fill ${p.color}" style="width: ${percent}%">
                        ${percent > 10 ? `${percent}%` : ''}
                    </div>
                </div>
                <div class="priority-count">${count}</div>
            </div>
        `;
    }).join('');
}

function renderAchievements(completedCount, streak, onTimePercent) {
    const achievements = [
        { icon: '🎯', text: '첫 태스크 완료', unlocked: completedCount >= 1 },
        { icon: '⚡', text: '5개 완료', unlocked: completedCount >= 5 },
        { icon: '🚀', text: '10개 완료', unlocked: completedCount >= 10 },
        { icon: '🔥', text: '3일 연속', unlocked: streak >= 3 },
        { icon: '💪', text: '7일 연속', unlocked: streak >= 7 },
        { icon: '⏰', text: '기한 마스터', unlocked: onTimePercent === 100 && completedCount >= 3 },
    ];

    elements.achievementsList.innerHTML = achievements.map(a => `
        <div class="achievement-badge ${a.unlocked ? '' : 'locked'}">
            <span>${a.icon}</span>
            <span>${a.text}</span>
        </div>
    `).join('');
}

function renderPendingTasks() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingTasks = tasks.filter(t => {
        if (t.completed) return false;
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        const daysUntil = Math.floor((due - today) / (1000 * 60 * 60 * 24));
        return daysUntil <= 3; // 3일 이내 또는 초과
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    if (pendingTasks.length === 0) {
        elements.pendingList.innerHTML = `
            <div class="no-pending">
                <span>🎉</span> 긴급한 태스크가 없습니다!
            </div>
        `;
        return;
    }

    elements.pendingList.innerHTML = pendingTasks.slice(0, 5).map(task => {
        const dueInfo = formatDate(task.dueDate);
        const isOverdue = dueInfo.overdue;

        return `
            <div class="pending-item ${isOverdue ? '' : 'warning'}">
                <span class="task-priority ${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
                <span class="task-title">${escapeHtml(task.title)}</span>
                <span class="task-due ${isOverdue ? 'overdue' : ''}">📅 ${dueInfo.text}</span>
            </div>
        `;
    }).join('');
}

function renderTaskCards(taskList, type, target = null) {
    if (taskList.length === 0) {
        const hasFilters = searchQuery || filterPriority !== 'all' || filterDue !== 'all';
        if (hasFilters) {
            return `
                <div class="empty-state">
                    <span class="empty-state-icon">🔍</span>
                    <span>검색 결과 없음</span>
                </div>
            `;
        }
        return `
            <div class="empty-state clickable" data-type="${type}" data-target="${target || ''}">
                <span class="empty-state-icon">➕</span>
                <span>태스크 없음</span>
                <span class="empty-state-add">클릭하여 추가하기</span>
            </div>
        `;
    }

    return taskList.map(task => {
        const dueInfo = formatDate(task.dueDate);
        const dueHtml = task.dueDate
            ? `<span class="task-due ${dueInfo.overdue ? 'overdue' : ''}">📅 ${dueInfo.text}</span>`
            : '';

        // 에픽/스토리 태그
        const epicHtml = task.epic ? `<span class="task-tag epic">🎯 ${escapeHtml(task.epic)}</span>` : '';
        const storyHtml = task.story ? `<span class="task-tag story">📌 ${escapeHtml(task.story)}</span>` : '';
        const tagsHtml = (epicHtml || storyHtml) ? `<div class="task-tags">${epicHtml}${storyHtml}</div>` : '';

        return `
            <div class="task-card ${task.completed ? 'completed' : ''} ${task.id === selectedTaskId ? 'selected' : ''}"
                 data-id="${task.id}"
                 data-type="${type}"
                 draggable="true">
                <div class="task-actions">
                    <button class="task-action-btn edit" title="수정">✏️</button>
                    <button class="task-action-btn delete" title="삭제">🗑️</button>
                </div>
                <div class="task-header">
                    <div class="task-checkbox" role="checkbox" aria-checked="${task.completed}"></div>
                    <div class="task-content">
                        <div class="task-title">${highlightText(task.title, searchQuery)}</div>
                        ${tagsHtml}
                        ${task.description ? `<div class="task-desc">${highlightText(task.description, searchQuery)}</div>` : ''}
                        <div class="task-meta">
                            <span class="task-priority ${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
                            ${dueHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    elements.totalTasks.textContent = total;
    elements.completedTasks.textContent = completed;
    elements.completionRate.textContent = `${rate}%`;
}

// ============================================
// 드래그 앤 드롭
// ============================================
function initDragAndDrop() {
    const taskCards = $$('.task-card');
    const taskLists = $$('.task-list');

    taskCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    taskLists.forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('dragleave', handleDragLeave);
        list.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    draggedTask = {
        id: e.target.dataset.id,
        type: e.target.dataset.type
    };
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedTask = null;
    $$('.task-list').forEach(list => list.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (!draggedTask) return;

    const target = e.currentTarget.dataset.status || e.currentTarget.dataset.quadrant;
    const type = e.currentTarget.dataset.status ? 'status' : 'quadrant';

    moveTask(draggedTask.id, target, type);
}

// ============================================
// 모달 관리
// ============================================
function openTaskModal(target, type, taskData = null) {
    elements.taskModal.classList.add('active');

    if (taskData) {
        elements.modalTitle.textContent = '태스크 수정';
        elements.taskId.value = taskData.id;
        elements.taskTitle.value = taskData.title;
        elements.taskDesc.value = taskData.description || '';
        elements.taskPriority.value = taskData.priority;
        elements.taskDueDate.value = taskData.dueDate || '';
        elements.taskReminderDate.value = taskData.reminderDate || '';
        elements.taskReminderTime.value = taskData.reminderTime || '09:00';
    } else {
        elements.modalTitle.textContent = '새 태스크';
        elements.taskId.value = '';
        elements.taskForm.reset();
        elements.taskReminderTime.value = '09:00';
    }

    elements.taskTarget.value = JSON.stringify({ target, type });
    elements.taskTitle.focus();
}

function closeTaskModal() {
    elements.taskModal.classList.remove('active');
    elements.taskForm.reset();
}

function openDeleteModal(taskId, taskTitle) {
    deleteTaskId = taskId;
    elements.deleteTaskTitle.textContent = taskTitle;
    elements.deleteModal.classList.add('active');
}

function closeDeleteModal() {
    deleteTaskId = null;
    elements.deleteModal.classList.remove('active');
}

// ============================================
// 이벤트 핸들러
// ============================================
function handleTabClick(e) {
    const btn = e.target.closest('.tab-btn');
    if (btn) {
        switchView(btn.dataset.view);
    }
}

function handleAddTaskClick(e) {
    const btn = e.target.closest('.add-task-btn') || e.target.closest('.add-task-btn-icon');
    if (btn) {
        const status = btn.dataset.status;
        const quadrant = btn.dataset.quadrant;
        const target = status || quadrant;
        const type = status ? 'status' : 'quadrant';
        openTaskModal(target, type);
    }
}

function handleTaskCardClick(e) {
    const card = e.target.closest('.task-card');
    if (!card) return;

    const taskId = card.dataset.id;
    const task = tasks.find(t => t.id === taskId);

    if (e.target.closest('.task-checkbox')) {
        toggleTaskComplete(taskId);
    } else if (e.target.closest('.task-action-btn.edit')) {
        const type = card.dataset.type;
        const target = type === 'status' ? task.status : task.quadrant;
        openTaskModal(target, type, task);
    } else if (e.target.closest('.task-action-btn.delete')) {
        openDeleteModal(taskId, task.title);
    } else if (e.target.closest('.task-title')) {
        // 제목 클릭 시 인라인 편집
        e.stopPropagation();
        startInlineEdit(card, task, 'title');
    } else if (e.target.closest('.task-desc')) {
        // 설명 클릭 시 인라인 편집
        e.stopPropagation();
        startInlineEdit(card, task, 'description');
    } else if (e.target.closest('.task-priority')) {
        // 우선순위 클릭 시 인라인 편집
        e.stopPropagation();
        startInlineEdit(card, task, 'priority');
    } else if (e.target.closest('.task-due')) {
        // 마감일 클릭 시 인라인 편집
        e.stopPropagation();
        startInlineEdit(card, task, 'dueDate');
    } else {
        // 태스크 선택
        selectTask(taskId);
    }
}

function startInlineEdit(card, task, field) {
    let targetEl, originalValue, inputEl;

    switch (field) {
        case 'title':
            targetEl = card.querySelector('.task-title');
            if (!targetEl || targetEl.querySelector('input')) return;
            originalValue = task.title;

            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.value = originalValue;
            inputEl.className = 'inline-edit-input';
            break;

        case 'description':
            targetEl = card.querySelector('.task-desc');
            if (!targetEl) {
                // 설명이 없으면 새로 추가
                const content = card.querySelector('.task-content');
                const meta = card.querySelector('.task-meta');
                targetEl = document.createElement('div');
                targetEl.className = 'task-desc';
                content.insertBefore(targetEl, meta);
            }
            if (targetEl.querySelector('textarea')) return;
            originalValue = task.description || '';

            inputEl = document.createElement('textarea');
            inputEl.value = originalValue;
            inputEl.className = 'inline-edit-input inline-edit-textarea';
            inputEl.placeholder = '설명 추가...';
            inputEl.rows = 2;
            break;

        case 'priority':
            targetEl = card.querySelector('.task-priority');
            if (!targetEl || targetEl.querySelector('select')) return;
            originalValue = task.priority;

            inputEl = document.createElement('select');
            inputEl.className = 'inline-edit-select';
            inputEl.innerHTML = `
                <option value="high" ${originalValue === 'high' ? 'selected' : ''}>🔴 높음</option>
                <option value="medium" ${originalValue === 'medium' ? 'selected' : ''}>🟡 보통</option>
                <option value="low" ${originalValue === 'low' ? 'selected' : ''}>🟢 낮음</option>
            `;
            break;

        case 'dueDate':
            targetEl = card.querySelector('.task-due');
            if (!targetEl) {
                // 마감일이 없으면 새로 추가
                const meta = card.querySelector('.task-meta');
                targetEl = document.createElement('span');
                targetEl.className = 'task-due';
                meta.appendChild(targetEl);
            }
            if (targetEl.querySelector('input')) return;
            originalValue = task.dueDate || '';

            inputEl = document.createElement('input');
            inputEl.type = 'date';
            inputEl.value = originalValue;
            inputEl.className = 'inline-edit-input inline-edit-date';
            break;

        default:
            return;
    }

    targetEl.innerHTML = '';
    targetEl.appendChild(inputEl);
    inputEl.focus();
    if (inputEl.select) inputEl.select();

    let saved = false;

    const saveEdit = () => {
        if (saved) return;
        saved = true;

        const newValue = inputEl.value.trim();
        const updates = {};

        if (field === 'title') {
            if (newValue && newValue !== originalValue) {
                updates.title = newValue;
            }
        } else if (field === 'description') {
            if (newValue !== originalValue) {
                updates.description = newValue;
            }
        } else if (field === 'priority') {
            if (newValue !== originalValue) {
                updates.priority = newValue;
            }
        } else if (field === 'dueDate') {
            if (newValue !== originalValue) {
                updates.dueDate = newValue || null;
            }
        }

        if (Object.keys(updates).length > 0) {
            updateTask(task.id, updates);
            showToast('수정됨', 'success');
        } else {
            render();
        }
    };

    inputEl.addEventListener('blur', saveEdit);
    inputEl.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && field !== 'description') {
            ev.preventDefault();
            inputEl.blur();
        } else if (ev.key === 'Escape') {
            saved = true;
            render();
        }
    });

    // select는 change 이벤트로 바로 저장
    if (field === 'priority') {
        inputEl.addEventListener('change', () => {
            inputEl.blur();
        });
    }
}

function handleDocumentClick(e) {
    // 태스크 카드 바깥 클릭 시 선택 해제
    if (!e.target.closest('.task-card') && !e.target.closest('.modal')) {
        deselectTask();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = elements.taskId.value;
    const targetData = JSON.parse(elements.taskTarget.value);
    const taskData = {
        title: elements.taskTitle.value.trim(),
        description: elements.taskDesc.value.trim(),
        priority: elements.taskPriority.value,
        dueDate: elements.taskDueDate.value || null,
        reminderDate: elements.taskReminderDate.value || null,
        reminderTime: elements.taskReminderTime.value || null
    };

    if (!taskData.title) return;

    if (id) {
        updateTask(id, taskData);
    } else {
        if (targetData.type === 'status') {
            taskData.status = targetData.target;
        } else {
            taskData.quadrant = targetData.target;
        }
        addTask(taskData);
    }

    closeTaskModal();
}

function handleConfirmDelete() {
    if (deleteTaskId) {
        deleteTask(deleteTaskId);
        closeDeleteModal();
    }
}

function handleSearch(e) {
    searchQuery = e.target.value.trim();
    elements.searchClear.classList.toggle('visible', searchQuery.length > 0);
    render();
}

function handleSearchClear() {
    searchQuery = '';
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('visible');
    elements.searchInput.focus();
    render();
}

function handlePriorityChipClick(e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    filterPriority = chip.dataset.priority;

    // 활성 상태 업데이트
    elements.priorityChips.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('active', c.dataset.priority === filterPriority);
    });

    render();
}

function handleFilterDue(e) {
    filterDue = e.target.value;
    render();
}

function handleEmptyStateClick(e) {
    const emptyState = e.target.closest('.empty-state.clickable');
    if (!emptyState) return;

    const type = emptyState.dataset.type;
    const target = emptyState.dataset.target;

    if (type && target) {
        openTaskModal(target, type);
    }
}

function handleCalendarDayClick(e) {
    const dayEl = e.target.closest('.calendar-day');
    if (!dayEl) return;

    const dateStr = dayEl.dataset.date;
    if (!dateStr) return;

    // 태스크 클릭 처리
    const taskEl = e.target.closest('.day-task');
    if (taskEl) {
        const taskId = taskEl.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            openTaskModal(task.status, 'status', task);
        }
        return;
    }

    // 날짜 선택
    selectedDate = dateStr;
    render();
}

function handleDayDetailClick(e) {
    const taskEl = e.target.closest('.day-detail-task');
    if (!taskEl) return;

    const taskId = taskEl.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (e.target.closest('.task-checkbox')) {
        toggleTaskComplete(taskId);
    } else if (e.target.closest('.task-action-btn.edit')) {
        openTaskModal(task.status, 'status', task);
    } else if (e.target.closest('.task-action-btn.delete')) {
        openDeleteModal(taskId, task.title);
    }
}

function handleAddTaskToDay() {
    if (!selectedDate) return;

    // 모달 열기 전에 마감일 미리 설정
    elements.taskDueDate.value = selectedDate;
    openTaskModal('todo', 'status');
}

function handlePrevMonth() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    selectedDate = null;
    elements.dayDetail.style.display = 'none';
    render();
}

function handleNextMonth() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    selectedDate = null;
    elements.dayDetail.style.display = 'none';
    render();
}

function handleTodayBtn() {
    calendarDate = new Date();
    const today = new Date();
    selectedDate = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
    render();
}

function handleCompletedClick(e) {
    const task = e.target.closest('.completed-task');
    if (!task) return;

    const taskId = task.dataset.id;
    const taskData = tasks.find(t => t.id === taskId);

    if (e.target.closest('.task-action-btn.restore')) {
        // 복원
        if (taskData) {
            taskData.completed = false;
            taskData.status = 'todo';
            saveTasks();
            render();
            showToast(`"${taskData.title}" 복원됨`, 'success');
        }
    } else if (e.target.closest('.task-action-btn.delete')) {
        // 삭제
        if (taskData) {
            openDeleteModal(taskId, taskData.title);
        }
    } else if (e.target.closest('.task-checkbox')) {
        // 체크박스 클릭 - 복원
        if (taskData) {
            taskData.completed = false;
            taskData.status = 'todo';
            saveTasks();
            render();
            showToast(`"${taskData.title}" 복원됨`, 'success');
        }
    }
}

function handleClearAllCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        showToast('삭제할 완료된 태스크가 없습니다', 'info');
        return;
    }

    if (confirm(`완료된 ${completedCount}개의 태스크를 모두 삭제하시겠습니까?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        render();
        showToast(`${completedCount}개 태스크 삭제됨`, 'success');
    }
}

// ============================================
// 이벤트 바인딩
// ============================================
function bindEvents() {
    // Theme
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Search & Filter
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchClear.addEventListener('click', handleSearchClear);
    elements.priorityChips.addEventListener('click', handlePriorityChipClick);
    elements.filterDue.addEventListener('change', handleFilterDue);

    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });

    // Completed View
    elements.completedList.addEventListener('click', handleCompletedClick);
    elements.clearAllCompleted.addEventListener('click', handleClearAllCompleted);

    // Calendar View
    elements.calendarDays.addEventListener('click', handleCalendarDayClick);
    elements.dayDetailTasks.addEventListener('click', handleDayDetailClick);
    elements.addTaskToDay.addEventListener('click', handleAddTaskToDay);
    elements.prevMonth.addEventListener('click', handlePrevMonth);
    elements.nextMonth.addEventListener('click', handleNextMonth);
    elements.todayBtn.addEventListener('click', handleTodayBtn);

    // Empty State Click
    document.addEventListener('click', handleEmptyStateClick);

    // Export/Import
    elements.exportBtn.addEventListener('click', exportData);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importData(e.target.files[0]);
            e.target.value = ''; // Reset input
        }
    });

    // Mandal-Art
    elements.mandalartGrid.addEventListener('click', (e) => {
        const cell = e.target.closest('.mandalart-cell');
        if (cell) {
            const index = parseInt(cell.dataset.index);
            const type = cell.dataset.type;
            openMandalartModal(index, type);
        }
    });

    elements.mandalartForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveMandalartCell();
    });

    elements.mandalartModalClose.addEventListener('click', closeMandalartModal);
    elements.mandalartCancelBtn.addEventListener('click', closeMandalartModal);
    elements.mandalartModal.addEventListener('click', (e) => {
        if (e.target === elements.mandalartModal) closeMandalartModal();
    });

    // 만다라트 삭제 버튼
    const mandalartDeleteBtn = document.getElementById('mandalartDeleteBtn');
    mandalartDeleteBtn?.addEventListener('click', deleteMandalartCell);

    elements.resetMandalart.addEventListener('click', resetMandalartData);
    elements.generateTasks.addEventListener('click', generateTasksFromMandalart);

    // Books
    elements.addBookBtn.addEventListener('click', () => openBookModal());
    elements.bookModalClose.addEventListener('click', closeBookModal);
    elements.bookCancelBtn.addEventListener('click', closeBookModal);
    elements.bookModal.addEventListener('click', (e) => {
        if (e.target === elements.bookModal) closeBookModal();
    });

    elements.bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookData = {
            title: elements.bookTitle.value.trim(),
            author: elements.bookAuthor.value.trim(),
            status: elements.bookStatus.value,
            rating: parseInt(elements.bookRating.value) || 0,
            cover: elements.bookCoverData.value || null,
            notes: elements.bookNotes.value.trim()
        };
        if (!bookData.title) return;
        saveBook(bookData);
    });

    // Star rating click
    elements.starRating.addEventListener('click', (e) => {
        const star = e.target.closest('.star');
        if (!star) return;
        const rating = parseInt(star.dataset.value);
        setStarRating(rating);
    });

    // Star rating hover
    elements.starRating.addEventListener('mouseover', (e) => {
        const star = e.target.closest('.star');
        if (!star) return;
        const value = parseInt(star.dataset.value);
        const stars = elements.starRating.querySelectorAll('.star');
        stars.forEach((s, index) => {
            s.classList.toggle('hover', index < value);
        });
    });

    elements.starRating.addEventListener('mouseout', () => {
        const stars = elements.starRating.querySelectorAll('.star');
        stars.forEach(s => s.classList.remove('hover'));
    });

    // Cover image paste - listen on document when modal is open
    document.addEventListener('paste', (e) => {
        if (!elements.bookModal.classList.contains('active')) return;
        handleImagePaste(e);
    });

    // Click on cover preview to focus for paste
    elements.coverPreview.addEventListener('click', () => {
        elements.coverPreview.focus();
        showToast('Ctrl+V로 이미지를 붙여넣으세요', 'info');
    });

    // Make cover preview focusable
    elements.coverPreview.setAttribute('tabindex', '0');

    // Clear cover button
    elements.clearCover.addEventListener('click', resetCoverPreview);

    // 파일/카메라로 이미지 업로드
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('이미지 파일만 업로드 가능합니다', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            elements.coverPreview.innerHTML = `<img src="${dataUrl}" alt="표지">`;
            elements.coverPreview.classList.add('has-image');
            elements.bookCoverData.value = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    document.getElementById('coverFileInput')?.addEventListener('change', handleImageUpload);
    document.getElementById('coverCameraInput')?.addEventListener('change', handleImageUpload);

    elements.booksGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.book-card');
        if (!card) return;

        const bookId = card.dataset.id;
        const book = books.find(b => b.id === bookId);

        if (e.target.closest('.task-action-btn.edit')) {
            openBookModal(book);
        } else if (e.target.closest('.task-action-btn.delete')) {
            deleteBook(bookId);
        } else {
            openBookModal(book);
        }
    });

    // Book filter
    document.querySelector('.books-filter')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;

        bookFilter = chip.dataset.bookFilter;
        document.querySelectorAll('.books-filter .chip').forEach(c => {
            c.classList.toggle('active', c.dataset.bookFilter === bookFilter);
        });
        render();
    });

    // Add Task Buttons
    elements.addTaskBtns.forEach(btn => {
        btn.addEventListener('click', handleAddTaskClick);
    });

    // Task Card Clicks (Event Delegation)
    document.addEventListener('click', handleTaskCardClick);

    // Task Modal
    elements.modalClose.addEventListener('click', closeTaskModal);
    elements.cancelBtn.addEventListener('click', closeTaskModal);
    elements.taskForm.addEventListener('submit', handleFormSubmit);
    elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) closeTaskModal();
    });

    // Delete Modal
    elements.deleteModalClose.addEventListener('click', closeDeleteModal);
    elements.cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    elements.confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // 입력 필드에서는 단축키 무시
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'Escape') {
                closeTaskModal();
                closeDeleteModal();
            }
            return;
        }

        if (e.key === 'Escape') {
            closeTaskModal();
            closeDeleteModal();
            deselectTask();
        }

        // Ctrl+C: 복사
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            if (selectedTaskId) {
                e.preventDefault();
                copyTask();
            }
        }

        // Ctrl+V: 붙여넣기
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            if (copiedTask) {
                e.preventDefault();
                pasteTask();
            }
        }

        // Delete: 선택된 태스크 삭제
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedTaskId) {
                const task = tasks.find(t => t.id === selectedTaskId);
                if (task) {
                    openDeleteModal(selectedTaskId, task.title);
                }
            }
        }
    });

    // 바깥 클릭 시 선택 해제
    document.addEventListener('click', handleDocumentClick);
}

// ============================================
// 인증 함수
// ============================================
let isSignUp = false;

async function checkAuthState() {
    if (!supabaseClient) {
        console.log('Supabase client not initialized');
        return;
    }

    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        console.log('Initial session check:', session ? 'logged in' : 'not logged in', error);

        if (session) {
            currentUser = session.user;
            updateAuthUI(true);
            await loadFromCloud();
        } else {
            currentUser = null;
            updateAuthUI(false);
        }
    } catch (e) {
        console.error('Session check error:', e);
    }

    // 인증 상태 변경 리스너
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session ? 'has session' : 'no session');

        if (event === 'SIGNED_IN' && session) {
            currentUser = session.user;
            updateAuthUI(true);
            await loadFromCloud();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            updateAuthUI(false);
        } else if (session) {
            currentUser = session.user;
            updateAuthUI(true);
        }
    });
}

function updateAuthUI(isLoggedIn) {
    const authSection = document.getElementById('authSection');
    const userSection = document.getElementById('userSection');
    const userEmail = document.getElementById('userEmail');
    const landingPage = document.getElementById('landingPage');
    const mainApp = document.getElementById('mainApp');

    if (isLoggedIn && currentUser) {
        // 로그인 상태: 메인 앱 표시
        if (landingPage) landingPage.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        if (authSection) authSection.style.display = 'none';
        if (userSection) userSection.style.display = 'flex';
        if (userEmail) userEmail.textContent = currentUser.email;
    } else {
        // 로그아웃 상태: 랜딩 페이지 표시
        if (landingPage) landingPage.style.display = 'flex';
        if (mainApp) mainApp.style.display = 'none';
        if (authSection) authSection.style.display = 'flex';
        if (userSection) userSection.style.display = 'none';
    }
}

function openAuthModal() {
    isSignUp = false;

    // DOM에서 직접 요소 찾기
    const authModal = document.getElementById('authModal');
    const authModalTitle = document.getElementById('authModalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSwitchText = document.getElementById('authSwitchText');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const authError = document.getElementById('authError');

    console.log('openAuthModal called, authModal:', authModal);

    if (!authModal) {
        console.log('authModal not found!');
        return;
    }

    if (authModalTitle) authModalTitle.textContent = '로그인';
    if (authSubmitBtn) authSubmitBtn.textContent = '로그인';
    if (authSwitchText) authSwitchText.textContent = '계정이 없으신가요?';
    if (authSwitchBtn) authSwitchBtn.textContent = '회원가입';

    // 저장된 이메일 불러오기
    const savedEmail = localStorage.getItem('taskmaster_saved_email');
    if (authEmail) authEmail.value = savedEmail || '';
    if (authPassword) authPassword.value = '';
    if (authError) authError.style.display = 'none';
    authModal.classList.add('active');
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.classList.remove('active');
}

function toggleAuthMode() {
    isSignUp = !isSignUp;
    if (isSignUp) {
        elements.authModalTitle.textContent = '회원가입';
        elements.authSubmitBtn.textContent = '회원가입';
        elements.authSwitchText.textContent = '이미 계정이 있으신가요?';
        elements.authSwitchBtn.textContent = '로그인';
    } else {
        elements.authModalTitle.textContent = '로그인';
        elements.authSubmitBtn.textContent = '로그인';
        elements.authSwitchText.textContent = '계정이 없으신가요?';
        elements.authSwitchBtn.textContent = '회원가입';
    }
    elements.authError.style.display = 'none';
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    if (!supabaseClient) {
        showAuthError('Supabase 연결 오류');
        return;
    }

    const email = elements.authEmail.value.trim();
    const password = elements.authPassword.value;

    try {
        elements.authSubmitBtn.disabled = true;
        elements.authSubmitBtn.textContent = isSignUp ? '가입 중...' : '로그인 중...';

        let result;
        if (isSignUp) {
            result = await supabaseClient.auth.signUp({ email, password });
        } else {
            result = await supabaseClient.auth.signInWithPassword({ email, password });
        }

        if (result.error) {
            throw result.error;
        }

        if (isSignUp && result.data.user && !result.data.session) {
            showAuthError('이메일을 확인해주세요!', 'success');
        } else {
            if (result.data.session) {
                currentUser = result.data.session.user;
                updateAuthUI(true);
                showToast('로그인 성공!', 'success');
            } else {
                showToast('세션 오류', 'error');
            }

            // 이메일 저장 체크박스 확인
            const rememberEmail = document.getElementById('rememberEmail');
            const autoLogin = document.getElementById('autoLogin');

            if (rememberEmail?.checked) {
                localStorage.setItem('taskmaster_saved_email', email);
            } else {
                localStorage.removeItem('taskmaster_saved_email');
            }

            if (autoLogin?.checked) {
                localStorage.setItem('taskmaster_auto_login', 'true');
            } else {
                localStorage.removeItem('taskmaster_auto_login');
            }

            closeAuthModal();

            // 클라우드 데이터 로드
            if (result.data.session) {
                await loadFromCloud();
            }
        }
    } catch (error) {
        console.error('Auth error:', error);
        let message = error.message;
        if (message.includes('Invalid login')) {
            message = '이메일 또는 비밀번호가 올바르지 않습니다.';
        } else if (message.includes('already registered')) {
            message = '이미 등록된 이메일입니다.';
        }
        showAuthError(message);
    } finally {
        elements.authSubmitBtn.disabled = false;
        elements.authSubmitBtn.textContent = isSignUp ? '회원가입' : '로그인';
    }
}

function showAuthError(message, type = 'error') {
    elements.authError.textContent = message;
    elements.authError.style.display = 'block';
    elements.authError.style.color = type === 'success' ? '#22c55e' : '#ef4444';
}

async function handleLogout() {
    if (!supabaseClient) return;
    try {
        await supabaseClient.auth.signOut();
        currentUser = null;
        // localStorage의 세션도 명시적으로 제거
        localStorage.removeItem('taskmaster-auth');
        updateAuthUI(false);
        showToast('로그아웃 완료', 'info');
    } catch (e) {
        showToast('로그아웃 실패', 'error');
    }
}

// ============================================
// 클라우드 동기화 함수
// ============================================
async function saveToCloud() {
    if (!supabaseClient || !currentUser) return;

    try {
        const data = {
            user_id: currentUser.id,
            tasks: tasks,
            eisenhower: { do: [], schedule: [], delegate: [], eliminate: [] },
            calendar: {},
            mandalart: mandalartData,
            books: books,
            completed_dates: completedDates || []
        };

        const { error } = await supabaseClient
            .from('user_data')
            .upsert(data, { onConflict: 'user_id' });

        if (error) throw error;
        console.log('Cloud sync successful');
    } catch (error) {
        console.error('Cloud sync error:', error);
    }
}

async function loadFromCloud() {
    if (!supabaseClient || !currentUser) return;

    try {
        const { data, error } = await supabaseClient
            .from('user_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (data) {

            // 클라우드 데이터가 있으면 로드 (빈 배열도 허용)
            if (data.tasks && Array.isArray(data.tasks)) {
                tasks = data.tasks;
                saveTasks();
                console.log('tasks 로드 완료:', tasks.length);
            }
            if (data.mandalart && Array.isArray(data.mandalart)) {
                mandalartData = data.mandalart;
                saveMandalart();
            }
            if (data.books && Array.isArray(data.books)) {
                books = data.books;
                saveBooks();
            }
            if (data.completed_dates) {
                completedDates = data.completed_dates;
                localStorage.setItem('taskmaster_completed_dates', JSON.stringify(completedDates));
            }
            render();
            console.log('클라우드 데이터 로드 및 렌더링 완료');
        } else {
            console.log('클라우드 데이터 없음, 로컬 데이터를 클라우드에 저장');
            // 클라우드 데이터가 없으면 로컬 데이터를 클라우드에 저장
            await saveToCloud();
        }
    } catch (error) {
        console.error('Load from cloud error:', error);
    }
}

async function handleSync() {
    if (!currentUser) {
        openAuthModal();
        return;
    }

    elements.syncBtn.textContent = '⏳';
    elements.syncBtn.disabled = true;

    try {
        await saveToCloud();
        elements.syncBtn.textContent = '✅';
        setTimeout(() => {
            elements.syncBtn.textContent = '🔄';
        }, 2000);
    } catch (error) {
        elements.syncBtn.textContent = '❌';
        setTimeout(() => {
            elements.syncBtn.textContent = '🔄';
        }, 2000);
    } finally {
        elements.syncBtn.disabled = false;
    }
}

// 데이터 변경 시 자동 클라우드 동기화
function syncAfterChange() {
    if (currentUser) {
        // 디바운스로 너무 잦은 동기화 방지
        clearTimeout(window.syncTimeout);
        window.syncTimeout = setTimeout(saveToCloud, 2000);
    }
}

// ============================================
// 인증 이벤트 바인딩
// ============================================
function bindAuthEvents() {
    // DOM에서 직접 요소 찾기
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const syncBtn = document.getElementById('syncBtn');
    const authModalClose = document.getElementById('authModalClose');
    const authForm = document.getElementById('authForm');
    const authSwitchBtn = document.getElementById('authSwitchBtn');
    const authModal = document.getElementById('authModal');

    // elements 객체 업데이트
    elements.loginBtn = loginBtn;
    elements.logoutBtn = logoutBtn;
    elements.syncBtn = syncBtn;
    elements.authModalClose = authModalClose;
    elements.authForm = authForm;
    elements.authSwitchBtn = authSwitchBtn;
    elements.authModal = authModal;
    elements.authSection = document.getElementById('authSection');
    elements.userSection = document.getElementById('userSection');
    elements.userEmail = document.getElementById('userEmail');
    elements.authModalTitle = document.getElementById('authModalTitle');
    elements.authEmail = document.getElementById('authEmail');
    elements.authPassword = document.getElementById('authPassword');
    elements.authError = document.getElementById('authError');
    elements.authSubmitBtn = document.getElementById('authSubmitBtn');

    loginBtn?.addEventListener('click', openAuthModal);
    logoutBtn?.addEventListener('click', handleLogout);
    syncBtn?.addEventListener('click', handleSync);
    authModalClose?.addEventListener('click', closeAuthModal);
    authForm?.addEventListener('submit', handleAuthSubmit);
    authSwitchBtn?.addEventListener('click', toggleAuthMode);
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });

    // 랜딩 페이지 로그인 버튼들
    const landingLoginBtn = document.getElementById('landingLoginBtn');
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    landingLoginBtn?.addEventListener('click', openAuthModal);
    headerLoginBtn?.addEventListener('click', openAuthModal);
}

// ============================================
// 초기화
// ============================================
function init() {
    initTheme();
    loadTasks();
    loadMandalart();
    loadBooks();
    render();
    bindEvents();
    bindAuthEvents();
    startReminderChecker();
    initSupabase();
}

document.addEventListener('DOMContentLoaded', init);
