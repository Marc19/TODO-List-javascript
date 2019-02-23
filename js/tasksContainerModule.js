/* REMAINING TODO
1. stats module
2. done action (test the two digit number converter)
3. sortable
*/
var tasksContainer = (function(){
    var taskList = {
        tasks: JSON.parse(localStorage.getItem('tasks')) || []
    };
    
    var $inputTextBox = $('#inputTextBox');
    var $addButton = $('#addBtn');
    var $tasksDiv = $('#tasksDiv');
    var tasksTemplate = $('#tasksTemplate').html();
    
    $addButton.on('click', addButtonClicked);
    $inputTextBox.on('keypress', addButtonClicked)
    
    $tasksDiv.on('click', '#editBtn', editButtonClicked);
    $tasksDiv.on('click', '#starBtn', starButtonClicked);
    $tasksDiv.on('click', '#doneBtn', doneButtonClicked);
    $tasksDiv.on('click', '#removeBtn', removeButtonClicked);

    $tasksDiv.on('keypress', '.editListItemTextBox', enterPressedOnEditedItem);
    
    _render();

    function createTask(text){
        return{
            text: text,
            isDone: false,
            dateFinished: ""
        }
    }

    function saveToLocalStorage(){
        localStorage.setItem('tasks', JSON.stringify(taskList.tasks));
    }

    function addButtonClicked(e){
        //Only proceed if add was clicked or enter was pressed
        if(e.type != 'click' && e.which != 13)
            return;

        var text = $inputTextBox.val();

        if(text.trim().length == 0)
            return;

        var task = createTask(text);

        taskList.tasks.push(task);
        saveToLocalStorage();

        clearMainTextBox();
        _render();
    }

    function editButtonClicked(){
        var index = $('.taskLI').index($(this).parent().parent());
        var taskToBeEditedText = taskList.tasks[index].text;

        exitEditMode(); //To disable any unfinished editing before editing new item
        enterEditMode(index, taskToBeEditedText);
    }

    function starButtonClicked(){
        var index = $('.taskLI').index($(this).parent().parent());
        var taskToBeStarred = taskList.tasks.splice(index,1)[0];
        taskList.tasks.unshift(taskToBeStarred);
        saveToLocalStorage();
        _render();
    }

    function doneButtonClicked(){
        var index = $('.taskLI').index($(this).parent().parent());
        var taskToBeSetToDone = taskList.tasks[index]

        if(taskToBeSetToDone.isDone){
            taskToBeSetToDone.isDone = false;
            taskToBeSetToDone.dateFinished = "";
            saveToLocalStorage();
            _render();
            return;
        }

        var currentDate = new Date();
        var date = ("0" + currentDate.getDate()).slice(-2);//format numbers to 2 digits
        var month = ("0" + currentDate.getMonth()).slice(-2); 
        var year = ("0" + currentDate.getFullYear()).slice(-2);
        var hours = ("0" + currentDate.getHours()).slice(-2);
        var minutes = ("0" + currentDate.getMinutes()).slice(-2);
        
        var dateString = "@done(" + date + "-" +(month + 1) + "-" + year + " " + hours + ":" + minutes + ")";
        
        taskToBeSetToDone.isDone = true;
        taskToBeSetToDone.dateFinished = dateString;
        
        saveToLocalStorage();
        _render();
    }

    function removeButtonClicked(){
        var index = $('.taskLI').index($(this).parent().parent());
        taskList.tasks.splice(index,1);
        saveToLocalStorage();
        _render();
    }

    function clearMainTextBox(){
        $inputTextBox.val('');
    }

    function enterEditMode(index, initText){
        $($('.taskLI span').get(index)).hide();
        $($('.taskLI input').get(index)).show();

        $($('.taskLI input').get(index)).val(initText);
        $($('.taskLI input').get(index)).focus();
    }

    function exitEditMode(){
        $('.taskLI span').show();
        $('.taskLI input').hide();
    }

    function enterPressedOnEditedItem(e){
        //Only proceed if enter was pressed
        if(e.which != 13)
            return;
        
        var index = $('.taskLI').index($(this).parent());
        var taskToBeEdited = taskList.tasks[index];

        var newText = $(this).val();

        taskToBeEdited.text = newText;
        saveToLocalStorage();

        exitEditMode();
        _render();        
    }

    function _render(){
        var rendered = Mustache.render(tasksTemplate, taskList);
        $tasksDiv.html(rendered);
    }

})()