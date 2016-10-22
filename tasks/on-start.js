"use strict";

module.exports = (cb)=> {

    var what = morphineserver.config.tasks.tasksOnStartProd ;
    if (morphineserver.config.environment=='development') what = morphineserver.config.tasks.tasksOnStartDev ;
    morphineserver.launchTasks(what, ()=> {
        cb() ;
    }) ;
} ;