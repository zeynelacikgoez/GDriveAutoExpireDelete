var sheetId = 'Replace this with the ID of your Google Sheet';

function updateFileListInSheet() {
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  var searchQuery = 'title contains "#expire"';
  var files = DriveApp.searchFiles(searchQuery);
  var dataToAdd = [];

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var expireInfo = fileName.match(/#expire(\d+)/);

    if (expireInfo) {
      var daysToExpire = expireInfo[1];
      var newRowData = [file.getId(), fileName, file.getDateCreated().toDateString(), daysToExpire];
      dataToAdd.push(newRowData);

      var newFileName = fileName.replace('#expire', '#deletein');
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
