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