const weeksContainer = document.getElementById('weeks-container');
const addWeekButton = document.getElementById('add-week-button');
const popup = document.getElementById('popup');
const weekDetailsDiv = document.getElementById('week-details'); 

let weeksData = JSON.parse(localStorage.getItem('weeksData')) || {
    "weeks": [
    {
        "id":1,
        "week_number": 1,
        "modules": [
            {
                "id": "mod1",
                "name": "Write 5 data types available in CPP?"
            },
            {
                "id": "mod2",
                "name": "What are pointers in CPP?",
                "tasks": [
                    {
                        "id": "task1",
                        "name": "Write breif about pointers"
                    },
                    {
                        "id": "task2",
                        "name": "Write an example of how pointers are used"
                    }
                ]
            }
        ]
    },
    {
        "id": 2,
        "week_number": 2,
        "modules": [
            {
                "id": "mod1",
                "name": "What is a DOM in webpage?"
            },
            {
                "id": "mod2",
                "name": "Write methods to manipulate DOM?"
            }
        ]
    },
    {
        "id": 3,
        "week_number": 3,
        "modules": [
            {
                "id": "mod1",
                "name": "What is a virtual DOM?"
            },
            {
                "id": "mod2",
                "name": "Write is rerendering in react?"
            }
        ]
    },
    {
        "id": 4,
        "week_number": 4,
        "modules": [
            {
                "id": "mod1",
                "name": "What do you know about svelte framework?"
            },
            {
                "id": "mod2",
                "name": "Write 3 advantages of svelte over react?"
            }
        ]
    }
]
};

let nextWeekId = weeksData.weeks.length + 1;
let nextModuleId = 1;

function renderWeeks() {
weeksContainer.innerHTML = ''; // Clear previous content
weeksData.weeks.forEach((week) => {
    const weekDiv = document.createElement('div');
    weekDiv.classList.add('week');
    weekDiv.innerText = `Week ${week.week_number}`;
    
    weeksContainer.appendChild(weekDiv);

    weekDiv.addEventListener('click', () => {
        toggleWeekDetails(week); // Toggle the week details visibility
    });
});
}

// Function to display week details
function displayWeekDetails(week) {
    weekDetailsDiv.innerHTML = `
    <h2>Week ${week.week_number} Details</h2>
    <ul>
        ${week.modules.map(module => `
            <li class="module">
                <h3>${module.name}</h3>
                <ul>
                    ${module.tasks ? module.tasks.map(task => `
                        <li class="task">${task.name}</li>
                    `).join('') : ''}
                </ul>
                <button class="add-task-button" data-week-id="${week.id}" data-module-id="${module.id}">Add Task</button>
            </li>
        `).join('')}
    </ul>
    <button class="add-module-button" data-week-id="${week.id}">Add Module</button>
    <button class="cancel-details-button" data-week-id="${week.id}">Cancel</button>
`;

weekDetailsDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-task-button')) {
        const weekId = parseInt(event.target.dataset.weekId);
        const moduleId = event.target.dataset.moduleId;
        openTaskPopup(weekId, moduleId);
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-module-button')) {
        const weekId = parseInt(event.target.dataset.weekId);
        openModulePopup(weekId);
    }
});

    // Add event listener for the Cancel button in the week details
const cancelButton = weekDetailsDiv.querySelector('.cancel-details-button');
cancelButton.addEventListener('click', () => {
    weekDetailsDiv.innerHTML = ''; // Clear the content
    weekDetailsDiv.style.display = 'none';
});
}



// function to toggle the weekdetails on clicking on weeknumber
function toggleWeekDetails(week) {
    const weekDetailsDiv = document.getElementById('week-details');

    if (weekDetailsDiv.style.display === 'block' && weekDetailsDiv.dataset.weekId === week.id.toString()) {
        weekDetailsDiv.style.display = 'none';
        weekDetailsDiv.dataset.weekId = '';
    } else {
        displayWeekDetails(week);
        weekDetailsDiv.style.display = 'block';
        weekDetailsDiv.dataset.weekId = week.id;
    }
}

// Add event listeners to week divs to toggle details
weeksContainer.addEventListener('click', (event) => {
    const clickedWeek = weeksData.weeks.find(week =>
        event.target.innerText === `Week ${week.week_number}`
    );

    if (clickedWeek) {
        toggleWeekDetails(clickedWeek);
    }
});

renderWeeks(); // Initial rendering


// Popup for taking week number and module name as input
function openPopup() {

popup.innerHTML = `
<div class="popup-content">
    <label for="week-number">Week Number:</label>
    <input type="number" id="week-number" required><br>
    
    <label for="module-name">Module Name:</label>
    <input type="text" id="module-name" required><br>
    
    <button id="submit-week">Submit</button>
</div>
`;
popup.style.display = 'flex'; // Change to 'flex' for proper animation

const submitButton = document.getElementById('submit-week');
submitButton.addEventListener('click', addNewWeek);

const cancelButton = document.createElement('button');
cancelButton.textContent = 'Cancel';
cancelButton.addEventListener('click', () => {
    popup.style.opacity = 0;
    popup.querySelector('.popup-content').style.transform = 'translateY(-100%)';
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300); // Wait for the transition to complete
});
popup.querySelector('.popup-content').appendChild(cancelButton);

setTimeout(() => {
    popup.querySelector('.popup-content').style.transform = 'translateY(0)';
    popup.style.opacity = 1;
}, 100); // Delay the animation for 100 milliseconds

}


