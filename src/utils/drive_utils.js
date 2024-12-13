function getFolder(parentFolder, folderName) {
    const folders = parentFolder.getFolders();
    while (folders.hasNext()) {
        const folder = folders.next();
        if (folderName === folder.getName()) {
            //console.log("Found folder of '" + folderName + "' in '" + parentFolder.getName()+"' id: " + folder.getId());
            return folder;
        }
    }
    console.log("Folder '" + folderName + "' NOT found in '" + parentFolder.getName() + "'. Creating it");
    const newFolder = parentFolder.createFolder(folderName);
    console.log("Folder '" + folderName + "' CREATED in '" + parentFolder.getName() + "' id: " + newFolder.getId());

    return newFolder;
}

function getParents(driveItem) {
    const parents = [];
    const mapper = item => ({
        id: item.getId(),
        name: item.getName(),
    });

    let folders = driveItem.getParents();
    while (folders.hasNext()) {
        let folder = folders.next();
        parents.push(mapper(folder));
        folders = folder.getParents();
    }

    return parents.reverse()
}

function backupDriveFolder(folderToBackup, backupFolder) {
    console.log("Creating backup from folder " + folderToBackup.getName());
    const trash = DriveApp.getFolderById("1EvJWH9jVwOTwNdusxirbkgOXXpdmAA69");

    const files = folderToBackup.getFiles();
    while(files.hasNext()){
        const file = files.next();
        backupDriveFile(file, backupFolder, trash);
    }
    console.log("Backup for " + folderToBackup.getName() + " finished successfully.");
}

function backupDriveFile(file, backupFolder){
    const id = file.getId();

    if(!backupFolder.getFilesByName(file.getName()).hasNext()){
        console.log("'"+file.getName()+"' NOT existing in backup folder. Copying it now.");
        const backupCopy = makeItemPrivate(file.makeCopy(backupFolder));
        console.log(id + "| Backup file id: " + backupCopy.getId());
    }
}