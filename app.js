const inputTask = document.getElementById("ip-add-task");
const btnAddTask = document.getElementById("btn-add-task");
const content = document.querySelector(".content");
// var deleteTask = document.getElementById('delete-task');

var taskID = 0;
var taskList = [];

//console.log(taskList);
// ======== FUNCTION =======
function checkValidItem(taskItem) {
  for (let i of taskList) {
    if (taskItem.name == i.name) {
      return false;
    }
  }
  return true;
}

function addTask() {
  btnAddTask.innerText = "Add Task";
  let taskItem = {
    name: inputTask.value,
    id: taskID,
    isComplete: false,
    editing: false,
  };
  if (inputTask.value == "") {
    alert("Task name is empty!");
    return;
  }
  if (checkValidItem(taskItem)) {
    taskList.push(taskItem);
    taskID++;
    loadTaskList(taskList);
    inputTask.value = "";
  } else {
    alert(`Task name: "${taskItem.name}" already existed!`);
  }
}

function loadTaskList() {
  content.innerHTML = "";
  for (let task of taskList) {
    let str = `
        <div class="task" isComplete='false'>
            <p class="task-name" isComplete=${task.isComplete} onclick="markCompleteTask(${task.id})">${task.name}</p>
            <div class="icon" editing=${task.editing}>
                <i class="fa-solid fa-pen" onclick="editTask(${task.id})"></i>
                <i class="fa-solid fa-trash-can" onclick="deleteTask(${task.id})"></i>
            </div>
        </div>
        `;
    content.innerHTML += str;
  }
  saveData();
//  console.log(taskList);
}

function markCompleteTask(index) {
  taskList[index].isComplete =
    taskList[index].isComplete == true ? false : true;
  console.log(taskList[index].name);
  loadTaskList();
  loadData();
}

function deleteTask(index) {
  taskList.splice(index, 1);
  taskID = 0;
  for (let task of taskList) {
    task.id = taskID;
    taskID++;
  }
  loadTaskList();
  loadData();
}

function editTask(index) {
  inputTask.value = taskList[index].name;
  btnAddTask.innerText = "Edit Task";
  btnAddTask.setAttribute("index", index);
  taskList[index].editing = true;
  loadTaskList();
}

function editTaskItem(index) {
  taskList[index].editing = true;
  loadTaskList();
  for (let i in taskList) {
    if (i == index) continue;
    else {
      if (inputTask.value == taskList[i].name) {
        alert(`Task name: "${taskList[i].name}" already existed!`);
        return;
      }
    }
   // console.log(taskList[i]);
  }
  taskList[index].name = inputTask.value;
  btnAddTask.removeAttribute("index");
  btnAddTask.innerText = "Add Task";
  inputTask.value = "";
  taskList[index].editing = false;
  loadTaskList();
}

function saveData() {
  localStorage.setItem("list_task", JSON.stringify(taskList));
  let taskCount = 0;
  for (let task of taskList) {
    if (task.isComplete == true) taskCount++;
  }
  localStorage.setItem("taskCount", taskCount);
}

function loadData() {
  taskList = (JSON.parse(localStorage.getItem("list_task")) == null) ? [] : JSON.parse(localStorage.getItem("list_task"));

  const taskCount = document.querySelector(".task-count");
  if (localStorage.getItem("taskCount") > 0) {
    taskCount.innerHTML = `Yeah, ${localStorage.getItem(
      "taskCount"
    )} task completed!`;
  } else taskCount.innerHTML = "";
  loadTaskList();
}

// ========== EVENT ===========
// localStorage.clear();
loadData();

btnAddTask.addEventListener("click", () => {
  const index = btnAddTask.getAttribute("index");
  if (index != null) {
    editTaskItem(index);
  } else {
    addTask();
  }
});

inputTask.addEventListener("keypress", (e) => {
  const index = btnAddTask.getAttribute("index");
  if (e.key == "Enter" && index != null) {
    editTaskItem(index);
  } else if (e.key == "Enter" && index == null) {
    addTask();
  }
});
