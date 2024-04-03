import { Router } from "express"
import * as cartController from "../controller/cartController.js"
import { checkUserRole } from "../middlewares/userVerification.js"

const routerCart = Router()

routerCart.post('/', cartController.newCart)

routerCart.post('/:cid/product/:pid', checkUserRole('user'), cartController.saveToCart)

routerCart.delete('/:cid', cartController.cleanCart)

routerCart.delete('/:cid/product/:pid', checkUserRole('user'), cartController.deleteOneProduct)

routerCart.put('/:cid/product/:pid', checkUserRole('user'), cartController.updateQuantity)

routerCart.put('/:cid', cartController.newProductsArrangement)

routerCart.get('/all', cartController.getCarts)

export default routerCart