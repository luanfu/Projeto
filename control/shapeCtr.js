var shape = require('../model/shape')


//middleware para buscar shapees
function getShapes(req, res, next) {
    shape.find({}).lean().exec(function (err, docs) {
        req.shapees = docs
        next()
    })
}

function listar(req, res) {
    shape.find({}).lean().exec(function (err, docs) {
        res.render('shape/list.ejs', { "Shapes": docs })
    })
}

function filtrar(req, res) {
    shape.find({ nome: new RegExp(req.body.pesquisa, 'i') })
        .lean().exec(function (err, docs) {
            res.render('shape/list.ejs', { "Shapes": docs })
        })
}

function abrirAdiciona(req, res) {
    res.render("shape/add.ejs")
}

function adiciona(req, res) {
    var novoShape = new shape({
        nome: req.body.nome,
        nacionalidade: req.body.nacionalidade,
        datanasc: req.body.datanasc,
        foto: req.file.filename
    })
    novoShape.save(function (err) {
        if (err) {
            shape.find({}).lean().exec(function (err, docs) {
                res.render('shape/list.ejs', { msg: "Problema ao salvar!", Shapes: docs })
            })
        } else {
            shape.find({}).lean().exec(function (err, docs) {
                res.render('shape/list.ejs', { msg: "Adicionado com sucesso!", Shapes: docs })
            })
        }
    })
}

function abrirEdita(req, res) {
    shape.findById(req.params.id, function (err, shape) {
        res.render('shape/edit.ejs', { 'shape': shape });
    })
}

function edita(req, res) {
    shape.findByIdAndUpdate(req.params.id,
        {
            nome: req.body.nome,
            nacionalidade: req.body.nacionalidade,
            datanasc: req.body.datanasc,
            foto: req.file.filename
        }, function (err) {
            if (err) {
                shape.find({}).lean().exec(function (err, docs) {
                    res.render('shape/list.ejs', { msg: "Problema ao editar!", Shapes: docs })
                })
            } else {
                shape.find({}).lean().exec(function (err, docs) {
                    res.render('shape/list.ejs', { msg: "Editado com sucesso!", Shapes: docs })
                })
            }
        })
}

function deleta(req, res) {
    shape.findByIdAndDelete(req.params.id, function () {
        shape.find({}).lean().exec(function (err, docs) {
            res.render('shape/list.ejs', { msg: "Removido com sucesso!", Shapes: docs })
        })
    })

}

module.exports = {
    listar,
    filtrar,
    abrirAdiciona,
    adiciona,
    abrirEdita,
    edita,
    deleta,
    getShapes
}