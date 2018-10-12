import config from './modules/config';
import {app} from './modules/util';

// Set prepend filter
import './filters/prepend';

// Set append filter
import './filters/append';

app.listen(config.port, (err) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});
