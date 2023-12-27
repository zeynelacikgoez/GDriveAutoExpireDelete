 function deleteExpiredFiles() {
   var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
   var data = sheet.getDataRange().getValues();
   var currentDate = new Date();
 
   for (var i = data.length - 1; i >= 1; i--) { 
     var row = data[i];
     var fileId = row[0];
     var fileName = row[1];
     var fileCreatedDate = new Date(row[2]);
     var expireInfo = fileName.match(/#expire(\d+)/);
 
     if (expireInfo) {
       var daysToExpire = parseInt(expireInfo[1], 10);
       var fileAge = (currentDate - fileCreatedDate) / (24 * 3600 * 1000);
 
       if (fileAge > daysToExpire) {
         DriveApp.getFileById(fileId).setTrashed(true);
         sheet.deleteRow(i + 1); 
       }
     }
   }
 }