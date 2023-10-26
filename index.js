//Just some code

//Regresa un objeto de javascript, donde una columna son las keys, y otra los valores
function loadDataBase(hoja, evaluar = false, id) {
    return fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent("Select B, C offset 1")}`)
        .then((response) => response.text())
        .then((text) => {
            const rows = JSON.parse(text.slice(47, -2)).table.rows;
            const Objeto = {};
            if (evaluar) {
                for (const row of rows) {
                    let raw = row.c;
                    let rowinfo = raw.map((dic) => (dic && dic.v ? dic.v : "Error"));
                    Objeto[rowinfo[0].toString()] = JSON.parse(rowinfo[1]);
                }
            } else {
                for (const row of rows) {
                    let raw = row.c;
                    let rowinfo = raw.map((dic) => (dic && dic.v ? dic.v : "Error"));
                    Objeto[rowinfo[0]] = rowinfo[1];
                }
            }
            return Objeto;
        });
}



//Carga una hoja de calculo de google sheets y regresa un array de objetos, que representan cada fila
function loadDataBase(id, hoja, query = "Select *") {
    
    //let query = "Select A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W, AK, AN"
    return fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent(query)}`)
        .then(response => response.text())
        .then(text => {
            //Cargar Datos
            const rawdata = text.slice(47, -2);
            const data = ((JSON.parse(rawdata)).table);

            //Titulos de columnas y Obtener columnas
            const cols = (data.cols);
            const Keys = cols.map(col => col.label);
            const rows = data.rows;

            //Regresar Objeto (Diccionario Json)
            const Objeto = [];
            for (const row of rows) {
                const raw = (row.c)
                const rowinfo = raw.map(dic => (dic && dic.v) ? dic.v : "No registra");
                const caso = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i]]));
                Objeto.push(caso)
            }
            return Objeto
        })
}


//Hacer request a la "pseudoApi"
function makeRequest(json, url) {
    return fetch(`${url}?${Object.entries(json).map((query) => `${query[0]}=${encodeURIComponent(query[1])}`).join("&")}`, { method: "GET" })
        .then((response) => response.text())
        .then((data) => {
            return data
        });
}