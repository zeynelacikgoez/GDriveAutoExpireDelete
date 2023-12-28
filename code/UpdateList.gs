var sheetId = 'Replace this with the ID of your Google Sheet';

function updateFileListInSheet() {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var searchQuery = 'title contains "#expire"';
  var files = DriveApp.searchFiles(searchQuery);
  var dataToAdd = [];

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var expireInfo = parseExpiryTag(fileName);

    if (expireInfo) {
      var fileCreatedDate = file.getDateCreated();
      var expiryDate = calculateExpiryDate(fileCreatedDate, expireInfo.amount, expireInfo.unit);
      var newRowData = [file.getId(), fileName, fileCreatedDate.toDateString(), expiryDate.toDateString()];
      dataToAdd.push(newRowData);

      // Optional: Dateinamen aktualisieren, um das Tag zu ändern
      var newFileName = fileName.replace(/#expire\d+(d|w|m|y)?/, '#deletein' + expireInfo.amount + expireInfo.unit);
      file.setName(newFileName);
    }
  }

  if (dataToAdd.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    var numRows = dataToAdd.length;
    var numColumns = dataToAdd[0].length;
    sheet.getRange(startRow, 1, numRows, numColumns).setValues(dataToAdd);
  }
}

function parseExpiryTag(fileName) {
  var match = fileName.match(/#expire(\d+)(d|w|m|y)?/);
  if (match) {
    var amount = parseInt(match[1], 10);
    var unit = match[2] || 'd'; 
    return { amount, unit };
  }
  return null;
}

function calculateExpiryDate(createdDate, amount, unit) {
  var expiryDate = new Date(createdDate);
  switch (unit) {
    case 'd': // Tage
      expiryDate.setDate(expiryDate.getDate() + amount);
      break;
    case 'w': // Wochen
      expiryDate.setDate(expiryDate.getDate() + amount * 7);
      break;
    case 'm': // Monate
      expiryDate.setMonth(expiryDate.getMonth() + amount);
      break;
    case 'y': // Jahre
      expiryDate.setFullYear(expiryDate.getFullYear() + amount);
      break;
  }
  return expiryDate;
}
