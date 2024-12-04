function collect_folders() {
    console.time("collect_folders");
    console.log("Start scan files process");

    const options = driveFolderIteratorOptions({
        iterationTokenKey: "collect_folders",
    });

    const sheet = openRegistrySheet(SHEET_FOLDERS);

    exec_limit_safe_iterator(options, (folder) => {
        // Check parents chain if it should be registered or not
        const shouldRegister = getParents(folder)
            .map(parent =>parent.getId())
            .some(parentId => ROOT_FOLDERS.includes(parentId));

        if(shouldRegister && !getFolderInfo(sheet, folder)){
            // Add folder to a staging sheet
            registerItem(sheet, mapFolder(folder));
        }
    });

    console.timeEnd("collect_folders");
}

function collect_files() {
    console.time("collect_files");
    console.log("Start scan files process");

    const sheet = openRegistrySheet(SHEET_FILES);

    const options = sheetItemIteratorOptions(sheet,{
        iterationTokenKey: "collect_files",
    });

    exec_limit_safe_iterator(options, (folder_entry) => {
        // Check if the file is in the registry or not
        // If not then paste it with NOT_ARCHIVED flag
        const file = DriveApp.getFileById(folder_entry[0]);

        if(!getFileInfo(sheet, file)){
            registerItem(sheet, mapFile(file));
        }
    });

    console.timeEnd("collect_files");
}

function backup_files() {
    console.time("backup_files");
    console.log("Start scan files process");

    const files_sheet = openRegistrySheet(SHEET_FILES);
    const scheduled_sheet = openRegistrySheet(SHEET_SCHEDULED_FILES);
    const trash = DriveApp.getFolderById(TRASH_FOLDER);

    const options = sheetItemIteratorOptions(scheduled_sheet,{
        iterationTokenKey: "backup_files",
    });

    exec_limit_safe_iterator(options, (reg_entry) => {
        const file = DriveApp.getFileById(reg_entry[0]);
        const folder = file.getParents().next();
        const backupFolder = getFolder(folder, '.backup');

        backupDriveFile(file, backupFolder, trash);

        const result = searchInSheet(files_sheet, file.getId());
        const file_info = result.getValues();
        file_info[0][4] = true;
        file_info[0][5] = (new Date()).toDateString();
        result.setValues(file_info);
    });

    console.timeEnd("backup_files");
}

function collect_backup_folders() {
    console.time("collect_backup_folders");
    console.log("Start scan files process");

    const options = driveFolderIteratorOptions({
        iterationTokenKey: "collect_backup_folders",
        iterator: () => DriveApp.getFoldersByName(".backup")
    });

    exec_limit_safe_iterator(options, (folder) => {
        // make sure that all the .backup folders have private access
        makeItemPrivate(folder);
    });

    console.timeEnd("collect_backup_folders");
}

