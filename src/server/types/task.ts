/**
 * Task page type
 */
export enum TaskPageType {
    'NORMAL'= 1,
    'SINGLE_PAGE'= 2,
}

/**
 * Task Type
 */
export enum TaskType {
    TYPE_DATA = 1, // Data action
    TYPE_DOM = 2, // DOM action
    TYPE_EVENT = 3, // EVENT listener
    TYPE_TIME = 4, // Time action
    TYPE_PAGE = 5, // Page action
}

/**
 * Task Subtype
 */
export type TaskSubType = TaskTypeDataSubType | TaskTypeDomSubType | TaskTypeEventSubType | TaskTypeTimeSubType | TaskTypePageSubType;

// Task sub type
/**
 * Sub type: Data
 */
export enum TaskTypeDataSubType {
    SUB_TYPE_MYSQL = 100, // Exec MySQL Query
    SUB_TYPE_REDIS = 101, // Exec Redis command
}

/**
 * Sub type: Dom
 */
export enum TaskTypeDomSubType {
    SUB_TYPE_KEYBOARD = 200, // Input some text
    SUB_TYPE_SET_ATTR = 201, // Set selector's attribute value
    SUB_TYPE_GET_ATTR = 202, // Get selector's attribute value
    SUB_TYPE_GET_HTML = 203, // Get selector's HTML content
    SUB_TYPE_GET_TEXT = 204, // Get selector's text content
    SUB_TYPE_CLICK = 205, // Click with selector
    // TODO
    // SUB_TYPE_SET_INPUT_FILES = 206, // Set file input's "files" value
}

/**
 * Sub type: Event
 */
export enum TaskTypeEventSubType {
    SUB_TYPE_REQUEST = 300, // Request listener
    SUB_TYPE_RESPONSE = 301, // Response listener
    SUB_TYPE_CONSOLE = 302, // Console listener
    SUB_TYPE_DIALOG = 303, // Dialog listener
}

/**
 * Sub type: Time
 */
export enum TaskTypeTimeSubType {
    SUB_TYPE_SET_SLEEP = 400, // Sleep
}

/**
 * Sub type: Page
 */
export enum TaskTypePageSubType {
    SUB_TYPE_RELOAD = 500, // Reload Page
    // TODO
    // SUB_TYPE_SET_COOKIE = 501, // Set cookies
    // SUB_TYPE_GET_COOKIE = 502, // Get cookies
    // SUB_TYPE_DELETE_COOKIE = 503, // Delete cookies
    SUB_TYPE_GOTO = 504, // Redirect to target url
    // TODO
    // SUB_TYPE_SCREENSHOT = 505, // Take a screenshot
}
