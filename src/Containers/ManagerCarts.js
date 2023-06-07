import fs from 'fs';

class CartManager {

    constructor(path) {
        this.path = path;
        this.checkFileExists()
    }

    async checkFileExists() {
        try {
        await fs.promises.access(this.path);
        } catch (err) {
            await fs.promises.writeFile(this.path, "[]")
            console.log(`El archivo ${this.path} no existe`);
        }
    }

    async addNewCart() {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts();
            const newCart = {
                products: []
            }
            let lastId = allCarts.length > 0 ? allCarts[allCarts.length - 1].id : 0;
            newCart.id = lastId + 1;
            allCarts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
            
            return `Se creó el carro con id: ${newCart.id}.`
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async addProductToCart(idCart, idProduct) {
            
        let allCarts = await this.getCarts();
        const cart = await this.getCartById(idCart);
        if (!cart) {
            return false;
        }
        
        const existingProduct = cart.products.find((item) => item.product === idProduct);
        if (existingProduct) {
            existingProduct.quantity++; 
        } else {
            const product = {
                product: idProduct,
                quantity: 1,
                };
            cart.products.push(product);
        }
        const cartIndex = allCarts.findIndex((item) => item.id === idCart);
        if (cartIndex !== -1) {
            allCarts[cartIndex] = cart;
        }
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
        return cart;
    }

    async getCarts() {
        await this.checkFileExists()    
            try {
                let allCarts = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(allCarts);
            } catch (err) {
                console.log('Hubo un error: ' + err);
        }
    }

    async getCartById(cartId) {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts();
            let cart = allCarts.find((item) => item.id === cartId);
                if (cart) {
                    return cart;
                } else {
                    return false;
                }
            } catch (err) {
                console.log('Hubo un error: ' + err);
            }
    }

    async deleteCartById(idCart) {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts()
            let cart = allCarts.filter((item) => item.id !== idCart)
            await fs.promises.writeFile(this.path, JSON.stringify(cart, null, 2))
            return `Carrito con id: ${idCart} borrado exitosamente.`
        } catch (err) {
            console.log(err);
        }
    }

}

export default CartManager;

