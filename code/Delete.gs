var sheetId = 'Replace this with the ID of your Google Sheet';

function deleteExpiredFiles() {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var currentDate = new Date();

  for (var i = data.length - 1; i >= 1; i--) {
    var row = data[i];
    var fileId = row[0];
    var fileName = row[1];
    var fileCreatedDate = new Date(row[2]);
    var sheetExpiryDate = new Date(row[3]);
    
    var expireMatch = parseExpiryTag(fileName);
    if (!expireMatch) {
      continue;
    }

    var calculatedExpiryDate = calculateExpiryDate(fileCreatedDate, expireMatch.amount, expireMatch.unit);

    if (currentDate >= calculatedExpiryDate) {
      try {
        DriveApp.getFileById(fileId).setTrashed(true);
        sheet.deleteRow(i + 1);
      } catch (e) {
        console.error('Error deleting the file: ' + e.message);
      }
    }
  }
}

