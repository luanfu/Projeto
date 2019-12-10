var encomenda = require('../model/encomenda')
var peca = require('../model/peca')
var categoria = require('../model/categoria')
var shape = require('../model/shape')

//middleware para buscar encomendas
function getEncomendas(req, res, next) {
    encomenda.find({}).lean().exec(function (err, docs) {
        req.encomendas = docs
        next()
    })
}

function listar(req, res) {
    encomenda
        .find({})
        .populate('categoria')
        .populate('peca')
        .populate('shapes')
        .lean()
        .exec(function (err, docs) {
            res.render('encomenda/list.ejs', { "Encomendas": docs })
        })
}

function filtrar(req, res) {
    encomenda
        .find({ titulo: new RegExp(req.body.pesquisa, 'i') })
        .populate('categoria')
        .populate('peca')
        .populate('shapes')
        .lean()
        .exec(function (err, docs) {
            res.render('encomenda/list.ejs', { "Encomendas": docs })
        })
}

function abrirAdiciona(req, res) {
    peca
        .find({})
        .lean()
        .exec(function (e, pecas) {
            shape
                .find({})
                .lean()
                .exec(function (e, shapes) {
                    categoria
                        .find({})
                        .lean()
                        .exec(function (e, categorias) {
                            res.render("encomenda/add.ejs", { "Pecas": pecas, "Shapes": shapes, "Categorias": categorias })
                        });
                });
        });
}

function adiciona(req, res) {

    var novoencomenda = new encomenda({
        titulo: req.body.titulo,
        isbn: req.body.isbn,
        sinopse: req.body.sinopse,
        foto: req.file.filename,
        categoria: req.body.categoria,
        peca: req.body.peca,
        shapes: req.body.shapes,
    })
    novoencomenda.save(function (err) {
        if (err) {
            encomenda.find({}).populate('categoria').populate('peca').populate('shapes').lean().exec(function (err, docs) {
                res.render('encomenda/list.ejs', { msg: "Problema ao salvar!", Encomendas: docs })
            })
        } else {
            encomenda.find({}).populate('categoria').populate('peca').populate('shapes').lean().exec(function (err, docs) {
                res.render('encomenda/list.ejs', { msg: "Adicionado com sucesso!", Encomendas: docs })
            })
        }
    })
}

function abrirEdita(req, res) {
    peca.find({}).lean().exec(
        function (e, pecas) {
            shape.find({}).lean().exec(
                function (e, shapes) {
                    categoria.find({}).lean().exec(
                        function (e, categorias) {
                            encomenda.findOne({ _id: req.params.id }).populate('categoria').populate('peca').populate('shapes').exec(
                                function (err, encomenda) {
                                    res.render('encomenda/edit.ejs', { 'encomenda': encomenda, "Pecas": pecas, "Shapes": shapes, "Categorias": categorias });
                                });
                        });
                });
        });
}

function edita(req, res) {
    encomenda.findByIdAndUpdate(req.params.id,
        {
            titulo: req.body.titulo,
            isbn: req.body.isbn,
            sinopse: req.body.sinopse,
            foto: req.file.filename,
            categoria: req.body.categoria,
            peca: req.body.peca,
            shapes: req.body.shapes
        }, function (err) {
            if (err) {
                encomenda.find({}).populate('categoria').populate('peca').populate('shapes').lean().exec(function (err, docs) {
                    res.render('encomenda/list.ejs', { msg: "Problema ao editar!", Encomendas: docs })
                })
            } else {
                encomenda.find({}).populate('categoria').populate('peca').populate('shapes').lean().exec(function (err, docs) {
                    res.render('encomenda/list.ejs', { msg: "Editado com sucesso!", Encomendas: docs })
                })
            }
        })
}

function deleta(req, res) {
    encomenda.findByIdAndDelete(req.params.id, function () {
        encomenda.find({}).populate('categoria').populate('peca').populate('shapes').lean().exec(function (err, docs) {
            res.render('encomenda/list.ejs', { msg: "Removido com sucesso!", Encomendas: docs })
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
    getEncomendas
}