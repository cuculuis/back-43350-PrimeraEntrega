import { Router } from "express";
import CartManager from "../Containers/ManagerCarts";
import { productManager } from "./routerProducts";

const cartManager = new CartManager("../DB/carts.txt")
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
        const cart = await cartManager.getCartById(idCart);
        if (!cart) {
            res.json(`No se encontró el carrito con id ${idCart}`);
        }
        const product = await productManager.getProductById(idProduct)
        if (!product){
            res.json(`No se encontró el producto con id ${idProduct}`);
        }
        
        await cart.products.push(productoId)
        
        await cartManager.updateCart(idCart, carrito);        
        
        res.json("Se agregó el producto con id: " + JSON.stringify(productoId.id))

    } catch (error) {
        res.json('No se pudo agregar al carrito con id: ' + idCarrito + ' el producto con id: ' + idProducto + ': ' + error)
    }
})

routerCarts.delete('/:cid', async (req, res) => {
    res.json(await cartManager.deleteCartById(parseInt(req.params.id)))
})

routerCarts.delete('/:cid/products/:pid', async (req, res) => {
    const idProducto = parseInt(req.params.id_prod);
    const idCarrito = parseInt(req.params.id);

    try {
            const carrito = await cartManager.getCartById(idCarrito);
            const index = carrito.productos.findIndex((prod) => prod.id === idProducto);
            if (index === -1) {
                throw new Error(`El producto con id ${idProducto} no se encuentra en el carrito n°: ${idCarrito}`);
            }
            await carrito.productos.splice(index, 1);

            await cartManager.updateCart(idCarrito, carrito)
            
            res.json('Se ha borrado el siguiente producto con el id: ' + idProducto)

        } catch (error) {
        throw new Error(`No se pudo eliminar el producto del carrito con id ${idCarrito} y idProducto ${idProducto}: ${error}`)
    }
})