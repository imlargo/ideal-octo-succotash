//Archvio .gs, se pone en .js por simplicidad, va en apps script

const call = {

    "ping": (request) => {
        return `Pong!: ${request.text}`;
    },

    "sendMail": (request) => {
        MailApp.sendEmail(request.to, request.about, request.body);
        return "Correo Enviado con exito!"
    },

    "saveUser": (request) => {
        const spreadSheet = SpreadsheetApp.openById("1qpz0EQ2MIHDvxe0_Ktezs0xbvKdVP-Prsl2LXtBn0-s");
        const table = spreadSheet.getSheets()[0]
        table.appendRow(["", request.user, request.info])
        SpreadsheetApp.flush();
        return "Terminado con exito, usuario registrado";
    },

    "traducir": (request) => {
        return LanguageApp.translate(request.text, 'en', 'es')
    },

    "newContact": (request) => {
        const contacto = People.People.createContact({
            "names": [{ "givenName": request.name }],
            "emailAddresses": [
                {
                    "type": "work",
                    "value": request.email
                }
            ],
            "phoneNumbers": [
                {
                    "value": request.phone,
                    "type": "work",
                }
            ]
        })
        return contacto.resourceName
    },

    "simpleContact": (request) => {
        const contacto = People.People.createContact({
            "names": [{ "givenName": request.name }],
            "phoneNumbers": [
                {
                    "value": request.phone,
                    "type": "work",
                }
            ]
        })
        return contacto.resourceName
    },

    "deleteContact": (request) => {
        const contacto = People.People.deleteContact(`people/${request.id}`)
        return `Eliminado correctamente: ${request.id}`
    },

    "updateContact": (request) => {
        const contacto = People.People.updateContact({
            "names": [{ "givenName": request.name }],
            "emailAddresses": [
                {
                    "type": "work",
                    "value": request.email
                }
            ],
            "phoneNumbers": [
                {
                    "value": request.phone,
                    "type": "work",
                }
            ]
        }, `people/${request.id}`)
        return contacto.resourceName
    },

    "validContact": (request) => {
        const newContact = People.People.createContact({
            "names": [{ "givenName": request.name }],
            "emailAddresses": [
                {
                    "type": "work",
                    "value": request.email
                }
            ],
            "phoneNumbers": [
                {
                    "value": request.phone,
                    "type": "work",
                }
            ]
        });
        const validContact = People.People.updateContact({
            "etag": `${(newContact.etag)}`,
            "names": [{ "givenName": `${((newContact["names"])[1]).displayName}${request.name}` }],
        }, `${newContact.resourceName}`, { updatePersonFields: "names" });
        return validContact.resourceName;
    },


    "getContact": (request) => {
        const contacto = People.People.get('people/' + request.id, {
            personFields: 'names,emailAddresses'
        });
        return JSON.stringify(contacto);
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