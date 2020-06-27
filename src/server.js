const express = require('express');
const server = express();

// pegar o BD 
const db = require("./database/db");

// Configurar pasta publica
server.use(express.static('public'));

// Habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({
    extended: true
}));


// Utilizando template engine
const nunjucks = require('nunjucks');
nunjucks.configure(`${__dirname}/views`, {
    express: server,
    noCache: true
});


//configurar caminhos da minha aplicação
//página inicial
//req: Requisição
//res: Resposta
server.get("/", (req, res) => {
    return res.render('index.html', {
        title: `Seu marketplace
        de coleta de resíduos.`
    });
});

server.get("/create-point", (req, res) => {

    // req.query: Query String da nossa url
    //console.log(req.query)

    return res.render('create-point.html');
});

server.post("/savePoint", (req, res) => {
    const entityData = req.body;
    // req.body: O corpo do nosso formulário
    // console.log(req.body);

    // Inserir dados no banco de Dados
    const query = `
         INSERT INTO places (
             image,
             name,
             address,
             address2,
             state,
             city,
             items
         ) VALUES (?,?,?,?,?,?,?);
     `;
    const values = [
        entityData.image,
        entityData.name,
        entityData.address,
        entityData.address2,
        entityData.state,
        entityData.city,
        entityData.items
    ];

    function afterInsertData(err) {
        if (err) {
            console.log(err);
            return res.render("create-point.html", { error: true});
        }

        console.log("Cadastrado com sucesso");
        console.log(this);

        return res.render("create-point.html", { saved: true });
    }

    db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render('search-results.html', {
            total: 0
        });
    }

    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err);
        }

        const total = rows.length;

        //mostrar a página html com dados do BD
        return res.render('search-results.html', {
            places: rows,
            total
        });
    });

});

// Ligar o servidor
server.listen(3080);