// Function to add new
function addNewWeek() {
    const weekNumberInput = document.getElementById('week-number');
    const moduleNameInput = document.getElementById('module-name');
    
    const weekNumber = parseInt(weekNumberInput.value);
    const moduleName = moduleNameInput.value;
    
    const existingWeekIndex = weeksData.weeks.findIndex(week => week.week_number === weekNumber);
    
    if (existingWeekIndex !== -1) {
        // Increment week numbers of subsequent weeks
        for (let i = existingWeekIndex; i < weeksData.weeks.length; i++) {
            weeksData.weeks[i].week_number++;
        }
    }
    
    const newWeek = {
    "id": nextWeekId,
    "week_number": weekNumber,
    "modules": [
        {
            "id": `mod${nextModuleId}`,
            "name": moduleName,
            "tasks": [] // Initialize tasks array for the new module
        }
    ]
};
    
    weeksData.weeks.splice(existingWeekIndex !== -1 ? existingWeekIndex : weekNumber - 1, 0, newWeek);
    
    nextWeekId++;
    nextModuleId++;
    
    renderWeeks();
    popup.style.display = 'none';
    
    console.log(newWeek)
    weekNumberInput.value = ''; // Clear input
    moduleNameInput.value = ''; // Clear input
    
    localStorage.setItem('weeksData', JSON.stringify(weeksData));
}

addWeekButton.addEventListener('click', openPopup);
renderWeeks(); // Initial rendering


weeksContainer.addEventListener('click', (event) => {
    const clickedWeek = weeksData.weeks.find(week =>
        event.target.innerText === `Week ${week.week_number}`
    );

    if (clickedWeek) {
        toggleWeekDetails(clickedWeek); // Toggle the week details visibility
    }
});




function openModulePopup(weekId) {
    const week = weeksData.weeks.find(week => week.id === weekId);
    if (!week) return;

    popup.innerHTML = `
        <div class="popup-content">
            <label for="module-id">Module ID:</label>
            <input type="text" id="module-id" required><br>
            
            <label for="module-name">Module Name:</label>
            <input type="text" id="module-name" required><br>
            
            <button id="submit-module">Add Module</button>
            <button id="cancel-module">Cancel</button>
        </div>
    `;

    popup.style.display = 'flex';

    const submitModuleButton = document.getElementById('submit-module');
    const cancelModuleButton = document.getElementById('cancel-module');
    
    
    function submitModule() {
        const newModuleIdInput = document.getElementById('module-id');
        const moduleNameInput = document.getElementById('module-name');

        const newModuleId = newModuleIdInput.value;
        const moduleName = moduleNameInput.value;
        
        console.log(newModuleId);
        console.log(moduleName);

        const newModule = {
            "id": newModuleId,
            "name": moduleName,
            "tasks": []
        };

        week.modules.push(newModule);
        localStorage.setItem('weeksData', JSON.stringify(weeksData)); 
        closePopup();
    }

    function closePopup() {
        popup.style.opacity = 0;
        popup.querySelector('.popup-content').style.transform = 'translateY(-100%)';

        setTimeout(() => {
            popup.style.display = 'none';
        }, 300); // Wait for the transition to complete

        // Remove the event listeners
        submitModuleButton.removeEventListener('click', submitModule);
        cancelModuleButton.removeEventListener('click', closePopup);
    }

    submitModuleButton.addEventListener('click', submitModule);
    cancelModuleButton.addEventListener('click', closePopup);

    setTimeout(() => {
        popup.querySelector('.popup-content').style.transform = 'translateY(0)';
        popup.style.opacity = 1;
    }, 50);
}


function openTaskPopup(weekId, moduleId) {
const week = weeksData.weeks.find(week => week.id === weekId);
if (!week) return;

const module = week.modules.find(mod => mod.id === moduleId);
if (!module) return;

popup.innerHTML = `
    <div class="popup-content">
        <label for="task-id">Task ID:</label>
        <input type="text" id="task-id-input" required><br>
        
        <label for="task-name">Task Name:</label>
        <input type="text" id="task-name-input" required><br>
        
        <button id="submit-task">Add Task</button>
        <button id="cancel-task">Cancel</button>
    </div>
`;

popup.style.display = 'flex';

const submitTaskButton = document.getElementById('submit-task');
const cancelTaskButton = document.getElementById('cancel-task');

function submitTask() {
    const taskIdInput = document.getElementById('task-id-input');
    const taskNameInput = document.getElementById('task-name-input');

    const taskId = taskIdInput.value;
    const taskName = taskNameInput.value;

    const newTask = {
        "id": taskId,
        "name": taskName
    };

    module.tasks.push(newTask);
    localStorage.setItem('weeksData', JSON.stringify(weeksData)); // Update localStorage
    renderWeeks();
    closePopup();

}

function closePopup() {
    popup.style.opacity = 0;
    popup.querySelector('.popup-content').style.transform = 'translateY(-100%)';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 300); // Wait for the transition to complete

    submitTaskButton.removeEventListener('click', submitTask);
    cancelTaskButton.removeEventListener('click', closePopup);
}

submitTaskButton.addEventListener('click', submitTask);
cancelTaskButton.addEventListener('click', closePopup);

setTimeout(() => {
    popup.querySelector('.popup-content').style.transform = 'translateY(0)';
    popup.style.opacity = 1;
}, 50);
}


const headingContainer = document.getElementById('heading-container');
const headingElement = document.getElementById('heading');
const headingText = "See Your Weekly Schedules and Tasks here...";
let index = 0;



function typeWriter() {
if (index < headingText.length) {
    headingElement.textContent += headingText.charAt(index);
    // playTypingSound();
    index++;
    setTimeout(typeWriter, 50); // Adjust the delay (in milliseconds) between letters
}
}

// Start the typewriter effect when the page loads
window.addEventListener('load', () => {
setTimeout(typeWriter, 500); // Start after a delay (in this case, 1 second)
});