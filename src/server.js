import express from "express";
import routerCarts from "./Routers/routerCarts.js"
import routerProducts from "./Routers/routerProducts.js"

export const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCarts);

app.get('*', (req, res) => {
    const ruta = req.path;
    const metodo = req.method;
    res.status(400).send({Error: -1, description: `Rute: ${ruta} and method ${metodo} not authorized.`});
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Escuchando en el servidor en el puerto: ' + PORT);
})