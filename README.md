# GDriveAutoExpireDelete
GDriveAutoExpireDelete is an automated AppScript tool designed for managing Google Drive files. It deletes files based on expiration dates specified in the file names, ideal for efficient data management and organization.

## Disclaimer
Please note that the use of GDriveAutoExpireDelete is at your own risk. I assume no liability for any damages or data loss that may occur as a result of the implementation, assurance, or execution of this script. It is the responsibility of the user to take all necessary precautions and to ensure that the use of the script does not adversely affect their data or systems. Prior to implementing the script, it is recommended to perform appropriate testing and backups.


## How GDriveAutoExpireDelete Works

GDriveAutoExpireDelete is designed to simplify file management in Google Drive by automatically deleting files that have reached a set expiration date. The tool works as follows:

1. **Detecting Expiration Dates in File Names:** 
   GDriveAutoExpireDelete searches Google Drive for files containing specific expiration date tags in their name, such as `#expire7d`, `#expire2w`, `#expire3m`, or `#expire1y`. These tags indicate that the file should be automatically deleted after a certain period (7 days, 2 weeks, 3 months, or 1 year respectively) from its creation date.
   
   - **Example:** A file named `ProjectReport#expire7d` would be automatically deleted seven days after its creation date.

2. **Automatic Calculation of Expiration Date:** 
   The script calculates the expiration date for each file based on the tag in the file name, which can specify days (`d`), weeks (`w`), months (`m`), or years (`y`). 
   - **Important:** The program considers the creation date of the files, not the date of the last modification. This means that modifications to a file after its creation do not affect the set expiration date.

3. **Deleting Expired Files:** 
   Once the expiration date of a file is reached, it is automatically moved to the Google Drive trash. The script performs regular checks to ensure that all files whose expiration date has passed are treated accordingly.

4. **Updating the File List:** 
   In addition to the deletion functions, the script updates a Google Sheets database with information about the files, such as their creation date and calculated expiration date. This allows for efficient monitoring and management of the files.
   - **Important Note:** Therefore, the Google Sheet database must not be deleted from Google Drive, as it is essential for the script's operation.

5. **Synchronization and Updating of Expiry Dates:** 
   The script regularly checks whether the expiry date specified in the file names matches the expiry date stored in the Google Sheet. If there are discrepancies, the expiry date in the sheet is updated accordingly.

6. **Detection and Removal of Tags:** 
   If a user decides not to automatically delete a file and removes the `#expire` or `#deletein` tag from the file name, the script detects this and removes the corresponding entry from the Google Sheet.

By using GDriveAutoExpireDelete, you can ensure that your Google Drive remains tidy and free of outdated files. However, please note that the correct application and configuration of the tool is your responsibility. Make sure to configure and use the tool according to the instructions.

## Step-by-Step Guide

### Step 1: Creating a Google Sheet
1. **Create a Google Sheet** in your Google Drive. For this example, name it "database".
2. **Create columns** for FileID, FileName, CreationDate, and ExpiryDate.
<img width="1314" alt="Screenshot16" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e73a8376-6d15-4e8e-b058-3cf9e718701b">

3. **Copy the SheetID** from the URL of your Google Sheet.
<img width="712" alt="Screenshot1" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d2322fd3-8b17-414c-ac17-9b9412f18191">

### Step 2: Setup and Configuration in Google AppScript
1. **Create a new project** in Google AppScript. Important: Avoid using the word "Expire" in the project name to prevent conflicts with the search algorithm.
2. **Create two additional scripts.**
<img width="390" alt="Screenshot3" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d52c5114-310e-496e-9492-f668826c4e5e">


#### Step 2.1: Renaming and Code for `UpdateList`, `SyncCheck` and `Delete.gs`
1. Rename the new scripts to `UpdateList`, `SyncCheck` and `Delete.gs`.
2. **Insert the following code into `UpdateList.gs`:**
   ```javascript
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
    ```
3. **Insert the following code into `SyncCheck.gs`:**
   ```javascript
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

   ```
   
4. **Insert the following code into `Delete.gs`:**
   ```javascript
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

7. **Then click on `Go to <name of app> (unsafe)`**
<img width="1151" alt="Screenshot9" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/4b1f8fdf-e4d7-4f85-9060-266751642c84">

8. **Grant the app permission** to read, edit, and delete your data as required.
<img width="1151" alt="Screenshot10" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/0960034b-8e32-48d1-a6f6-34fb39f04331">

### Step 4: Configuration of the trigger

1. **Select the trigger icon** from the side menu to set up time-based triggers.
<img width="1228" alt="Screenshot19" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/b5efc626-022a-40c9-ac81-66f44e2fbd99">

2. **Add three triggers**: one for `updateFileListInSheet`, `updateExpiryDatesInSheet` and another for `deleteExpiredFiles`.
<img width="664" alt="Screenshot12" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/ae83694f-2749-4f7e-9055-b69fda6decf6">

3. **Configure `updateFileListInSheet`** as follows:
   - Select the `updateFileListInSheet` function.
   - Set the version, for example, version 1.
   - Choose 'Time-driven' as the event source.
   - For the type of time-based trigger, select 'Day timer'.
   - Set the time of day to run between 0 to 1 AM.
<img width="815" alt="Screenshot13" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/fa1016de-f95a-4fb5-8581-4a2f4aef44dc">

4. **Configure `updateExpiryDatesAndCheckTags`** as follows:
   - Select the `updateExpiryDatesAndCheckTags` function.
   - Set the version, for example, version 1.
   - Choose 'Time-driven' as the event source.
   - For the type of time-based trigger, select 'Day timer'.
   - Set the time of day to run between 1 to 2 AM.
<img width="765" alt="Screenshot18" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/f072f687-4323-4143-85c8-b3efbada1b9b">

5. **Configure `deleteExpiredFiles`** as follows:
   - Select the `deleteExpiredFiles` function.
   - Set the version, for example, version 1.
   - Choose 'Time-driven' as the event source.
   - For the type of time-based trigger, select 'Day timer'.
   - Set the time of day to run between 2 to 3 AM, slightly offset from the update trigger.
<img width="765" alt="Screenshot17" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e5b49b2b-57b2-4c3e-8629-058c7f7371c6">


6. **Save your configurations**.
<img width="588" alt="Screenshot15" src="https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/6811b816-ee18-47e7-b3cc-3900cf7bfcba">

7. If all steps have been correctly configured, your setup is now complete. At midnight, all relevant data meeting the requirements will be deleted.

