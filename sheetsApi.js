//Archvio .gs, se pone en .js por simplicidad, va en apps script
function createSheet(name, folderId) {
    const fileJson = Drive.Files.insert({
        title: name,
        mimeType: MimeType.GOOGLE_SHEETS,
        parents: [{ id: folderId }]
    })
    return fileJson.id
}


const call = {
    "ping": (request) => {
        return "Pong!";
    },

    "csvToSheet" : (request) => {
        
        const folder = DriveApp.getFolderById(request.folderID)
        const files = folder.getFiles()
    
        const sheetID = createSheet(request.name, request.folderID);
    
        var csvFile = 1
        //Obtener archivo csv
    
        // Gets the first sheet of the destination spreadsheet.
        const spreadSheet = SpreadsheetApp.openById(sheetID);
        let sheet = spreadSheet.getSheets()[0];
    
        // Parses CSV file into data array.
        let data = Utilities.parseCsv(csvFile.getBlob().getDataAsString());
    
        // Gets the row and column coordinates for next available range in the spreadsheet. 
        let startRow = sheet.getLastRow() + 1;
        let startCol = 1;
        // Determines the incoming data size.
        let numRows = data.length;
        let numColumns = data[0].length;
    
        // Appends data into the sheet.
        sheet.getRange(startRow, startCol, numRows, numColumns).setValues(data);
        SpreadsheetApp.flush();
    
        return true; // Success.
    },

    "sheetToExcel" : (request) => {
        const spreadSheet = SpreadsheetApp.openById(request.sheetID);

        var params = {
            method: "get",
            headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
            muteHttpExceptions: true
        };
    
        const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`
    
        const blob = UrlFetchApp.fetch(url, params).getBlob();
        blob.setName(spreadSheet.getName() + ".xlsx");
    
        const folder = DriveApp.getFolderById(request.folderID)
        folder.createFile(blob)
    }
    
}


//Importar ese csv a spreadsheet
function doGet(query) {
    const request = (query.parameter);
    try {
        return ContentService.createTextOutput(call[request.type](request));
    } catch (error) {
        return ContentService.createTextOutput("Error, request invalida");
    }
}