function makeItemPrivate(item) {
    try {
        item.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.NONE)
        item.getViewers()?.forEach(viewer => item.removeViewer(viewer));
        item.getEditors()?.forEach(editor => item.removeEditor(editor));
    } catch (e) {
        console.error(item.getName() + "(" + item.getId() + ") cannot be set to private: ", e);
    }
    return item;
}

function isFolderWhitelisted(folder, parents, whitelist) {
    const parentIds = parents.map(item => item.id);
    const parentsWhiteListed = whitelist.filter(validId => parentIds.includes(validId)).length > 0;
    const folderWhiteListed = whitelist.includes(folder.getId());
    return folderWhiteListed || parentsWhiteListed;
}