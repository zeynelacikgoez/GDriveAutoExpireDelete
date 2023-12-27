# GDriveAutoExpireDelete
GDriveAutoExpireDelete is an automated AppScript tool designed for managing Google Drive files. It deletes files based on expiration dates specified in the file names, ideal for efficient data management and organization.

## Step-by-Step Guide

### Step 1: Creating a Google Sheet
1. **Create a Google Sheet** in your Google Drive. For this example, name it "database".
2. **Create columns** for FileID, FileName, CreationDate, and ExpiryDate.
3. **Copy the SheetID** from the URL of your Google Sheet.
<img width="712" alt="Screenshot1" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d2322fd3-8b17-414c-ac17-9b9412f18191">

### Step 2: Setup and Configuration in Google AppScript
1. **Create a new project** in Google AppScript. Important: Avoid using the word "Expire" in the project name to prevent conflicts with the search algorithm.
2. **Create an additional script.**
<img width="390" alt="Screenshot3" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d52c5114-310e-496e-9492-f668826c4e5e">


#### Step 2.1: Renaming and Code for `Delete.gs`
1. Rename the new script to "Delete", so the file ends up as `Delete.gs`. Rename the existing `Code.gs` to `UpdateList.gs`.
2. **Insert the following code into `Delete.gs`:**
   ```javascript
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
    ```
3. **Insert the following code into `UpdateList.gs`:**
   ```javascript
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
    
      // Hinzufügen der gesammelten Daten in einem Batch-Vorgang
      if (dataToAdd.length > 0) {
        var startRow = sheet.getLastRow() + 1;
        var numRows = dataToAdd.length;
        var numColumns = dataToAdd[0].length;
        sheet.getRange(startRow, 1, numRows, numColumns).setValues(dataToAdd);
      }
    }
    ```
4. **Replace `Replace this with the ID of your Google Sheet` with the ID of the Google Sheet you copied earlier.**

<img width="1151" alt="Screenshot2" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d40bf9c0-d925-4da5-b63d-1cbd19866916">
