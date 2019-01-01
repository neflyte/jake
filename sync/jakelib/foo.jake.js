const jake = require('jake');
const { execSync } = require('child_process');

namespace('foo', () => {

    desc('bar');
    task('bar', [], () => {
        let execOutput;
        try {
            execOutput = execSync(`/opt/local/bin/bash -c 'sleep 2 && echo -n "BAR"'`);
        } catch (e) {
            jake.logger.error('error in bar' + e);
            fail('error in bar');
        }
        jake.logger.log(`bar output: ${execOutput}`);
    });

    desc('baz');
    task('baz', [], () => {
        let execOutput;
        try {
            execOutput = execSync(`/opt/local/bin/bash -c 'sleep 2 && echo -n "BAZ"'`);
        } catch (e) {
            jake.logger.error('error in baz' + e);
            fail('error in baz');
        }
        jake.logger.log(`baz output: ${execOutput}`);
    });

    desc('fnord');
    task('fnord', ['bar','baz'], () => {
        jake.logger.log('fnord after bar and baz');
    }, { syncPrereqs: true });

});