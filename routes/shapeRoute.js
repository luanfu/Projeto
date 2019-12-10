var express = require('express')
var route = express.Router()
var shapeCtr = require('../control/shapeCtr')
var multer = require('../config/multerConfig')

//rota para listar todos usando middleware
//route.get('/',shapeCtr.getshapes, shapeCtr.listar)

//rota para listar todos
route.get('/', shapeCtr.listar)

//rota para listar por filtro
route.post('/', shapeCtr.filtrar)

//rota para abrir o adiciona
route.get('/add', shapeCtr.abrirAdiciona)

//rota para adicionar
route.post('/add',multer.single('foto'), shapeCtr.adiciona)

//rota para abrir o edita
route.get('/edit/:id', shapeCtr.abrirEdita)

//rota para editar
route.post('/edit/:id',multer.single('foto'), shapeCtr.edita)

//rota para deletar
route.get('/del/:id', shapeCtr.deleta)

module.exports = route;