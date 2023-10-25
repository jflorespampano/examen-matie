import express from "express"
import dotenv from 'dotenv'
import { MisFunciones } from "./misFunciones.js"
import profesorRouter from "./routerProfesor.js"
import materiaRouter from "./routerMateria.js"
import temaRouter from "./routerTema.js"
import preguntaRouter from "./routerPregunta.js"
import examentaRouter from "./routerExamen.js"

dotenv.config() //cargar los datos del archivo .env en processs.env
const PORT=process.env.PORT //obtenemos el puerto

const app=express()
//middleware para  aceptar json y texto
app.use(express.json())
app.use(express.text())
//middleware para manejo de rutas /
app.use("/profesor",profesorRouter)
app.use("/materia",materiaRouter)
app.use("/tema",temaRouter)
app.use("/pregunta",preguntaRouter)
app.use("/examen",examentaRouter)

app.get('/inicializa', (_, res) => {
    MisFunciones.inicializa_DB()
    .then(data=>{
        res.send(data)
    })
    .catch(err=>{
        return res.status(400).send(err);
    })
})


//

app.listen(PORT,()=>{
    console.log(`iniciando express desde: http://localhost:${PORT}/`)
})
