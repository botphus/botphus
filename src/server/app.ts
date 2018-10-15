import config from './modules/config';
import router from './modules/router';
import {app} from './modules/util';

// Set prepend filter
import './filters/prepend';

// Set append filter
import './filters/append';

router()
    .then(() => {
        app.listen(config.port, (err) => {
            if (err) {
                throw err;
            }
        });
    })
    .catch((err) => {
        app.log.error(err);
        process.exit(1);
    });
