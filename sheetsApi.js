//Archvio .gs, se pone en .js por simplicidad, va en apps script
function createSheet(name, folderId) {
    const fileJson = Drive.Files.insert({
        title: name,
        mimeType: MimeType.GOOGLE_SHEETS,
        parents: [{ id: folderId }]
    })
    return fileJson.id
}

function processCsv(csvFile, sheetID) {

    try {
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
    } catch {
        return false; // Failure. Checks for CSV data file error.
    }
}



const call = {
    "ping": (request) => {
        return "Pong!";
    },

    "csvToSheet" : (request) => {
        /*
        + Carpeta de trabajo:
            |
            + Archivos sin procesar : csvID
            |
            + Archivos procesados : folderID
        */
        const sheetID = createSheet(request.name, request.folderId);   
        

        //Obtener archivo csv
        const result = processCsv(csvFile, sheetID)
    }
}


//Descargar archivo como csv?
function tocsv(type) {
    const url = `https://docs.google.com/spreadsheets/d/${id}/export?format=${type}`
}






function sheetToCsv() {


    var ssID = SpreadsheetApp.getActiveSpreadsheet().getId();
    var sheet_Name = "Sheet1"
    var requestData = { "method": "GET", "headers": { "Authorization": "Bearer " + ScriptApp.getOAuthToken() } };

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_Name)
    var sheetNameId = sheet.getSheetId().toString();

    params = ssID + "/export?gid=" + sheetNameId + "&format=csv"
    var url = "https://docs.google.com/spreadsheets/d/" + params
    var result = UrlFetchApp.fetch(url, requestData);

    var resource = {
        title: sheet_Name + ".csv",
        mimeType: "application/vnd.csv"
    }
    var fileJson = Drive.Files.insert(resource, result)

}


//Guardar informacion en csv

//Crear spreadsheet en cierta carpeta


//Proceso tomar un csv y convertirlo en spreadsheet:


//Importar ese csv a spreadsheet
function doGet(query) {
    const request = (query.parameter);
    try {
        return ContentService.createTextOutput(call[request.type](request));
    } catch (error) {
        return ContentService.createTextOutput("Error, request invalida");
    }
}