// 1. SELECTING HTML ELEMENTS
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority-select');

const filterAll = document.getElementById('filter-all');
const filterPending = document.getElementById('filter-pending');
const filterCompleted = document.getElementById('filter-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

const clearCompletedBtn = document.getElementById('clear-completed-btn');
const taskCounter = document.getElementById('task-counter');
const darkModeCheckbox = document.getElementById('dark-mode-checkbox');

// Track which filter is clicked ('all', 'pending', or 'completed')
let currentFilter = 'all';

// 2. FUNCTION TO CREATE A NEW TASK ROW
function addTaskToDOM(text, priority, completed) {
    // Create the main <li> container
    const li = document.createElement('li');
    li.dataset.priority = priority; // Store priority for CSS styling

    // Create text container
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    // Check if the task was already completed when loading
    if (completed === true) {
        li.classList.add('completed');
    }

    // Create the Done button
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    if (completed === true) {
        completeBtn.textContent = 'Undo';
    } else {
        completeBtn.textContent = 'Done';
    }

    // Done button logic
    completeBtn.addEventListener('click', function() {
        li.classList.toggle('completed');
        
        // Change button text based on status
        if (li.classList.contains('completed')) {
            completeBtn.textContent = 'Undo';
        } else {
            completeBtn.textContent = 'Done';
        }
        
        saveTasks();
        filterTasks(currentFilter);
        updateCounter();
    });

    // Create the Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    
    // Delete button logic
    deleteBtn.addEventListener('click', function() {
        li.remove(); // Remove item from screen
        saveTasks();
        updateCounter();
    });

    // Assemble and append to list
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    saveTasks();
    filterTasks(currentFilter);
    updateCounter();
}

// 3. STORAGE FUNCTIONS (Save & Load)
function saveTasks() {
    const tasksArray = [];
    const allListItems = taskList.querySelectorAll('li');

    allListItems.forEach(function(li) {
        const taskObject = {
            text: li.querySelector('span').textContent,
            priority: li.dataset.priority,
            completed: li.classList.contains('completed')
        };
        tasksArray.push(taskObject);
    });

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

window.onload = function() {
    // Restore Dark Mode
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeCheckbox.checked = true;
    }

    // Restore Saved Tasks
    const savedString = localStorage.getItem('tasks');
    let savedTasks = [];
    if (savedString !== null) {
        savedTasks = JSON.parse(savedString);
    }

    savedTasks.forEach(function(task) {
        addTaskToDOM(task.text, task.priority, task.completed);
    });
    
    updateCounter();
};

// 4. ADD TASK EVENT LISTENERS
addBtn.addEventListener('click', function() {
    const textValue = taskInput.value.trim();
    if (textValue === '') {
        return; // Stop if input is empty
    }
    addTaskToDOM(textValue, prioritySelect.value, false);
    taskInput.value = ''; // Reset input field
});

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

// 5. FILTER LOGIC
function changeActiveFilterButton(clickedButton) {
    filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
}

filterAll.addEventListener('click', function(e) { 
    currentFilter = 'all'; 
    filterTasks('all'); 
    changeActiveFilterButton(e.target); 
});

filterPending.addEventListener('click', function(e) { 
    currentFilter = 'pending'; 
    filterTasks('pending'); 
    changeActiveFilterButton(e.target); 
});

filterCompleted.addEventListener('click', function(e) { 
    currentFilter = 'completed'; 
    filterTasks('completed'); 
    changeActiveFilterButton(e.target); 
});

function filterTasks(type) {
    const allListItems = taskList.querySelectorAll('li');
    
    allListItems.forEach(function(li) {
        li.style.display = 'flex'; // Show by default
        
        if (type === 'completed' && !li.classList.contains('completed')) {
            li.style.display = 'none';
        }
        if (type === 'pending' && li.classList.contains('completed')) {
            li.style.display = 'none';
        }
    });
}

// 6. EXTRA UTILITIES
clearCompletedBtn.addEventListener('click', function() {
    const completedItems = taskList.querySelectorAll('li.completed');
    completedItems.forEach(function(li) {
        li.remove();
    });
    saveTasks();
    updateCounter();
});

function updateCounter() {
    const pendingItems = taskList.querySelectorAll('li:not(.completed)');
    const count = pendingItems.length;
    taskCounter.textContent = count + " tasks pending";
}

darkModeCheckbox.addEventListener('change', function() {
    if (darkModeCheckbox.checked === true) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});