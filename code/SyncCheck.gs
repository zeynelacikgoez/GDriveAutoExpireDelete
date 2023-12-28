var sheetId = 'Replace this with the ID of your Google Sheet';

function updateExpiryDatesAndCheckTags() {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var data = sheet.getDataRange().getValues();

  for (var i = data.length - 1; i >= 1; i--) {
    var row = data[i];
    var fileId = row[0];
    var file;

    try {
      file = DriveApp.getFileById(fileId);
    } catch (e) {
      continue;
    }

    var fileName = file.getName();
    var expiryTag = parseExpiryTag(fileName);

    if (expiryTag) {
      var fileCreatedDate = new Date(row[2]);
      var calculatedExpiryDate = calculateExpiryDate(fileCreatedDate, expiryTag.amount, expiryTag.unit);
      var sheetExpiryDate = new Date(row[3]);

      if (calculatedExpiryDate.getTime() !== sheetExpiryDate.getTime()) {
        sheet.getRange(i + 1, 4).setValue(calculatedExpiryDate.toDateString());
      }
    } else {
      sheet.deleteRow(i + 1);
    }
  }
}
