import { Router } from "express"
import ProductController from "../controller/productsController.js"
import { checkUserRole } from "../middlewares/userVerification.js"
const controller = new ProductController()

const routerProducts = Router()

routerProducts.get('/', controller.getProducts)

routerProducts.get('/:pid', controller.findById)

routerProducts.put('/:pid', checkUserRole('admin'), controller.updateProduct)

routerProducts.delete('/:pid', checkUserRole(['admin', 'premium']), controller.deleteWithOwner)

routerProducts.post('/', checkUserRole(['admin', 'premium']), controller.createWithOwner)

export default routerProducts