chrome.runtime.onInstalled.addListener(function(){
	chrome.storage.sync.set({
		taskList: [{id: "20180416T001212491Z", taskName:"Test Task", date: "2018-04-16T00:12:12.491Z",
					data: [{id: 1 , item: "First Item", active: true}, {id: 2, item: "Second Item", active: true},
			    	{id: 3, item: "Third Item", active: true}, {id: 4, item: "Fourth Item", active: false}]}]
	});
});