function getRadioButtonSelectedValue(ctrl) {
    var i = 0;
    for (i = 0; i < ctrl.length; i++)
        if (ctrl[i].checked) return ctrl[i].value;
    return 0;
}

function evaluarExamen() {
    correctas = 0;
    total = 0;
    mensaje = '';
    j = 1;
    var x = document.getElementsByClassName('correcta');
    var cuantas = x.length;
    for (j = 1; j <= cuantas; j++) {
        valorR1 = document.getElementById("correcta" + j).value;

        valor1 = getRadioButtonSelectedValue(document.getElementsByName("rp" + (j)));

        if (valor1 == valorR1) {
            mensaje += "Respuesta de pregunta " + j + " correcta \n";
            correctas++;
        } else {
            mensaje += "Respuesta de pregunta " + j + " incorrecta \n";
        }
    };
    total = (correctas / cuantas) * 100;
    alert(mensaje + `\n calificación: ` + total);
    return false;
}