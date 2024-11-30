function collectAllSubfoldersIteratively() {
  const parentFolderId = "YOUR_PARENT_FOLDER_ID"; // Replace with your parent folder ID
  const spreadsheetId = "1PfWaoRbbjPwWB9rcqHk6Fp7pQoWQjlDOWIz7HdU_4l0"; // Replace with your Google Sheet ID
  const sheetName = "FolderRegistry";

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  const targetFolderIds = new Set([parentFolderId]);
  const allFolders = DriveApp.getFolders();
  const results = [];

  while (allFolders.hasNext()) {
    const folder = allFolders.next();
    const parents = folder.getParents();
    let isChild = false;

    while (parents.hasNext()) {
      const parent = parents.next();
      if (targetFolderIds.has(parent.getId())) {
        isChild = true;
        results.push({
          name: folder.getName(),
          id: folder.getId(),
          parentName: parent.getName(),
          parentId: parent.getId()
        });
        targetFolderIds.add(folder.getId());
        break; // No need to check more parents
      }
    }
  }

  const rows = results.map(folder => [
    folder.name,
    folder.id,
    folder.parentName,
    folder.parentId
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}
