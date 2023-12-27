var sheetId = 'Replace this with the ID of your Google Sheet';

function updateExpiryDatesInSheet() {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var fileId = row[0];
    var file;

    try {
      file = DriveApp.getFileById(fileId);
    } catch (e) {
      continue;
    }

    var fileName = file.getName();
    var expireMatch = fileName.match(/#(deletein|expire)(\d+)/);
    var sheetExpireDate = row[3];

    if (expireMatch && expireMatch[2] !== sheetExpireDate) {
      // Aktualisieren des Ablaufdatums im Sheet
      sheet.getRange(i + 1, 4).setValue(expireMatch[2]);
    }
  }
}
