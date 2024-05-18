import Product from "./product";
import rootDir from "../util/path";
import path from "path";
import fs from "fs/promises";

const filePath = path.join(path.dirname(rootDir), 'data', 'cart.json');

type ProductInCart = {
    product: Product,
    qty: number,
}

export default class Cart {

    private constructor(
        private products: ProductInCart[],
        private totalPrice: number
    ) { }

    private static async getCart() {

        let cart: Cart;

        try {
            const fileContent = await fs.readFile(filePath);
            const cartJson = JSON.parse(fileContent.toString()) as { products: ProductInCart[], totalPrice: number };

            cart = new Cart(cartJson.products, +cartJson.totalPrice);
        } catch (error: any) {
            console.log('Error fetching cart, creating a new one ...');
            console.log(error);
            cart = new Cart([], 0);
        }

        return cart;
    }

    private async saveCart() {
        const cart = this;
        console.log("Saving ", cart);
        try {
            await fs.writeFile(filePath, JSON.stringify(cart));
        } catch (error: any) {
            console.log('Error saving cart ...');
        }
    }

    static async addProduct(product: Product) {

        const cart = await Cart.getCart();

        const existingProductIndex = cart.products.findIndex(
            (p: ProductInCart) => p.product.id === product.id
        );

        // console.log('Existing product index: ', existingProductIndex);

        if (existingProductIndex >= 0) {
            /// If product already exists in cart, increase quantity
            cart.products[existingProductIndex].qty++;
        } else {
            /// else add product to cart
            cart.products.push({ product: product, qty: 1 });
        }

        cart.totalPrice += +product.price;

        await cart.saveCart();
    }

    static async deleteProduct(productId: string) {
        const cart = await Cart.getCart();

        const existingProductIndex = cart.products.findIndex(
            (p: ProductInCart) => p.product.id === productId
        );

        if (existingProductIndex >= 0) {
            /// If product exists in cart, remove it and update total price
            const product = cart.products[existingProductIndex];
            cart.totalPrice -= +product.product.price * +product.qty;

            /// Remove the product from the cart
            cart.products.splice(existingProductIndex, 1);
            await cart.saveCart();
        }

    }
}