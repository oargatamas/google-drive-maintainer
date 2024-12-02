function tests(){
  const item = DriveApp.getFolderById("1uflvEkzz7isM2ZdbeGCxcfboFZfg9xr9");

  item.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.NONE);

  console.log(item.getViewers());
  console.log(item.getEditors());

  console.log(item.getSharingAccess().toString());

  item.getViewers()?.forEach(viewer => console.log(viewer));
  item.getEditors()?.forEach(editor => console.log(editor));

}

function testSearchQuery() {
  var files = DriveApp.getFolderById('1Jw3MCQUvPIiKVUcfS9-XbsfDvqRxrr2S');
  console.log(files.getViewers().map(item => item.getEmail()));
  console.log(files.getEditors().map(item => item.getEmail()));
}

function testExecLimitSafeIterator(){
  const options = {
    iterationTokenKey : "tests-long-run-iteration",
    iterator: () => DriveApp.getFolderById("1PznvZiHch_GaAqj8lGYawjCUMrbhNlgD").getFolders(),
    maxTime: 1000*5*1, // 10 sec;
  };

  let count = 0;
  const processor = item => {
    count++;
    console.log("iteration run: " + count + " item name: " + item.getName() + " Id: " + item.getId());
  };

  exec_limit_safe_iterator(options, processor);
  console.log("Iteration interrupted by the timeout. Iteration count: " + count);
  exec_limit_safe_iterator(options, processor);
  console.log("Iteration tests finished: " + count);
}


function testFolderWhitelistMethod(){
  //Setup
  const whiteList = [
    "1PznvZiHch_GaAqj8lGYawjCUMrbhNlgD" //Bodrogi szinkron mappa
  ];

  //Valid case
  const validFolderToTest = DriveApp.getFolderById("1qdmAQoLsNvntE5W30Ptyr_BBYC5ddoix");
  const validParents = getFolderParents(validFolderToTest);
  console.log(isFolderWhitelisted(validFolderToTest, validParents, whiteList));

  //Invalid case
  const inValidFolderToTest = DriveApp.getFolderById("1vnAoaVRBf8cAXR9mWFdsP2ph9QBKUyVs");
  const inValidParents = getFolderParents(inValidFolderToTest);
  console.log(isFolderWhitelisted(inValidFolderToTest, inValidParents, whiteList));
}

function testFolderParentRetrieval(){
  const folderToTest = DriveApp.getFolderById("1qdmAQoLsNvntE5W30Ptyr_BBYC5ddoix");
  const parents = getFolderParents(folderToTest);

  console.log(parents);
}

function countFoldersInDrive(){
  const folders = DriveApp.searchFolders('"tollar.benjamin92@gmail.com" in writers or "bensteelkft@gmail.com" in writers or "tollar.benjamin92@gmail.com" in readers or "bensteelkft@gmail.com" in readers');
  let count = 0;
  while(folders.hasNext()){
    count++;
  }

  console.log("Folder count in drive: " + count);
}

function testDriveIterator(){
  //const iterator = DriveApp.getFolderById("17dxhkB-HP0R4C4RHLK4dLqEqy_z2AhrU").getFolders();
  const iterator = DriveApp.continueFolderIterator("CqYBCngobWltZVR5cGU9J2FwcGxpY2F0aW9uL3ZuZC5nb29nbGUtYXBwcy5mb2xkZXInKSBhbmQgKHRyYXNoZWQ9ZmFsc2UpIGFuZCAoJzE3ZHhoa0ItSFAwUjRDNFJITEs0ZExxRXF5X3oyQWhyVScgaW4gcGFyZW50cykaACDJzOrcwDEqITFZVmQzNEpQajNkYkRkNEZOU2ZJZHVjcWJRc2F4SkYyUg");
  let i = 0;
  const limit = 1;
  console.log(iterator.getContinuationToken());
  while(iterator.hasNext() && i < limit){
    console.log(iterator.next().getName());
    i++;
  }
  console.log(iterator.getContinuationToken());
}
