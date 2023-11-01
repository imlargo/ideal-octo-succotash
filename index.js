//Just some code

const fetch = require("node-fetch");

function sheetsQuery(hoja, id, query = "Select B, C offset 1") {
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?&sheet=${hoja}&tq=${encodeURIComponent(query)}`
}

function loadObject(hoja, id, query = "Select *") {
    //Carga cada fila con una Key asociada a sus valores
    return fetch(sheetsQuery(hoja, id, query))
        .then((response) => response.text())
        .then((text) => {
            //Cargar Datos
            const data = ((JSON.parse(text.slice(47, -2))).table);

            //Titulos de columnas y Obtener columnas
            const cols = (data.cols);
            const Keys = cols.map(col => col.label).slice(1);
            const rows = data.rows;

            const Objeto = {};
            for (const row of rows) {
                const raw = row.c;
                const rowinfo = raw.map((dic) => (dic && dic.v ? dic.v : "Nn"));
                //Key - Info (Object)
                Objeto[rowinfo[0]] = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i + 1]]));
            }
            return Objeto;
        });
}

function loadRows(hoja, id, query = "Select *") {
  //Carga una hoja de calculo de google sheets y regresa un array de objetos, que representan cada fila
  return fetch(sheetsQuery(hoja, id, query))
      .then(response => response.text())
      .then(text => {
          //Cargar Datos
          const rawdata = text.slice(47, -2);
          const data = ((JSON.parse(rawdata)).table);

          //Titulos de columnas y Obtener columnas
          const Keys = (data.rows[0].c).map(c => c.v);
          const rows = data.rows;

          //Regresar Objeto (Diccionario Json)
          const Objeto = [];
          for (const row of rows) {
              const raw = (row.c)
              const rowinfo = raw.map(dic => (dic && dic.v) ? dic.v : "Nn");
              const caso = Object.fromEntries(Keys.map((key, i) => [key, rowinfo[i]]));
              Objeto.push(caso)
          }
          return Objeto
      })
}

//Regresa un objeto de javascript, donde una columna son las keys, y otra los valores
function loadJson(hoja, evaluar = false, id) {
    return fetch(sheetsQuery(hoja, id, "Select *"))
        .then((response) => response.text())
        .then((text) => {
            const data = JSON.parse(text.slice(47, -2));
            const rows = data.table.rows;
            const cols = data.table.cols;

            const Objeto = {};
            for (const row of rows) {
                let raw = row.c;
                let rowinfo = raw.map((dic) => (dic && dic.v ? dic.v : "Error"));
                Objeto[rowinfo[0].toString()] = evaluar ? JSON.parse(rowinfo[1]) : rowinfo[1];
            }
            return Objeto;
        });
}

//Hacer request a la "pseudoApi"
function makeRequest(json, url) {
    const queryUrl = `${url}?${Object.entries(json).map((query) => `${query[0]}=${encodeURIComponent(query[1])}`).join("&")}`;
    return fetch(queryUrl, { method: "GET" })
        .then((response) => response.text()).then((data) => data);
}
