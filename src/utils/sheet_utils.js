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
    return sheet.appendRow(attrs);
}

function searchInSheet(sheet, searchTerm) {
    const search = sheet.createTextFinder(searchTerm)
        .findNext();
    if (!search) {
        return search;
    }
    return sheet.getRange(search.getRowIndex(), 1, 1, 6);
}


function logRecordTouch(sheet, item_id){
    const result = searchInSheet(sheet, item_id);

    const item_info = result.getValues();
    item_info[0][4] = TRUE;
    item_info[0][5] = (new Date()).toLocaleString();
    result.setValues(item_info);
}
