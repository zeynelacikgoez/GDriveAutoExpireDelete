# GDriveAutoExpireDelete
GDriveAutoExpireDelete is an automated AppScript tool designed for managing Google Drive files. It deletes files based on expiration dates specified in the file names, ideal for efficient data management and organization.

## Step-by-Step Guide

### Step 1: Creating a Google Sheet
1. **Create a Google Sheet** in your Google Drive. For this example, name it "database".
2. **Create columns** for FileID, FileName, CreationDate, and ExpiryDate.
<img width="1314" alt="Screenshot16" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e73a8376-6d15-4e8e-b058-3cf9e718701b">

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
    
      if (dataToAdd.length > 0) {
        var startRow = sheet.getLastRow() + 1;
        var numRows = dataToAdd.length;
        var numColumns = dataToAdd[0].length;
        sheet.getRange(startRow, 1, numRows, numColumns).setValues(dataToAdd);
      }
    }
    ```
4. **Replace `Replace this with the ID of your Google Sheet` with the ID of the Google Sheet you copied earlier.**

### Step 3: Deployment of the Google AppScript App
1. **Step 1**
<img width="1151" alt="Screenshot2" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d40bf9c0-d925-4da5-b63d-1cbd19866916">

2. **Step 2**
<img width="1151" alt="Screenshot4" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/f1fd5023-e9a5-4314-965b-85dba4947302">

3. **Step 3**
<img width="1151" alt="Screenshot5" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/dfc31018-1515-4f81-864a-4273585eba4f">

4. **Step 4**
<img width="1151" alt="Screenshot6" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/3ad06201-9798-45fb-9ab9-984cf6101422">

5. **Step 5**
<img width="1151" alt="Screenshot7" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e69a93d1-74be-4dc2-b332-c2171492c7c9">

6. **Step 6**
<img width="1151" alt="Screenshot8" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/a0de7452-efb1-41c3-a5d3-b762e4bfe121">

7. **Step 7**
<img width="1151" alt="Screenshot9" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/4b1f8fdf-e4d7-4f85-9060-266751642c84">

8. **Step 8**
<img width="1151" alt="Screenshot10" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/0960034b-8e32-48d1-a6f6-34fb39f04331">

### Step 4: Configuration of the trigger

1. **Step 1**
<img width="1112" alt="Screenshot11" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/2fe5e3a5-1097-4c2b-8ebf-4fa77c9ab84d">

2. **Step 2**
<img width="1112" alt="Screenshot12" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/9aa8da47-f30d-42f8-8e4c-3f6bd0544f45">

3. **Step 3**
<img width="815" alt="Screenshot13" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/fa1016de-f95a-4fb5-8581-4a2f4aef44dc">

4. **Step 4**
<img width="815" alt="Screenshot14" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/34a92ed8-77ea-493e-9c8b-5137e3a81381">

5. **Step 5**
<img width="588" alt="Screenshot15" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/6811b816-ee18-47e7-b3cc-3900cf7bfcba">

6. **Final**

