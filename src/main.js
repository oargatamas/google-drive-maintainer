function collect_folders() {
    console.time("collect_folders");
    console.log("Start scan files process");

    const options = {
        iterationTokenKey: "scan-root-files",
        iterator: () => DriveApp.getFolders(),
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

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

    const options = {
        iterationTokenKey: "scan-root-files",
        iterator: () => null,
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

    const sheet = openRegistrySheet(SHEET_FILES);

    exec_limit_safe_iterator(options, (folder_entry) => {
        // Check if the file is in the registry or not
        // If not then paste it with NOT_ARCHIVED flag
        const file = DriveApp.getFileById(folder_entry[0]);

        if(!getFileInfo(sheet, file)){
            registerItem(sheet, mapFile(file));
        }
        //Todo introduce an an iteration state counter
        //Todo also write something what can reset the counter if hit the end of list
    });

    console.timeEnd("collect_files");
}

function backup_files() {
    console.time("collect_files");
    console.log("Start scan files process");

    const options = {
        iterationTokenKey: "scan-root-files",
        iterator: () => null, // return an iterator which can fetch a predefined google sheet ( will be a mat view with the folders should be checked... )
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

    exec_limit_safe_iterator(options, (reg_entry) => {
        // Check if the file archived
        // If not then archive it and switch the archived flag in the original FileReqistry
    });

    console.timeEnd("collect_files");
}

function collect_backup_folders() {
    console.time("collect_backup_folders");
    console.log("Start scan files process");

    const options = {
        iterationTokenKey: "scan-root-files",
        iterator: () => DriveApp.getFoldersByName(".backup"),
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

    exec_limit_safe_iterator(options, (folder) => {
        // make sure that all the .backup folders have private access
    });

    console.timeEnd("collect_backup_folders");
}

