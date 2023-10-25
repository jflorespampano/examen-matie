import  express from "express"
import AppDao from "./dao.cjs"
import MiRepository from "./preguntaRepository.js"
import dotenv from 'dotenv'

import creaExamen from "./examen.cjs"

dotenv.config() 
const SQLITE3_DB_NAME=process.env.SQLITE3_DB_NAME
const miRouter=express()

//para examen
miRouter.get("/:id",(_,res)=>{
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    //console.log("entrando a /aleatory")
    miRepo.getAllAleatory()
    .then(data=>{
        if(data===undefined){
            data={}
        }
        console.log(data)
        return Promise.resolve(data)
    })
    .then(data=>{
        if(!data) {
            res.status(400).send("sin datos")
        }else{
            res.set({"content-type":"application/json; charset=utf-8"})
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(400).send("error desconocido al obtener todos los datos ", err);
    })
    .finally(()=>{
        dao.close()
    })
})

//
miRouter.get("", (_, res) => {
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    miRepo.getAllAleatory()
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