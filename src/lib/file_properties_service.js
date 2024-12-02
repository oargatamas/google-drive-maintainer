// V8 runtime
class File_properties_service {

  constructor() {
  }

  static getFileProperties(){
    return new File_properties_service();
  }

  getFile(propKey){
    const folder = DriveApp.getFolderById(DRIVE_CACHE_FOLDER);
    const fileName = propKey + '.json';
    const files = folder.getFilesByName(fileName);

    if(files.hasNext()){
      return files.next();
    }

    console.log('There is no cache file for "' + propKey + '". Creating one...');
    return folder.createFile(fileName,'');
  }


  setProperty(propKey, content){
    const cacheFile = this.getFile(propKey);

    cacheFile.setContent(content);
  }

  getProperty(propKey){
    const cacheFile = this.getFile(propKey);
    const content = cacheFile.getBlob().getDataAsString();
    return content === '' ? null : content;
  }

  deleteProperty(propKey){
    const cacheFile = this.getFile(propKey);
    Drive.Files.remove(cacheFile.getId());
  }
}

