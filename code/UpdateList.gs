 var sheetId = 'Replace this with the ID of your Google Sheet';
 
 function updateFileListInSheet() {
   var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
   var searchQuery = 'title contains "#expire"';
   var files = DriveApp.searchFiles(searchQuery);
   var dataToAdd = [];
 
   while (files.hasNext()) {
     var file = files.next();
     dataToAdd.push([file.getId(), file.getName(), file.getDateCreated().toDateString()]);
   }
 
   if (dataToAdd.length > 0) {
     var startRow = sheet.getLastRow() + 1;
     var numRows = dataToAdd.length;
     var numColumns = dataToAdd[0].length;
     sheet.getRange(startRow, 1, numRows, numColumns).setValues(dataToAdd);
   }
 }