const jake = require('jake');

task('default', [], () => {

});

task('build', [], () => {
    let t = jake.Task['foo:fnord'];
    jake.logger.log('invoking foo:fnord');
    t.runPrereqs();
    jake.logger.log('done invoking foo:fnord');
});
