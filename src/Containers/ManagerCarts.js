const fs = require('fs');


class CartManager {

    constructor(path) {
        this.path = path;
        this.idCart = 1;
        this.error = undefined;
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

    validateProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) 
        {
        return this.error = `campos incompletos`
        }
    }

    async addNewCart() {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts();
            const newCart = {
                products: []
            }
            newCart.id = this.idCart;
            allCarts.push(newCart);
            this.idCart++;
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
            
            return newCart.id;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
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
                    return `There is no cart with id: ${cartId}`;
                }
            } catch (err) {
                console.log('Hubo un error: ' + err);
            }
    }

    async updateCart(idCart, cartNow) {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCarts();
            const index = allCarts.findIndex((item) => item.id === idCart);
            if (index === -1) {
                return { error: 'producto no encontrado.'}
            }

            allCarts[index] = {...cartNow, id: idCart}
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2));
            return `Se actualizó el producto con id: ${idCart}`;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteAllCarts() {
        await this.checkFileExists()
        try {
            await fs.promises.writeFile(this.path, '[]');
            this.idCart = 1;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteCartById(idCart) {
        await this.checkFileExists()
        try {
            let allCarts = await this.getCartById()
            let cartDeleted = allCarts.filter((item) => item.id !== idCart)
            await fs.promises.writeFile(this.path, JSON.stringify(cartDeleted))
        } catch (err) {
            console.log(err);
        }
    }

}

export default CartManager;

