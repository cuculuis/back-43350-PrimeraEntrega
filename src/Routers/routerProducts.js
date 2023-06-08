import { Router } from "express";
import ProductManager from "../Containers/ManagerProducts.js"

export const productManager = new ProductManager("./src/DB/products.json")
const routerProducts = Router()

let admin = true;


    routerProducts.get('/', async (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts();
        if (limit) {
            res.status(200).json(products.slice(0, limit));
        } else {
            res.status(200).json(products);
        }
    })

    routerProducts.get('/:pid', async (req, res) => {
        const pid = parseInt(req.params.pid);
        const product = await productManager.getProductById(pid);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: `Product with id: ${pid} not found` });
        }
    })


if (admin) {
        routerProducts.post('/', async (req, res) => {
            const newProduct = {
                title : req.body.title,
                description : req.body.description,
                code : req.body.code,
                price : req.body.price,
                status : req.body.status,
                stock : req.body.stock,
                category : req.body.category,
                thumbnail : req.body.thumbnail,
            }

            if (await productManager.validateProduct(req.body.title, req.body.description, req.body.code, req.body.price, req.body.status, req.body.stock, req.body.category)){
                res.status(400).json({ error: `The keys 'title', 'description', 'code', 'price', 'status', 'stock', 'category' are required` });
            }
            
            else if(await productManager.checkCodeExists(req.body.code)) {
                res.status(400).json({ error: `The code: ${req.body.code} is already used.` });
            } 

            else {
                res.status(200).json(await productManager.addProduct(newProduct))
            }


            
        });


        routerProducts.put('/:pid', async (req, res) => {
            const productUpdated = {
                title : req.body.title,
                description : req.body.description,
                code : req.body.code,
                price : req.body.price,
                status : req.body.status,
                stock : req.body.stock,
                category : req.body.category,
                thumbnail : req.body.thumbnail,
            }

            if (await productManager.validateProduct(req.body.title, req.body.description, req.body.code, req.body.price, req.body.status, req.body.stock, req.body.category)){
                res.status(400).json({ error: `The keys 'title', 'description', 'code', 'price', 'status', 'stock', 'category' are required` });
            }
            
            else if(await productManager.checkCodeExists(req.body.code)) {
                res.status(400).json({ error: `The code: ${req.body.code} is already used.` });
            } 

            else {
                res.status(200).json(await productManager.updateProduct(parseInt(req.params.pid), productUpdated))
            }
        
        });

        routerProducts.delete('/:pid', async (req, res) => {
            const pid = parseInt(req.params.pid);
            const product = await productManager.getProductById(pid);
            if (product) {
                res.status(200).json(await productManager.deleteProductById(parseInt(req.params.pid)))
            } else {
                res.status(404).json({ error: `Product with id: ${pid} not found.` });
            }
        });

    } else {
        routerProducts.post('/', function(req, res) {
            res.status(401).json({Error: -1, description: `Rute: ${req.path} and method ${req.method} not authorized.`});
        });
        routerProducts.put('/:id', function(req, res) {
            res.status(401).json({Error: -1, description: `Rute: ${req.path} and method ${req.method} not authorized.`});
        });
        routerProducts.delete('/:id', function(req, res) {
            res.status(401).json({Error: -1, description: `Rute: ${req.path} and method ${req.method} not authorized.`});
        });
    }

export default routerProducts;