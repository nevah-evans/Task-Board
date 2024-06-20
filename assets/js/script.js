// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

const formEl = $('#formModal');
const taskDisplayEl = $('#task-display');
let taskTitleEl = $('input[name="taskTitle"]');
let taskDueDateEl = $('input[name="taskDueDate"]');
let taskDescriptionEl = $('textarea[name="taskDescription"]');

const toDoLane = $('#todo-cards');
const progressLane = $('#in-progress-cards');
const doneLane = $('#done-cards');

const addTaskBtn = $('#addTaskBtn')

function saveTaskList(){
    localStorage.setItem('tasks', JSON.stringify(taskList));
    console.log(taskList);
};

// Todo: create a function to generate a unique task id
function generateTaskId(nextId) {
if (isNaN(nextId)){
    nextId = 0;
}else{
    nextId++;
}
    localStorage.setItem('nextId', nextId);
     return nextId;
    // console.error('error: not a valid number.');
    // return null;
};


// Todo: create a function to create a task card
function createTaskCard(task) {
    const cardEl = $('<div>').addClass('card taskCard draggable').attr('data-card-id', task.id);
    const cardTitle = $('<div>').addClass('cardTitle h4').text(task.name);
    const cardBody = $('<div>').addClass('cardBody');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDelete = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-card-id', task.id);
    cardDelete.on('click', handleDeleteTask);

  


    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');

        if (now.isSame(taskDueDate, 'day')) {
            cardEl.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
            cardEl.addClass('bg-danger text-white');
            cardDelete.addClass('border-light');
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDelete);
    cardEl.append(cardTitle, cardBody);

    return cardEl;

}
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    toDoLane.empty();
    progressLane.empty();
    doneLane.empty();

for (let task of taskList){
    if(task.status ==='to-do'){
        toDoLane.append(createTaskCard(task));
    }else if(task.status === 'in-progress'){
        progressLane.append(createTaskCard(task));
    }else if(task.status ==='done'){
        doneLane.append(createTaskCard(task));
    }
};

$( ".lane" ).droppable({
    accept:'.draggable',
    drop: handleDrop,
    zIndex: 10
});

$('.taskCard').draggable({
    zIndex: 100
});



saveTaskList();

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
event.preventDefault();
const taskName= taskTitleEl.val();
const taskDue = taskDueDateEl.val();
const taskMessage = taskDescriptionEl.val();

const newTask = {
    name: taskName,
    dueDate: taskDue,
    description: taskMessage,
    status: 'to-do',
};

JSON.parse(localStorage.getItem("tasks"));

taskList.push(newTask);

saveTaskList();
renderTaskList();

taskTitleEl.val('');
taskDueDateEl.val('');
taskDescriptionEl.val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    event.preventDefault();

    const taskId = $(this).attr('data-card-id');

    taskList.forEach((task) => {
        if (task.id === taskId) {
            taskList.splice(taskList.indexOf(task.id), 1);
        }
    });

    saveTaskList();
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const nextId =ui.draggable[0].dataset.taskId;
    const nextStatus = event.target.id;

    for(let task of taskList){
        if (task.id === nextId){
            task.status = nextStatus;  
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
renderTaskList();
// console.log(nextId);

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    addTaskBtn.on('click', handleAddTask);


    
    $(function () {
        $("#taskDueDate").datepicker();
    });
});