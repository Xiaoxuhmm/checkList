import $ from 'jquery';
import styles from './popup.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


function constructItemManagePanel(){
	return (
		`<div class="panel panel-default"></div>`
	)
}

// Construct item's html list of a task.
function constructList(taskId, data){
	return data.map((item) => {
		const checkboxId = taskId + '-' + item.id;
		return `<div class="custom-control custom-checkbox task-item-checkbox-wrapper" id=${checkboxId + 'wrapper'}>
		  	<input type="checkbox" class="custom-control-input taskCheckbox" id=${checkboxId} for=${checkboxId + 'wrapper'}>
		  	<label class="custom-control-label unselectable display-inline" for=${checkboxId}>${item.item}</label>
		  	<div class="display-inline item-manage-button" id=${taskId + '-' + item.id +'-manage-button'} for=${item.id}>&#9776;</div>
		</div>`;
	});
};

// Construct html of Buttons used to enable edit task after created.
function constructAddNewItemButton(task){
	const modalName =  task.id + '-add-button';
	return (
		`
		<div class="add-new-item-button task-manage-button display-inline" id=${modalName} for=${task.id}>
			<h5>+</h5>
		</div>
		`
	);
}

function constructNewItemInput(taskId){
	const newItemInputId = taskId + 'new-item-input';
	return (
		`
		<div class="new-item-input" id=${newItemInputId}  for=${taskId}>
			<div class="input-group">
			  <input type="text" class="form-control" aria-label="new-item-input">
			</div>
			<button class="btn btn-success">Save</button>
			<button class="btn btn-secondary new-item-input-close-button" for="${newItemInputId}">Close</button>
		</div
		`
	);
}



// Construct html of Buttons used to enable delete task.
function constructDeleteButton(task){
	const modalName = 'delete-' + task.id + '-modal';
	return (
	`
	<div class="task-manage-button display-inline delete-task-button" data-toggle="modal" data-target="#${modalName}"">
		<h5>&times;</h5>
	</div>
	<div class="modal fade" id="${modalName}" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
	 	<div class="modal-dialog" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">${`Delete Task Warning!`}</h5>
		       		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
		      	</div>
				<div class="modal-body">
					<label class="delete-task-check">You are trying to delete task ${task.taskName}</label>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Keep It!</button>
					<button type="button" for=${task.id} class="btn btn-primary delete-task">Delete Task!</button>
				</div>
			</div>
		</div>
	</div>`);
}




// <button type="button" class="btn btn-outline-danger display-inline">Delete</button>

// Construct html of tasks
function constructTask(task){
	$("#list-container").append(`<div id=${task.id} class="task-wrapper">
									<div class="head-wrapper">
										<div class="head display-inline">
											<h5 class="task-head display-inline">${task.taskName}</h5>
										</div>
										${constructAddNewItemButton(task)}
										${constructDeleteButton(task)}
									</div>
									<div class="task">
										${constructList(task.id, task.data).join("")}
									</div>
								</div>`);
}


// Add active attribute after task constructed
function constructActiveItems(){
	chrome.storage.sync.get("taskList", function(data){
		data.taskList.forEach((task)=>{
			const taskId = task.id;
			task.data.forEach((item) => {
				const checkboxId = taskId + '-' + item.id;
				if(!item.active){
					$('#' + checkboxId).prop("checked", true);
					const checkboxWrapper = $('#' + checkboxId).attr("for");
					$('#' + checkboxWrapper).find('label').addClass("checked");
				}else{
					const checkboxWrapper = $('#' + checkboxId).attr("for");
					$('#' + checkboxWrapper).find('label').removeClass("checked");
				}
			})
		})
	});
};


// Build a handler for item checkbox state change
function checkboxHandler(checkboxId, checked){
	const taskId = checkboxId.split('-')[0];
	const itemId = parseInt(checkboxId.split('-')[1]);
	chrome.storage.sync.get("taskList", function(data){
		data.taskList.forEach((task) => {
			if(task.id === taskId){
				console.log('Find task!');
				task.data.forEach((item)=>{
					if(item.id === itemId){
						console.log('Find item!');
						item.active = !checked;
					}
				})
			}
		});
		console.log(data);
		chrome.storage.sync.set({taskList: data.taskList}, constructActiveItems);
	})
};

// Build a handler for delete button onclick
function deleteTaskHandler(taskId){
	console.log('deleteTaskHandler is called');
	chrome.storage.sync.get("taskList", function(data){
		let newTaskList = Array.from(data.taskList);
		let index;
		newTaskList.forEach((task, i) => {
			if(task.id === taskId){
				index = i;
			}
		});
		newTaskList.splice(index, 1);
		chrome.storage.sync.set({taskList: newTaskList}, constructAllTasks);
	})
}


// Build a handler for close button in add new item input.
function newItemCloseButtonHandler(newItemInputId){
	console.log('newItemCloseButtonHandler is called');
	console.log(newItemInputId);
	$('#' + newItemInputId).remove();
}


// Build a handler for add new item to task
// Step1: Create the HTML for new item input  Function called: constructNewItemInput(taskId);
// Step2: Add event listener for those HTML file. Function called: newItemCloseButtonHandler();
function addNewItemHandler(taskId){
	console.log('addItemHandler is called');
	const newItemInputId = taskId + 'new-item-input';
	if(('#' + newItemInputId).length !== 0){
		const newInput = constructNewItemInput(taskId);
		$('#' + taskId).append(newInput);
	}
	$(".new-item-input-close-button").click(function(){
		console.log('new-item-input-close-button clicked');
		newItemCloseButtonHandler($(this).attr("for"));
	});
}


function itemManageButtonHandler(itemId){

}

// Create an interface for adding all handlers.
function addHandler(){
	$(function(ready){
		$(".taskCheckbox").change(function(){
			checkboxHandler(this.id, this.checked);
		});

		$(".delete-task").click(function(){
			deleteTaskHandler($(this).attr("for"));
		});

		$(".add-new-item-button").click(function(){
			addNewItemHandler($(this).attr("for"));
		});
	});
}

// Construct Task List
// Step1: Fetch data from browser storage
// Step2: Create html file;
// Step3: Add JS event listener
function constructAllTasks(){
	$("#list-container").empty();
	chrome.storage.sync.get("taskList", function(data){
		let taskList = Array.from(data.taskList);
		taskList.sort(function(a, b){
			return new Date(b.date) - new Date(a.date);
		});
		taskList.forEach((task) => {
			constructTask(task);
		});
		constructActiveItems();
		addHandler();
	});
}

constructAllTasks();


function constructItemData(itemData){
	const items = itemData.split("\n");
	// console.log(items);
	return items;
}

function constructTaskData(head, itemData){
	chrome.storage.sync.get("taskList", function(data){
		let itemId = 1;
		let itemList = [];
		const items = constructItemData(itemData);
		for(let i = 0; i < items.length; i++){
			let item = {id: itemId, item: items[i], active: true};
			itemList.push(item);
			itemId++;
		};
		const date = new Date();
		const task = {id: date.toJSON().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""),date: date.toJSON(), taskName: head, data: itemList};
		// console.log(task);
		data.taskList.push(task);
		chrome.storage.sync.set({taskList: data.taskList}, constructAllTasks);
	});
	// console.log(data);
}

function checkValidation(head, data){
	if(head === ""){

	}
}

$(function(ready){
	$("#create-new-task").click(function(){
		// console.log('create-new-task clicked!');
		const head = $("#task-head").val();
		const itemData = $("#new-task-input").val();
		const task = constructTaskData(head, itemData);
		$('#task-head').val("");
		$('#new-task-input').val("");
	});
});
