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
            
        res.json(`Added product with id: ${idProduct} to cart with id ${idCart}.`)

        } catch (error) {
            res.status(400).json({ error: `Failed to add to cart with id: ${idCart} product with id: ${idProduct}.` })
        }
    })

    routerCarts.delete('/:cid', async (req, res) => {
        const cid = parseInt(req.params.cid);
                const cart = await cartManager.getCartById(cid);
                if (cart) {
                    res.status(200).json(await cartManager.deleteCartById(cid))
                } else {
                    res.status(404).json({ error: `Cart with id: ${cid} not found.` });
                }
        });

    routerCarts.delete('/:cid/products/:pid', async (req, res) => {
        const idProduct = parseInt(req.params.pid);
        const idCart = parseInt(req.params.cid);
        try {
            const productDeleted = await cartManager.deleteProductToCart(idCart, idProduct)
                if (productDeleted) {
                    res.status(200).json(`Deleted product with id: ${idProduct} to cart with id ${idCart}`)
                } else {
                    res.status(404).json({ error: `Product with id: ${idProduct} in cart: ${idCart} not found.` })
                }
        } catch (error) {
            res.status(400).json({ error: `Failed to delete cart with id: ${idCart} product with id: ${idProduct}.` })
        }
    })

export default routerCarts;