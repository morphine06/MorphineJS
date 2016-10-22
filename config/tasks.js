module.exports = {
    livereloadPort: 35729,
    livereloadExtensions: ['ejs', 'html', 'css', 'js', 'es6', 'png', 'gif', 'jpg', 'php', 'php5', 'py', 'rb', 'erb', 'coffee'],
    tasksOnStartDev: ['delete', 'copy', 'webpack', 'jst', 'less', 'watch'], //'ifempty:webpack','delete', 'webpack', 'less', 'jst',
    tasksOnStartProd: ['delete', 'copy', 'webpack', 'jst', 'less', 'compile-scripts', 'compile-styles'],
    watch: [
        {
            dirs: [ "assets/js/**/*" ],
            tasks: ['webpack', 'livereload']
        // }, {
        //     dirs: [ "tasks/packages.js" ],
        //     tasks: ['webpack', 'less', 'jst', 'livereload']
        }, {
            dirs: [ "assets/css/**/*.less" ],
            tasks: ['less', 'livereload']
        }, {
            dirs: [ "assets/css/**/*.css" ],
            tasks: ['livereload']
        }, {
            dirs: [ "assets/images/**/*" ],
            tasks: ['livereload']
        }, {
            dirs: [ "assets/templates/**/*" ],
            tasks: ['jst', 'livereload']
        }, {
            dirs: [ "views/**/*" ],
            tasks: ['livereload']
        }, {
            restart: true,
            dirs: [ 'config/**/*', 'controllers/**/*', 'libs/**/*', 'models/**/*', 'services/**/*', 'tasks/**/*' ],
            // tasks: ['killapp']
        }
    ]
} ;