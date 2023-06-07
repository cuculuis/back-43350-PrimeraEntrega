import { Router } from "express";
import CartManager from "../Containers/ManagerCarts.js";

const cartManager = new CartManager("./src/DB/carts.json")
const routerCarts = Router()


    routerCarts.get('/', async (req, res) => {
        const carts = await cartManager.getCarts();
        
        res.status(200).json(carts);
    })

    routerCarts.post('/', async (req, res) => {
        res.status(200).json(await cartManager.addNewCart())
    })

    routerCarts.post('/:cid/products/:pid', async (req, res) => {
        const idProduct = parseInt(req.params.pid);
        const idCart = parseInt(req.params.cid);

        try {
        await cartManager.addProductToCart(idCart, idProduct)
            
        res.json(`Se agregó el producto con id: ${idProduct} al carrito con id ${idCart}`)

        } catch (error) {
            res.status(400).json({ error: `No se pudo agregar al carrito con id: ${idCart} el producto con id: ${idProduct}.` })
        }
    })

    routerCarts.delete('/:cid', async (req, res) => {
        const cid = parseInt(req.params.cid);
                const cart = await cartManager.getCartById(cid);
                if (cart) {
                    res.status(200).json(await cartManager.deleteCartById(cid))
                } else {
                    res.status(404).json({ error: `Carrito con id: ${cid} no encontrado` });
                }
        });

export default routerCarts;