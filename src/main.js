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
            .map(parent => parent.id)
            .some(parentId => ROOT_FOLDERS.includes(parentId));

        console.log(shouldRegister);
        if(shouldRegister && !getFolderInfo(sheet, folder)){
            // Add folder to a staging sheet
            registerItem(sheet, mapFolder(folder));
        }else{
        }
    });

    console.timeEnd("collect_folders");
}

function collect_files() {
    console.time("collect_files");
    console.log("Start scan files process");

    const folders_sheet = openRegistrySheet(SHEET_FOLDERS);
    const files_sheet = openRegistrySheet(SHEET_FILES);

    const options = sheetItemIteratorOptions(folders_sheet,{
        iterationTokenKey: "collect_files",
    });

    exec_limit_safe_iterator(options, (folder_entry) => {
        const files = DriveApp.getFolderById(folder_entry[0]).getFiles();
        while(files.hasNext()){
            const file = files.next();
            const folder = file.getParents().next();
            // Check if the file is in the registry or not
            // If not then paste it with NOT_ARCHIVED flag
            if(!getFileInfo(files_sheet, file)){
                registerItem(files_sheet, mapFile(file, folder));
            }
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
        console.log(result.getValues());

        const file_info = result.getValues();
        file_info[0][4] = TRUE;
        file_info[0][5] = (new Date()).toLocaleString();
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

