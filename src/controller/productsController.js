import ProductService from '../service/productsService.js'
import Controllers from './classController.js'
const productService = new ProductService()
import { HttpResponse, errorsDictionary } from '../../utils/httpResponse.js' 
import { logger } from '../../utils/logger.js' 
const httpResponse = new HttpResponse()



export default class ProductController extends Controllers {
    constructor() {
        super(productService)
    }

    async getProducts(req, res, next) {
        try {
            const {page, limit, category, sort} = req.query
            const products = await productService.getProducts(page, limit, category, sort)
            if(!products){
                return httpResponse.NotFound(res, errorsDictionary.FIND)
            } else {
                return httpResponse.Ok(res, products)
            }
        } catch(error) {
            logger.error('Error crítico')
            next(error)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { pid } = req.params
            const { obj } = req.body
            const updatedProduct = await productService.updateProduct(pid, obj)
            if(!updatedProduct){
                return httpResponse.Unauthorized(res, errorsDictionary.UPDATE)
            } else {
                return httpResponse.Ok(res, updatedProduct)
            }
        } catch(error) {
            logger.error('Error crítico')
            next(error)
        } 
    }

    async createWithOwner(req, res, next) {
        try {
            const { email } = req.user
            const product = await productService.createWithOwner(req.body, email)
            if(!product){
                return httpResponse.NotFound(res, errorsDictionary.CREATE)
            } else {
                return httpResponse.Ok(res, product)
            }
        } catch(error) {
            logger.error('Error crítico')
            next(error)
        }
    }

    async deleteWithOwner(req, res, next) {
        try {
            const { pid } = req.params
            const deletedProduct = await productService.deleteWithOwner(pid)
            if(!deletedProduct){
                return httpResponse.NotFound(res, errorsDictionary.DELETE)
            } else {
                return httpResponse.Ok(res, deletedProduct)
            }
        } catch(error) {
            logger.error('Error crítico')
            next(error)
        }
    }
}