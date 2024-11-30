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

function backupDriveFile(file, backupFolder, trash){
  const driveOwner ="oargat@medev.hu";
  const id = file.getId();

  const owner = file.getOwner();

  const folder = file.getParents().hasNext() ? file.getParents().next() : false;
  const folderName = folder ? folder.getName() : "/";
  
  /*if(folder){
    console.log(id + "|" +" Folder location: " + folder.getUrl());
  }else{
    console.log(id + "|" +" No Folder location stored. File is stored on drive root.");
  }*/

  if(owner.getEmail() !== driveOwner){
    console.log(id + "|" + folderName + "/"+file.getName()+ "' is not ours. Old id: " + file.getId() + " Creating owned copy and deleting old one.");

    const copy = file.makeCopy();
    file.moveTo(trash);
    console.log(id + "|" +" New id: " + copy.getId());
  }
  /*else{
    console.log(id + "|" + " '" + file.getName() + "' is already ours.");
  }*/

  if(!backupFolder.getFilesByName(file.getName()).hasNext()){
    console.log("'"+file.getName()+"' NOT existing in backup folder. Copying it now.");
    const backupCopy = makeItemPrivate(file.makeCopy(backupFolder));
    console.log(id + "| Backup file id: " + backupCopy.getId());
  }
  /*
  else{
    console.log(id + "|" + folderName + "/"+file.getName()+" ALREADY existing in backup folder.");
  }
  */
}