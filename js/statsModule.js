var stats = (function(){
    var statsData = {};

    var $statsDiv = $('#startDiv #statsDiv');
    var statsTemplate = $('#statsTemplate').html();

    pubSub.on('tasksChanged', function(tasks){
        statsData.allTasksCount = tasks.length;
        statsData.starredTasksCount = tasks.filter(t => t.isStarred).length;
        statsData.completedTasksCount = tasks.filter(t => t.isDone).length;

        _render();
    })

    function _render(){
        var rendered = Mustache.render(statsTemplate, statsData);
        $statsDiv.html(rendered);
    }
})();