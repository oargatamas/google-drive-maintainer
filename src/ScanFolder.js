function scanFolder_old(folder, start, maxTime, callback) {
  console.log("Scanning folders of " + folder.getName() + " ...")
  const properties = PropertiesService.getScriptProperties();

  // Iterate folders
  const tokenKey = 'iter:' + folder.getId() + ':folders';
  const continuationToken = properties.getProperty(tokenKey);
  console.log("Iteration token: ", continuationToken);
  const folders = continuationToken == null ? folder.getFolders() : DriveApp.continueFolderIterator(continuationToken);

  let end = new Date();

  while(folders.hasNext() && end.getTime() - start.getTime() <= maxTime) {
    const _folder = folders.next();
    //console.log("Folder " + _folder.getName());
    
    callback('folder', _folder);
    scanFolder(_folder, start, maxTime, callback);

    end = new Date();
  }

  if(folders.hasNext()){
    console.log("Time execution limit reached. Saving iteration state to continuation token.")
    properties.setProperty(tokenKey, folders.getContinuationToken());
  } else {
    console.log("Iteration finished. Removing continuation token.")
    properties.deleteProperty(tokenKey);
  }

  //console.log("Scanning of " + folder.getName() + " finished.");
}

function scanFolder(whiteList){
  console.log("Scanning folders of " + folder.getName() + " ...")
  const properties = PropertiesService.getScriptProperties();

  // Iterate folders
  const tokenKey = 'scan-folder-iterator';
  const continuationToken = properties.getProperty(tokenKey);
  console.log("Iteration token: ", continuationToken);
  const iterator = continuationToken == null ? DriveApp.getFolders() : DriveApp.continueFolderIterator(continuationToken);

  let end = new Date();

  while(iterator.hasNext() && end.getTime() - start.getTime() <= maxTime) {
    const _folder = iterator.next();
    
    const _parents = getFolderParents(_folder);
    if(isFolderWhitelisted(_folder, _parents, whiteList)){
      console.log("Folder " + _folder.getId() + " is in the whitelisted params. Checking for backup folder.");
      if(_folder.getName() !== ".backup"){
        console.log("Creating backup folder for " + _folder.getId());
        makeItemPrivate(getFolder(_folder,".backup"));
      }
    }

    end = new Date();
  }

  if(iterator.hasNext()){
    console.log("Time execution limit reached. Saving iteration state to continuation token.")
    properties.setProperty(tokenKey, iterator.getContinuationToken());
  } else {
    console.log("Iteration finished. Removing continuation token.")
    properties.deleteProperty(tokenKey);
  }
}

