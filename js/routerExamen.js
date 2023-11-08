import MiRepository from "./repositoryPregunta.js"
import express from "express"
import getDao from "./factoryDao.js"
import creaExamen from "./examen.cjs"

const miRouter=express()
const dao=getDao()

//para examen
miRouter.get("", (_, res) => {
    const miRepo=new MiRepository(dao)
    dao.open()
    .then(()=>{
        return miRepo.getAllAleatory()
    })
    .then(data=>{
        if(data===undefined){
            data={}
        }
        //console.log(data)
        return Promise.resolve(data)
    })
    .then(data=>{
        console.log('creando examen ...')
        //console.log(data)
        return creaExamen(data)
    })
    .then(html=>{
        //console.log(creaExamen)
        res.send(html)
    })
    .catch(err=>{
        res.status(400).send(`<p>error ${err}</p>`);
    })
    .finally(()=>{
        dao.close()
    })
    
})

export default miRouter