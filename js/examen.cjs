const fs = require('fs');

function leerjs(){
  return new Promise((resolve,reject)=>{
    fs.readFile('./js/evaluaExamen.js',
      { encoding: 'utf8', flag: 'r' },
      function (err, data) {
          if (err){
            //console.log(err);
            return reject(err)
          }
          else{
            //console.log(data);
            return resolve(data)
          }
      });
  })
}

function creaHTML(data,codigo){
    //console.log(data[0])
    let salida = `
    <!DOCTYPE html>
      <html lang="es-MX">
      <head>
          <title>Datos pregunta</title>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
      </head>

      <body>
    `
    salida += `
    <div class="w3-row">
    <div class="w3-col m3">
    <p> <p>
    </div>
    `
    salida += `<div class="w3-col m6 w3-bar w3-padding" id='div_actividad'>\n`
    salida += `<form class="w3-contaier w3-padding" name='frmExamen' onsubmit='return evaluarExamen()'>\n`
    salida += "<h1>Examen de ingreso a la MTIE</h1><br>"
    salida += "<p>Contesta las siguientes preguntas, seleccionando la opción correcta, al final presiona el botón EVALUAR</p>\n"
    let numPreg = 0
    for(let i=0;i<data.length;i++){
      //console.log(data[i].d1)
      fila=data[i]
      numPreg++
      salida += `<p class='w3-padding w3-green' style='background-color:#C0C0C0;' > Pregunta ${i}</p>\n`
      id = fila["pk"];
      pregunta = fila["pregunta"]
      d1 = fila["d1"]
      d2 = fila["d2"]
      d3 = fila["d3"]
      d4 = fila["d4"];
      d5 = fila["correcta"]
      salida += `<textarea class="w3-input w3-border-top w3-hover-sepia" readonly name='idpregunta${numPreg}' 
        type='text' id='idpregunta${numPreg}' value='${id}' style='visibility : hidden;' 
        rows='auto' cols='auto'>${id}
      </textarea><br>\n`
      salida += `<textarea class="w3-input w3-border-top w3-hover-sepia" readonly name='pregunta${numPreg}' type='text' id='pregunta${numPreg}' 
        value='${d5}' rows='auto' cols='50'>${pregunta}
      </textarea><br>\n`
      salida += `<input class="w3-check" type='Radio' Name='rp${numPreg}' id='rp${numPreg}-1' value='1'> ${d1}<br>\n`
      salida += `<input class="w3-check" type='Radio' Name='rp${numPreg}' id='rp${numPreg}-2' value='2'> ${d2}<br>\n`
      salida += `<input class="w3-check" type='Radio' Name='rp${numPreg}' id='rp${numPreg}-3' value='3'> ${d3}<br>\n`
      salida += `<input class="w3-check" type='Radio' Name='rp${numPreg}' id='rp${numPreg}-4' value='4'> ${d4}<br>\n`
      //echo "<textarea name='correcta$numPreg' type='text' id='correcta$numPreg' value='' disabled='disabled' style='visibility : hidden;'/>$d5</textarea><br>"; # no funciona el dissble cuando mando POST a php
      //    <textarea class='correcta' name='correcta3' type='text' id='correcta3' value='' disabled='disabled' style='visibility : hidden;'/>3</textarea><br>
      salida += `<textarea class='correcta' readonly name='correcta${numPreg}' type='text' id='correcta${numPreg}' value='${d5}' style='visibility : hidden;' rows='auto' cols='50'>${d5}</textarea><br>\n`
    }
    salida += "<p class='w3-padding w3-green' style='background-color:#C0C0C0;' >  Fin  del examen </p>\n"
    salida += `<input class="w3-input w3-blue w3-border-top w3-hover-indigo" type='submit' name='Enviar' id='ok' value='evaluar'>\n`
    salida += "</form>\n"
    salida += "</div>\n"
    
    salida += `
    <div class="w3-col m3">
    </div>
    </div>
    `

    salida += "<script>\n"
    salida += codigo
    salida += "</script>\n"

    salida += "</html>\n"
    return Promise.resolve(salida)
  }
  
  function creaExamen(data){
    return leerjs()
    .then(codigo=>{
      //console.log("codigo:" ,codigo)
      return creaHTML(data,codigo)
    })
    .catch(err=>{
      return Promise.reject(`
        <h3>Error en la creación del examen</3>
        <p>${err}</p>
      `)
    })
    
  }
  module.exports= creaExamen

  
  