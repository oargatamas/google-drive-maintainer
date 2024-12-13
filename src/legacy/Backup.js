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