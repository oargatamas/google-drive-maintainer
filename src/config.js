EXECUTION_LIMIT = 1000 * 60 * 4; // Max safe time, 4 minutes
DRIVE_CACHE_FOLDER = '1TjDiBOq8lZhYzUz9UtiDNqSO9pX9_X-1';
TRASH_FOLDER = "1EvJWH9jVwOTwNdusxirbkgOXXpdmAA69";

ROOT_FOLDERS = [
    "1PznvZiHch_GaAqj8lGYawjCUMrbhNlgD", // "BDF SZINKRON MAPPA"
    "1powhwRx9j-DcJPjnXccEWmKF2rRu4bT1", // "Bodrogi Ferenc mappája"
    "12WZMaMtHajCzDNokQWJLs07oQdg0EXMB", // "MVM Optimum"
    "1tB0NltYDiPOzg39jLIhzgSj85BomoVr5", // "Medev Solar"
];

FILE_REGISTRY_ID = '1PfWaoRbbjPwWB9rcqHk6Fp7pQoWQjlDOWIz7HdU_4l0';
SHEET_FILES = 'FILES';
SHEET_FOLDERS = 'FOLDERS';
SHEET_SCHEDULED_FILES = 'SCHEDULED_FILES';
SHEET_SCHEDULED_FOLDERS = 'SCHEDULED_FOLDERS';

TRUE=1
FALSE=0


const iteratorOptionsBase = {
    maxTime: EXECUTION_LIMIT,
    enableSubFolderIteration: false,
}

const driveFolderIteratorOptions = (options) => {
    return Object.assign({}, iteratorOptionsBase, {
        mode: "DriveFile",
        iterator: () => DriveApp.getFolders(),
        continueIterator: (token) => DriveApp.continueFolderIterator(token),
    }, options)
}

const driveFileIteratorOptions = (options) => {
    return Object.assign({}, iteratorOptionsBase, {
        mode: "DriveFolder",
        iterator: () => DriveApp.getFiles(),
        continueIterator: (token) => DriveApp.continueFileIterator(token),
    }, options)
}

const sheetItemIteratorOptions = (sheet, options = {}) => {
    return Object.assign({}, iteratorOptionsBase, {
        mode: "SheetItem_" + sheet.getName(),
        iterator: () => new SheetRowIterator(sheet),
        continueIterator: (token) => new SheetRowIterator(sheet, token),
    }, options)
}