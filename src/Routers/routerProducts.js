import { Router } from "express";
import ProductManager from "../Containers/ManagerProducts"

export const productManager = new ProductManager("../DB/products.txt")
const routerProducts = Router()


    routerProducts.get('/', async (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    })

    routerProducts.get('/:pid', async (req, res) => {
        const pid = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: `Producto con id: ${pid} no encontrado` });
        }
    })


if (admin) {
    routerProducts.post('/', async (req, res) => {
        const newProduct = {
            title : req.body.title,
            description : req.body.description,
            code : req.body.code,
            price : req.body.price,
            thumbnail : req.body.thumbnail,
            stock : req.body.stock,
        }

        res.json(await productManager.addProduct(newProduct))
    });


    routerProducts.put('/:pid', async (req, res) => {
        const productUpdated = {
            pid : req.params.pid,
            title : req.body.title,
            description : req.body.description,
            code : req.body.code,
            price : req.body.price,
            thumbnail : req.body.thumbnail,
            stock : req.body.stock,
        }
    
        res.json(await productManager.updateProduct(parseInt(req.params.pid), productUpdated))
    });

    routerProducts.delete('/:pid', async (req, res) => {
        res.json(await productManager.deleteProductById(parseInt(req.params.pid)))
    });

    } else {
        routerProducts.post('/', function(req, res) {
            res.status(401).send({Error: -1, description: `Rute: ${req.path} and method ${req.method} not authorized.`});
        });
        routerProducts.put('/:id', function(req, res) {
            res.status(401).send({Error: -1, description: `Rute: ${req.path} and method ${req.method} not authorized.`});
        });
        routerProducts.delete('/:id', function(req, res) {
            res.status(401).send({Error: -1, description: `Rute: ${req.path} and method ${req.method} not authorized.`});
        });
    }

export default routerProducts;