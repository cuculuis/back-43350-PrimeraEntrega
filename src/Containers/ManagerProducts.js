const fs = require('fs');


class ProductManager {

    constructor(path) {
        this.path = path;
        this.idProducts = 1;
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

    async checkCodeExists(code) {
        const products = await this.getProducts();
        const existingProduct = products.find(product => product.code === code);
        if (existingProduct) {
            console.log(`El código ${code} ya existe`);
            return false;
        }
        return true;
    }

    async addProduct(newProduct) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts();

            if  (this.validateProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock)) {
                return `Faltan campos`
            }
            
            if (!await this.checkCodeExists(newProduct.code)) {
                return `No se puede agregar el producto. Code: ${code} duplicado`
            }
            newProduct.id = this.idProducts;
            allProducts.push(newProduct);
            this.idProducts++;
            await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2));
            
            return newProduct.id;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async getProducts() {
        await this.checkFileExists()    
            try {
                let allProducts = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(allProducts);
            } catch (err) {
                console.log('Hubo un error: ' + err);
        }
    }

    async getProductById(productId) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts();
            let product = allProducts.find((item) => item.id === productId);
                if (product) {
                    return product;
                } else {
                    return `No hay productos con id: ${productId}`;
                }
            } catch (err) {
                console.log('Hubo un error: ' + err);
            }
    }

    async updateProduct(idProduct, productNow) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts();
            const index = allProducts.findIndex((item) => item.id === idProduct);
            if (index === -1) {
                return { error: 'producto no encontrado.'}
            }

            allProducts[index] = {...productNow, id: idProduct}
            await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2));
            return `Se actualizó el producto con id: ${idProduct}`;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteAllProducts() {
        await this.checkFileExists()
        try {
            await fs.promises.writeFile(this.path, '[]');
            this.idProducts = 1;
        } catch (err) {
            console.log('Hubo un error: ' + err);
        }
    }

    async deleteProductById(idProduct) {
        await this.checkFileExists()
        try {
            let allProducts = await this.getProducts()
            let product = allProducts.filter((item) => item.id !== idProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(product))
        } catch (err) {
            console.log(err);
        }
    }

}

export default ProductManager;

