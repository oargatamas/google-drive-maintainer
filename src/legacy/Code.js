 function scan(){
  console.time("scan");
  console.log("Start scan process");

  const options = {
    iterationTokenKey : "scan-root-folders",
    iterator: () => ROOT_FOLDERS.map(folder => DriveApp.getFolderById(folder).getFolders()),
    maxTime: getExecutionLimit(),
    enableSubFolderIteration : true,
  };
  
  exec_limit_safe_iterator(options,(item)=> {
    console.log("Processing folder of " + item.getName() + " Id: " + item.getId());
    if(item.getName() !== ".backup"){
      console.log("Folder is not a backup folder. Trying to create backup folder inside");
      makeItemPrivate(getFolder(item,".backup"));
    }
  });
  

  console.timeEnd("scan");
}

function backup(){
  console.time("backup");
  console.log("Start backup process iteration");

  const options = {
    iterationTokenKey : "backup-folder-contents",
    iterator: () => DriveApp.getFoldersByName(".backup"),
    maxTime: getExecutionLimit(),
  };
  
  exec_limit_safe_iterator(options,(item)=> {
    const parents = item.getParents()
    if(parents.hasNext()){
      const backupParentFolder = parents.next(); 
      console.log("Backup folder contents of " + backupParentFolder.getName() + " id: " + backupParentFolder.getId());
      backupDriveFolder(backupParentFolder, item);
    }else{
      console.log("Folder " + item.getId() +  " has no parent folder. Skipping the backup.")
    }
    
  });

  console.timeEnd("backup");
}


function backupPermissionDoubleCheck(){
  console.time("backup-permission");
  console.log("Start backup process permission doublecheck iteration");

  const options = {
    iterationTokenKey : "backup-folder-permission-doublecheck",
    iterator: () => DriveApp.getFoldersByName(".backup"),
    maxTime: getExecutionLimit(),
  };
  
  exec_limit_safe_iterator(options,(item)=> {
    console.log("Setting backup folder to private: " + item.getName() + " id: " + item.getId());
    item.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.NONE);
  });

  console.timeEnd("backup-permission");
}

function removePermission(){
  console.time("permission-remove");
  console.log("Start permission removal process iteration");

  const emailsToRemove = [
    'tollar.benjamin92@gmail.com',
    'Bensteelkft@gmail.com',
  ];

  const searchString = emailsToRemove
      .map(email => '"'+email+'" in writers or "'+email + '" in readers')
      .join(" or ");

  console.log("Search String: " + searchString);

  const options = {
    iterationTokenKey : "permission-remove",
    iterator: () => DriveApp.searchFolders(searchString),  
    maxTime: getExecutionLimit(),
  };

  exec_limit_safe_iterator(options,(item)=> {
    console.log("Removing access from : " + item.getName() + " id: " + item.getId());
    emailsToRemove.forEach(email => {
      try {
        if (item.getViewers().find(e => e.getEmail().toUpperCase() == email.toUpperCase())) {
          item.removeViewer(email);
        }
        if (item.getEditors().find(e => e.getEmail().toUpperCase() == email.toUpperCase())) {
          item.removeEditor(email);
        }
      } catch (e) {
        console.log(e)
      }
    });
  });

  console.timeEnd("permission-remove");
}


function resetFileSharingOptions(){
  console.time("reset-file-sharing-details");
  console.log("Start file sharing reset process iteration");

  const options = {
    iterationTokenKey : "reset-file-sharing-details",
    iterator: () => DriveApp.searchFiles('"oargat@medev.hu" in owners'),  
    maxTime: getExecutionLimit(),
    useFileIterator: true,
  };

  exec_limit_safe_iterator(options,(item)=> {
    console.log("Reset sharing details of : " + item.getName() + " id: " + item.getId());
    console.log("Owner is : " + item.getOwner().getEmail() + " mimeType: " + item.getMimeType());
    if(item.getMimeType() === "application/vnd.google-apps.shortcut"){
      console.log("File is shortcut therefore it cannot be shared to set to private.");
    }else{
      item.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.NONE);
	    item.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.NONE);
    }
  });

  console.timeEnd("reset-file-sharing-details");
}


function resetFolderSharingOptions(){
  console.time("reset-folder-sharing-details");
  console.log("Start folder sharing reset process iteration");

  const options = {
    iterationTokenKey : "reset-folder-sharing-details",
    iterator: () => DriveApp.searchFolders('"oargat@medev.hu" in owners'),  
    maxTime: getExecutionLimit(),
  };

  exec_limit_safe_iterator(options,(item)=> {
    console.log("Reset sharing details of : " + item.getName() + " id: " + item.getId());
    console.log("Owner is : " + item.getOwner().getEmail());
    item.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.NONE);
	  item.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.NONE);
  });

  console.timeEnd("reset-folder-sharing-details");
}