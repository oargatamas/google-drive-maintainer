function backupFiles() {
  const spreadsheetId = "YOUR_SPREADSHEET_ID"; // Replace with your Google Sheet ID
  const sheetName = "FileRegistry";
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const startTime = Date.now();

  let progress = loadBackupProgress(sheet);
  let currentRow = progress.currentRow || 1; // Start from the first data row (index 1)

  for (; currentRow < rows.length && Date.now() - startTime < TIME_LIMIT; currentRow++) {
    const [filename, fileId, parentFolderName, parentFolderId, dateOfCheck, archiveDate] = rows[currentRow];

    if (archiveDate) continue; // Skip already archived files

    const parentFolder = DriveApp.getFolderById(parentFolderId);
    const backupFolder = getOrCreateBackupFolder(parentFolder);
    const file = DriveApp.getFileById(fileId);

    // Step 2: Transfer ownership if necessary
    if (file.getOwner().getEmail() !== Session.getEffectiveUser().getEmail()) {
      const copiedFile = file.makeCopy(parentFolder);
      copyPermissions(file, copiedFile);
      file.setTrashed(true); // Delete the original
    }

    // Step 3: Ensure the file is in the backup folder
    if (!isFileInFolder(backupFolder, file)) {
      file.makeCopy(backupFolder);
    }

    // Update the archive date in the spreadsheet
    sheet.getRange(currentRow + 1, 6).setValue(new Date().toISOString());
  }

  saveBackupProgress(sheet, { currentRow });
}

function loadBackupProgress(sheet) {
  const metadata = sheet.getRange("A3").getValue();
  return metadata ? JSON.parse(metadata) : { currentRow: 1 };
}

function saveBackupProgress(sheet, progress) {
  sheet.getRange("A3").setValue(JSON.stringify(progress));
}
