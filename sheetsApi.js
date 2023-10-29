//Archvio .gs, se pone en .js por simplicidad, va en apps script

const call = {
    "ping": (request) => {
        return "Pong!";
    },
}



function doGet(query) {
    const request = (query.parameter);
    try {
        return ContentService.createTextOutput(call[request.type](request));
    } catch (error) {
        return ContentService.createTextOutput("Error, request invalida");
    }
}