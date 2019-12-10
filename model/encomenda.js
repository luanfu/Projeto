const conexao = require('./conexao')

var encomenda = conexao.Schema({
    titulo:{
        type:String
    },
    isbn:{
        type:String
    },
    sinopse:{
        type:String
    },
    foto:{
        type:String
    },
    categoria:{
        type:conexao.Schema.Types.ObjectId,
        ref: "categoria"
    },
    peca:{
        type:conexao.Schema.Types.ObjectId,
        ref: "peca"
    },
    shapes:[{
        type:conexao.Schema.Types.ObjectId,
        ref: "shape"
    }]
})

module.exports = conexao.model("encomenda",encomenda)