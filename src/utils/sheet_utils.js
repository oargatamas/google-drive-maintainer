function getFolderInfo(sheet, folder) {
    return searchInSheet(sheet, folder.getId());
}

function getFileInfo(sheet, file) {
    return searchInSheet(sheet, file.getId());
}

function openRegistrySheet(sheetName) {
    return SpreadsheetApp.openById(FILE_REGISTRY_ID).getSheetByName(sheetName);
}

function registerItem(sheet, attrs) {
    return sheet.appendRow(attrs)
        .getDataRange();
}

function searchInSheet(sheet, searchTerm) {
    return sheet.createTextFinder(searchTerm)
        .findNext();
}

