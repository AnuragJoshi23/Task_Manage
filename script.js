let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let attendanceData = JSON.parse(localStorage.getItem('attendance')) || [];

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    const roleSelection = document.querySelector('.role-selection');
    const employeeRole = document.getElementById('employeeRole');
    const adminRole = document.getElementById('adminRole');
    const taskList = document.getElementById('taskList');
    const attendanceCalendarEl = document.getElementById('attendanceCalendar');
    const unauthorizedAccess = document.getElementById('unauthorizedAccess');
    const role = localStorage.getItem('role');

    // Role Selection
    if (roleSelection) {
        employeeRole.addEventListener('click', () => showLoginForm('employee'));
        adminRole.addEventListener('click', () => showLoginForm('admin'));
    }

    // Unauthorized Access Check
    if (role) {
        if (role === 'admin' && location.pathname.includes('employee.html')) {
            unauthorizedAccess.style.display = 'block';
        } else if (role === 'employee' && location.pathname.includes('admin.html')) {
            unauthorizedAccess.style.display = 'block';
        }

        // Load Employee Tasks and Attendance Calendar
        renderTasksForEmployee(role);
        initializeAttendanceCalendar();
    }

    // Task Completion Handler
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('taskItem')) {
            const taskId = event.target.dataset.id;
            toggleTaskCompletion(taskId);
        }
    });

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const role = loginForm.getAttribute('data-role');
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple validation for demonstration purposes
        if (role === 'admin' && username === 'admin' && password === 'admin') {
            localStorage.setItem('role', 'admin');
            window.location.href = 'admin.html';  // Redirect to admin page
        } else if (role === 'employee' && username === 'employee' && password === 'employee') {
            localStorage.setItem('role', 'employee');
            window.location.href = 'employee.html';  // Redirect to employee page
        } else {
            unauthorizedAccess.style.display = 'block';
        }
    });

    // Render Tasks for Employee
    function renderTasksForEmployee(role) {
        const filteredTasks = tasks.filter(task => task.employee === role);
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('taskItem');
            taskItem.dataset.id = index;
            taskItem.textContent = `${task.task}`;
            taskItem.classList.add(task.status === 'completed' ? 'completed' : 'pending');
            taskList.appendChild(taskItem);
        });
    }

    // Initialize Attendance Calendar
    function initializeAttendanceCalendar() {
        const attendanceCalendar = new FullCalendar.Calendar(attendanceCalendarEl, {
            initialView: 'dayGridMonth',
            events: attendanceData.map(entry => ({
                title: 'Present',
                date: entry.date,
                color: '#4caf50' // Green color for present days
            }))
        });
        attendanceCalendar.render();
    }

    // Toggle Task Completion
    function toggleTaskCompletion(taskId) {
        tasks[taskId].status = tasks[taskId].status === 'pending' ? 'completed' : 'pending';
        saveTasks();
        location.reload();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Show Login Form
    function showLoginForm(role) {
        const loginForm = document.getElementById('loginForm');
        loginForm.style.display = 'block';
        loginForm.setAttribute('data-role', role); // Store the selected role
        document.getElementById('unauthorizedAccess').style.display = 'none';
    }
});
