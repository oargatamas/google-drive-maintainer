function collect_folders(){
    console.time("collect_folders");
    console.log("Start scan files process");

    const options = {
        iterationTokenKey : "scan-root-files",
        iterator: () => DriveApp.getFolders(),
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

    exec_limit_safe_iterator(options,(folder)=> {
        // Check parents chain if it should be registered or not
        // Add folder to a staging sheet
        // Once the operation done call the Google sheet to eliminate duplications
    });

    console.timeEnd("collect_folders");
}

function collect_files(){
    console.time("collect_files");
    console.log("Start scan files process");

    const options = {
        iterationTokenKey : "scan-root-files",
        iterator: () => null, // return an iterator which can fetch a predefined google sheet ( will be a mat view with the folders should be checked... )
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

    exec_limit_safe_iterator(options,(reg_entry)=> {
        // Check if the file archived
        // If not then archive it and switch the archived flag in the original FileReqistry
    });

    console.timeEnd("collect_files");
}

function collect_backup_folders(){
    console.time("collect_backup_folders");
    console.log("Start scan files process");

    const options = {
        iterationTokenKey : "scan-root-files",
        iterator: () => DriveApp.getFoldersByName(".backup"),
        maxTime: EXECUTION_LIMIT,
        useFileIterator: true,
    };

    exec_limit_safe_iterator(options,(folder)=> {
        // make sure that all the .backup folders have private access
    });

    console.timeEnd("collect_backup_folders");
}

