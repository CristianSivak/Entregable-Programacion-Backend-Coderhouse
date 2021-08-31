const express = require("express");
const path = require('path');
const handlebars = require("express-handlebars")

const { array } = require('./api/api');
const memoria = require('./api/api');

const app = express();
const router = express.Router();
const port = 8080;
const server = app.listen(port, () => {
  console.info(`Servidor listo en el puerto ${port}`);
});

app.engine("hbs",
handlebars({
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "views/layouts",
  partialsDir: __dirname + "/views/partials"
})
);

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', router);
app.use(express.static(path.join(__dirname + "public")));

server.on("error", (error) => {
  console.error(error);
});

/////////////////////////////////////////////

// Trae todo el listado de producto
router.get("/listar", (req, res) => {
    if(!memoria.getArray().length){ 
        res.json({error: 'no hay productos cargados'});
    }

    res.json(memoria.getArray())
});

// 
router.get("/listar/:id", (req, res) => {
    const id = req.params.id;
    if(!memoria.getProductById(id)){
        res.json({error: 'producto no encontrado'});
    }
    res.json(memoria.getProductById(id));
    res.status(200).send()
  });

router.get("/", (req, res) => { 
  res.render("pages/index", { productos: memoria.getArray() });
})

router.get('/addproduct', (req, res)=>{
    res.sendFile(__dirname+'/public/addproduct.html');
})

router.post("/guardar", (req, res) => {
    const producto = req.body;  
    console.log(producto)
    memoria.addElement(producto);
    res.sendStatus(201);
  });

router.put("/actualizar/:id", (req, res) => {
  const id = req.params.id;
  const producto = req.body;
  console.log(producto)

    if(!memoria.getProductById(id)){
      res.json({error: 'producto no encontrado'});
    }
    res.json(memoria.updateElement(id, producto));  
  });

router.delete("/borrar/:id", (req, res) => {
    const id = req.params.id;
    if(!memoria.getProductById(id)){
      res.json({error: 'producto no encontrado'});
    }
    memoria.deleteElement(id)
    res.json(memoria.getProductById(id));
  })