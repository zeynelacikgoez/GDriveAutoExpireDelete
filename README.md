# GDriveAutoExpireDelete

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

GDriveAutoExpireDelete ist ein automatisiertes AppScript-Tool zur Verwaltung von Google Drive-Dateien. Es löscht Dateien basierend auf Ablaufdaten, die in den Dateinamen angegeben sind, und ist ideal für effizientes Datenmanagement und -organisation.

## Inhaltsverzeichnis

- [GDriveAutoExpireDelete](#gdriveautoexpiredelete)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Disclaimer](#disclaimer)
  - [Wie GDriveAutoExpireDelete funktioniert](#wie-gdriveautoexpiredelete-funktioniert)
  - [Schritt-für-Schritt Anleitung](#schritt-für-schritt-anleitung)
    - [Schritt 1: Erstellen eines Google Sheets](#schritt-1-erstellen-eines-google-sheets)
    - [Schritt 2: Einrichtung und Konfiguration in Google AppScript](#schritt-2-einrichtung-und-konfiguration-in-google-appscript)
      - [Schritt 2.1: Umbenennen und Code für `UpdateList`, `SyncCheck`, `Delete.gs` und `CommonFunctions.gs`](#schritt-21-umbenennen-und-code-für-updatelist-synccheck-deletegs-und-commonfunctionsgs)
    - [Schritt 3: Bereitstellung der Google AppScript App](#schritt-3-bereitstellung-der-google-appscript-app)
    - [Schritt 4: Konfiguration des Triggers](#schritt-4-konfiguration-des-triggers)
  - [Lizenz](#lizenz)
  - [Kontakt](#kontakt)

## Disclaimer

Bitte beachten Sie, dass die Nutzung von GDriveAutoExpireDelete auf eigenes Risiko erfolgt. Ich übernehme keine Haftung für Schäden oder Datenverluste, die durch die Implementierung, Sicherstellung oder Ausführung dieses Skripts entstehen können. Es liegt in der Verantwortung des Nutzers, alle notwendigen Vorsichtsmaßnahmen zu treffen und sicherzustellen, dass die Nutzung des Skripts ihre Daten oder Systeme nicht nachteilig beeinflusst. Vor der Implementierung des Skripts wird empfohlen, entsprechende Tests und Backups durchzuführen.

## Wie GDriveAutoExpireDelete funktioniert

GDriveAutoExpireDelete wurde entwickelt, um die Dateiverwaltung in Google Drive zu vereinfachen, indem es automatisch Dateien löscht, die ein festgelegtes Ablaufdatum erreicht haben. Das Tool funktioniert wie folgt:

1. **Erkennung von Ablaufdaten in Dateinamen:**
   GDriveAutoExpireDelete durchsucht Google Drive nach Dateien, die spezifische Ablaufdatums-Tags im Namen enthalten, wie z.B. `#expire7d`, `#expire2w`, `#expire3m` oder `#expire1y`. Diese Tags geben an, dass die Datei nach einer bestimmten Zeitspanne (7 Tage, 2 Wochen, 3 Monate oder 1 Jahr) ab ihrem Erstellungsdatum automatisch gelöscht werden soll.
   
   - **Beispiel:** Eine Datei namens `Projektbericht#expire7d` würde sieben Tage nach ihrem Erstellungsdatum automatisch gelöscht.

2. **Automatische Berechnung des Ablaufdatums:**
   Das Skript berechnet das Ablaufdatum für jede Datei basierend auf dem Tag im Dateinamen, der Tage (`d`), Wochen (`w`), Monate (`m`) oder Jahre (`y`) angeben kann.
   
   - **Wichtig:** Das Programm berücksichtigt das Erstellungsdatum der Dateien, nicht das Datum der letzten Änderung. Das bedeutet, dass Änderungen an einer Datei nach ihrer Erstellung das festgelegte Ablaufdatum nicht beeinflussen.

3. **Löschen abgelaufener Dateien:**
   Sobald das Ablaufdatum einer Datei erreicht ist, wird sie automatisch in den Google Drive Papierkorb verschoben. Das Skript führt regelmäßige Überprüfungen durch, um sicherzustellen, dass alle Dateien, deren Ablaufdatum überschritten wurde, entsprechend behandelt werden.

4. **Aktualisierung der Dateiliste:**
   Zusätzlich zu den Löschfunktionen aktualisiert das Skript eine Google Sheets-Datenbank mit Informationen über die Dateien, wie z.B. deren Erstellungsdatum und berechnetes Ablaufdatum. Dies ermöglicht eine effiziente Überwachung und Verwaltung der Dateien.
   
   - **Wichtiger Hinweis:** Die Google Sheet-Datenbank darf daher nicht aus Google Drive gelöscht werden, da sie für den Betrieb des Skripts unerlässlich ist.

5. **Synchronisierung und Aktualisierung von Ablaufdaten:**
   Das Skript überprüft regelmäßig, ob das im Dateinamen angegebene Ablaufdatum mit dem in der Google Sheet gespeicherten Ablaufdatum übereinstimmt. Bei Abweichungen wird das Ablaufdatum im Sheet entsprechend aktualisiert.

6. **Erkennung und Entfernung von Tags:**
   Wenn ein Nutzer entscheidet, eine Datei nicht automatisch löschen zu lassen und das `#expire`- oder `#deletein`-Tag aus dem Dateinamen entfernt, erkennt das Skript dies und entfernt den entsprechenden Eintrag aus der Google Sheet.

Durch die Nutzung von GDriveAutoExpireDelete können Sie sicherstellen, dass Ihr Google Drive ordentlich und frei von veralteten Dateien bleibt. Bitte beachten Sie jedoch, dass die korrekte Anwendung und Konfiguration des Tools in Ihrer Verantwortung liegt. Stellen Sie sicher, dass Sie das Tool gemäß den Anweisungen konfigurieren und verwenden.

## Schritt-für-Schritt Anleitung

### Schritt 1: Erstellen eines Google Sheets

1. **Erstellen Sie ein Google Sheet** in Ihrem Google Drive. Nennen Sie es beispielsweise "database".
2. **Erstellen Sie Spalten** für FileID, FileName, CreationDate und ExpiryDate.
   
   ![Screenshot16](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e73a8376-6d15-4e8e-b058-3cf9e718701b)

3. **Kopieren Sie die SheetID** aus der URL Ihres Google Sheets.
   
   ![Screenshot1](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d2322fd3-8b17-414c-ac17-9b9412f18191)

### Schritt 2: Einrichtung und Konfiguration in Google AppScript

1. **Erstellen Sie ein neues Projekt** in Google AppScript. **Wichtig:** Vermeiden Sie die Verwendung des Wortes "Expire" im Projektnamen, um Konflikte mit dem Suchalgorithmus zu verhindern.
2. **Erstellen Sie drei zusätzliche Skripte.**
   
   ![Screenshot3](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d52c5114-310e-496e-9492-f668826c4e5e)

#### Schritt 2.1: Umbenennen und Code für `UpdateList`, `SyncCheck`, `Delete.gs` und `CommonFunctions.gs`

1. Benennen Sie die neuen Skripte in `UpdateList`, `SyncCheck`, `Delete.gs` und `CommonFunctions.gs` um.
2. **Fügen Sie den folgenden Code in `UpdateList.gs` ein:**

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
   ```

3. **Fügen Sie den folgenden Code in `SyncCheck.gs` ein:**

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
   ```

4. **Fügen Sie den folgenden Code in `Delete.gs` ein:**

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
   ```

5. **Fügen Sie den folgenden Code in `CommonFunctions.gs` ein:**

   ```javascript
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

6. **Ersetzen Sie `Replace this with the ID of your Google Sheet`** mit der ID Ihres zuvor kopierten Google Sheets.

### Schritt 3: Bereitstellung der Google AppScript App

1. **Initiieren Sie eine neue Bereitstellung**, indem Sie auf `Deploy` > `New deployment` klicken.
   
   ![Screenshot2](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/d40bf9c0-d925-4da5-b63d-1cbd19866916)

2. **Wählen Sie den Bereitstellungstyp** als `Web app` aus, indem Sie auf das Zahnradsymbol klicken.
   
   ![Screenshot4](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/f1fd5023-e9a5-4314-965b-85dba4947302)

3. **Klicken Sie auf `Deploy`**, um die App zu veröffentlichen.
   
   ![Screenshot5](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/dfc31018-1515-4f81-864a-4273585eba4f)

4. **Da dies die erste Version** der App ist und die Web App Zugriff benötigt, werden Sie aufgefordert, den Zugriff zu gewähren.
   
   ![Screenshot6](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/3ad06201-9798-45fb-9ab9-984cf6101422)

5. **Wählen Sie das Google-Konto aus**, in dem sich Ihre Google Sheet-Datenbank befindet und das die Ablauffunktion ausführt.
   
   ![Screenshot7](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/e69a93d1-74be-4dc2-b332-c2171492c7c9)

6. **Google wird Sie informieren**, dass es sich um eine nicht verifizierte App handelt. Klicken Sie auf `Advanced`.
   
   ![Screenshot8](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/a0de7452-efb1-41c3-a5d3-b762e4bfe121)

7. **Klicken Sie dann auf `Go to <Name der App> (unsafe)`**.
   
   ![Screenshot9](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/4b1f8fdf-e4d7-4f85-9060-266751642c84)

8. **Gewähren Sie der App die Berechtigung**, Ihre Daten nach Bedarf zu lesen, zu bearbeiten und zu löschen.
   
   ![Screenshot10](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/0960034b-8e32-48d1-a6f6-34fb39f04331)

### Schritt 4: Konfiguration des Triggers

1. **Wählen Sie das Trigger-Symbol** aus dem Seitenmenü, um zeitbasierte Trigger einzurichten.
   
   ![Screenshot1](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/50e43f67-6850-4390-a9e7-61a6acd3d691)

2. **Fügen Sie drei Trigger hinzu**: einen für `updateFileListInSheet`, einen für `updateExpiryDatesAndCheckTags` und einen weiteren für `deleteExpiredFiles`.
   
   ![Screenshot12](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/ae83694f-2749-4f7e-9055-b69fda6decf6)

3. **Konfigurieren Sie `updateFileListInSheet`** wie folgt:
   - Wählen Sie die Funktion `updateFileListInSheet`.
   - Setzen Sie die Version, z.B. Version 1.
   - Wählen Sie 'Time-driven' als Ereignisquelle.
   - Für den Typ des zeitbasierten Triggers wählen Sie 'Day timer'.
   - Stellen Sie die Tageszeit so ein, dass er zwischen 0 und 1 Uhr morgens ausgeführt wird.
   
   ![Screenshot2](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/48f39904-34cb-4da3-b41c-97760936dac2)

4. **Konfigurieren Sie `updateExpiryDatesAndCheckTags`** wie folgt:
   - Wählen Sie die Funktion `updateExpiryDatesAndCheckTags`.
   - Setzen Sie die Version, z.B. Version 1.
   - Wählen Sie 'Time-driven' als Ereignisquelle.
   - Für den Typ des zeitbasierten Triggers wählen Sie 'Day timer'.
   - Stellen Sie die Tageszeit so ein, dass er zwischen 1 und 2 Uhr morgens ausgeführt wird.
   
   ![Screenshot3](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/451d24e3-21c5-4529-aa12-29dd5d56de4d)

5. **Konfigurieren Sie `deleteExpiredFiles`** wie folgt:
   - Wählen Sie die Funktion `deleteExpiredFiles`.
   - Setzen Sie die Version, z.B. Version 1.
   - Wählen Sie 'Time-driven' als Ereignisquelle.
   - Für den Typ des zeitbasierten Triggers wählen Sie 'Day timer'.
   - Stellen Sie die Tageszeit so ein, dass er zwischen 2 und 3 Uhr morgens ausgeführt wird, leicht versetzt vom Update-Trigger.
   
   ![Screenshot4](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/355f6009-348f-421f-ae8f-9c51312b8bfa)

6. **Speichern Sie Ihre Konfigurationen**.
   
   ![Screenshot15](https://github.com/zeynelacikgoez/GDriveAutoExpireDelete/assets/137368801/6811b816-ee18-47e7-b3cc-3900cf7bfcba)

7. **Wenn alle Schritte korrekt konfiguriert sind**, ist Ihre Einrichtung nun abgeschlossen. Um Mitternacht werden alle relevanten Daten, die die Anforderungen erfüllen, gelöscht.

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).

**Kurzfassung der MIT-Lizenz:**

- **Erlaubnisse:** Nutzung, Kopieren, Ändern, Zusammenführen, Veröffentlichen, Verteilen, Unterlizenzieren und/oder Verkaufen von Kopien der Software.
- **Bedingungen:** Der ursprüngliche Urheberrechtshinweis und dieser Erlaubnishinweis müssen in allen Kopien oder wesentlichen Teilen der Software enthalten sein.
- **Haftungsausschluss:** Die Software wird "wie besehen" ohne jegliche Gewährleistung bereitgestellt. Die Autoren haften nicht für Ansprüche, Schäden oder sonstige Haftungen.

Für die vollständigen Lizenzbedingungen siehe die [LICENSE](LICENSE)-Datei.

## Kontakt

Bei Fragen oder Anmerkungen zum Projekt können Sie sich gerne an mich wenden:

- **GitHub:** [Ihr GitHub-Profil](https://github.com/zeynelacikgoez)
