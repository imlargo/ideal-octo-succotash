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
        /*
        {
            type: csvToSheet
            csvID: Id del archivo csv
            destinoID: id de carpeta de destino
        } 
         */

        //Obtener archivo csv
        const csvFile = DriveApp.getFileById(request.csvID)
        //Crear tabla y guardar id
        const sheetID = createSheet(csvFile.getName(), request.destinoID);
    
        // Abrir tabla
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

    "sheetTo" : (request) => {
        /*
        {
            type: sheetTo
            to: tipo al q se convierte
            sheetID: Id de la tabla
            destinoID: id de carpeta de destino
        } 
        */

        const spreadSheet = SpreadsheetApp.openById(request.sheetID);

        const params = {
            method: "get",
            headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
            muteHttpExceptions: true
        };
    
        const url = `https://docs.google.com/spreadsheets/d/${request.sheetID}/export?format=${request.to}`
    
        const blob = UrlFetchApp.fetch(url, params).getBlob();
        blob.setName(`${spreadSheet.getName()}.${request.to}`);
    
        const folder = DriveApp.getFolderById(request.destinoID)
        folder.createFile(blob) //regresa el archivo
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