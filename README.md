# GDriveAutoExpireDelete
GDriveAutoExpireDelete is an automated AppScript tool designed for managing Google Drive files. It deletes files based on expiration dates specified in the file names, ideal for efficient data management and organization.

## Disclaimer
Please note that the use of GDriveAutoExpireDelete is at your own risk. I assume no liability for any damages or data loss that may occur as a result of the implementation, assurance, or execution of this script. It is the responsibility of the user to take all necessary precautions and to ensure that the use of the script does not adversely affect their data or systems. Prior to implementing the script, it is recommended to perform appropriate testing and backups.


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
1. **Initiate a new deployment** by clicking on `Deploy` > `New deployment`.
<img width="1151" alt="Screenshot2" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d40bf9c0-d925-4da5-b63d-1cbd19866916">

2. **Select the deployment type** as `Web app` by clicking on the gear icon.
<img width="1151" alt="Screenshot4" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/f1fd5023-e9a5-4314-965b-85dba4947302">

3. **Click on `Deploy`** to publish the app.
<img width="1151" alt="Screenshot5" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/dfc31018-1515-4f81-864a-4273585eba4f">

4. **Since this is the first version** of the app being published and the Web App requires access, you will be prompted to grant access.
<img width="1151" alt="Screenshot6" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/3ad06201-9798-45fb-9ab9-984cf6101422">

5. **Choose the Google account** where your Google Sheet database is located and which will run the expiration function.
<img width="1151" alt="Screenshot7" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e69a93d1-74be-4dc2-b332-c2171492c7c9">

6. **Google will notify you** that it's an unverified app. Click on `Advanced`.
<img width="1151" alt="Screenshot8" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/a0de7452-efb1-41c3-a5d3-b762e4bfe121">

7. **Then click on `Go to <name of app>`**
<img width="1151" alt="Screenshot9" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/4b1f8fdf-e4d7-4f85-9060-266751642c84">

8. **Grant the app permission** to read, edit, and delete your data as required.
<img width="1151" alt="Screenshot10" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/0960034b-8e32-48d1-a6f6-34fb39f04331">

### Step 4: Configuration of the trigger

1. **Select the trigger icon** from the side menu to set up time-based triggers.
<img width="1112" alt="Screenshot11" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/2fe5e3a5-1097-4c2b-8ebf-4fa77c9ab84d">

2. **Add two triggers**: one for `updateFileListInSheet` and another for `deleteExpiredFiles`.
<img width="1112" alt="Screenshot12" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/9aa8da47-f30d-42f8-8e4c-3f6bd0544f45">

3. **Configure `updateFileListInSheet`** as follows:
   - Select the `updateFileListInSheet` function.
   - Set the version, for example, version 1.
   - Choose 'Time-driven' as the event source.
   - For the type of time-based trigger, select 'Day timer'.
   - Set the time of day to run between 0 to 1 AM.
<img width="815" alt="Screenshot13" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/fa1016de-f95a-4fb5-8581-4a2f4aef44dc">

4. **Configure `deleteExpiredFiles`** as follows:
   - Select the `deleteExpiredFiles` function.
   - Set the version, for example, version 1.
   - Choose 'Time-driven' as the event source.
   - For the type of time-based trigger, select 'Day timer'.
   - Set the time of day to run between 1 to 2 AM, slightly offset from the update trigger.

<img width="815" alt="Screenshot14" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/34a92ed8-77ea-493e-9c8b-5137e3a81381">

5. **Save your configurations**.
<img width="588" alt="Screenshot15" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/6811b816-ee18-47e7-b3cc-3900cf7bfcba">

6. If all steps have been correctly configured, your setup is now complete. At midnight, all relevant data meeting the requirements will be deleted.

