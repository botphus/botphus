import router from './modules/router';

// Set prepend filter
import './filters/prepend';

// Set append filter
import './filters/append';

export default function(): Promise<void> {
    return router();
}
