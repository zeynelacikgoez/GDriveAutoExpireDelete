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
    case 'd':
      expiryDate.setDate(expiryDate.getDate() + amount);
      break;
    case 'w':
      expiryDate.setDate(expiryDate.getDate() + amount * 7);
      break;
    case 'm':
      expiryDate.setMonth(expiryDate.getMonth() + amount);
      break;
    case 'y':
      expiryDate.setFullYear(expiryDate.getFullYear() + amount);
      break;
  }
  return expiryDate;
}
