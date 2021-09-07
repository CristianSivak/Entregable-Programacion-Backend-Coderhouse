const express = require("express");
const app = express();
const path = require('path');
const router = express.Router();

// Import API
const memoria = require('./api/api');
const { array } = require('./api/api');

// Servidor
const port = 8080;
const server = app.listen(port, () => {
  console.info(`Servidor listo en el puerto ${port}`);
});

server.on("error", (error) => {
    console.error(error);
  });

// Motor de plantillas
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', router);
app.use(express.static(path.join(__dirname + "public")));


// Routes
router.get("/listar", (req, res) => {
    if(!memoria.getArray().length){ 
        res.json({error: 'no hay productos cargados'});
    }

    res.json(memoria.getArray())
});

router.get("/listar/:id", (req, res) => {
    const id = req.params.id;
    if(!memoria.getProductById(id)){
        res.json({error: 'producto no encontrado'});
    }
    res.json(memoria.getProductById(id));
    res.status(200).send()
  });

router.get("/", (req, res) => { 
  res.render("./pages/index.ejs", { productos: memoria.getArray() });
})

router.get('/addproduct', (req, res)=>{
    res.render('./pages/addproduct.ejs');
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

