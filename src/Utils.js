function execLimitSafeIterator(options, itemProcessor){
  const properties = FilePropertiesService.getFileProperties();
  const tokenKey = options.iterationTokenKey;
  const prefix = [tokenKey, ' - '].join('');
  const mode = options.useFileIterator ? "FILE" : "FOLDER";
  const continuationToken = properties.getProperty(tokenKey);
  console.log(prefix + "Iteration token: " + continuationToken);

  const maxTime = options.maxTime;
  const start = new Date();
  let end = new Date();

  let iterator;
  
  if(continuationToken == null ){
    console.log(prefix + "No continuation token set for the execution. Initalising new iteration. Mode " + mode);
    iterator = options.useFileIterator ? IteratorCollection.fileIterator() : IteratorCollection.folderIterator();
    iterator.addIterator(options.iterator());
  }else{
    console.log(prefix + "Continue previous iteration. Mode " + mode);
    iterator = options.useFileIterator ? IteratorCollection.continueFileIterator(continuationToken) : IteratorCollection.continueFolderIterator(continuationToken);
  }

  while (iterator.hasNext() && end.getTime() - start.getTime() <= maxTime) {
    const item = iterator.next();
    itemProcessor(item);

    if(!options.useFileIterator && options.enableSubFolderIteration && item.getFolders().hasNext()){
      console.log("Subfolder iteration enabled and folder " + item.getName() + " - " + item.getId() +  " has subfolder. Extending iteration set.");
      iterator.addIterator(item.getFolders());
    }

    end = new Date();
  }

  if(iterator.hasNext()){
    console.log(prefix + "Time execution limit reached. Saving iteration state to continuation token.")
    properties.setProperty(tokenKey, iterator.getContinuationToken());
  } else {
    console.log(prefix + "Iteration finished. Removing continuation token.")
    properties.deleteProperty(tokenKey);
  }
}

function getFolder(parentFolder,folderName){
  const folders = parentFolder.getFolders();     
  while (folders.hasNext()) {
    const folder = folders.next();
    if(folderName == folder.getName()) {
      //console.log("Found folder of '" + folderName + "' in '" + parentFolder.getName()+"' id: " + folder.getId());         
      return folder;
    }
  }
  console.log("Folder '" + folderName + "' NOT found in '" + parentFolder.getName()+"'. Creating it");
  const newFolder = parentFolder.createFolder(folderName);
  console.log("Folder '" + folderName + "' CREATED in '" + parentFolder.getName()+"' id: " + newFolder.getId()); 

  return newFolder;
}

function isFolderWhitelisted(folder, parents, whitelist){
  const parentIds = parents.map(item => item.id);
  const parentsWhiteListed = whitelist.filter(validId => parentIds.includes(validId)).length > 0;
  const folderWhiteListed = whitelist.includes(folder.getId());
  return folderWhiteListed || parentsWhiteListed;
}

function getFolderParents(folder){
  const parents = [];
  const mapper = folder => ({
    id : folder.getId(),
    name: folder.getName(),
  });

  let folders = folder.getParents();
  while (folders.hasNext()) {
    let folder = folders.next();
    parents.push(mapper(folder));
    folders = folder.getParents();
  }

  return parents.reverse()
}

function makeItemPrivate(item){
  try{
    item.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.NONE)
    item.getViewers()?.forEach(viewer => item.removeViewer(viewer));
    item.getEditors()?.forEach(editor => item.removeEditor(editor));
  }catch(e){
    console.error(item.getName()+"("+ item.getId() + ") cannot be set to private: ",e);
  }finally{
    return item;
  }
}

function getExecutionLimit(){
  return 1000*60*4.5; // Max safe time, 4.5 mins;
  //return 2000; // 1 sec
}

function clearProps(){
  PropertiesService.getScriptProperties().deleteAllProperties();
  PropertiesService.getUserProperties().deleteAllProperties();
}


