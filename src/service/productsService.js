import ProductsMongo from "../daos/mongodb/productsDao.js"
import Services from "./classService.js"
import nodemailer from "nodemailer"
import 'dotenv/config'
const productsMongo = new ProductsMongo()


export default class ProductService extends Services {
    constructor() {
        super(productsMongo)
    }

    async getProducts(page, limit, category, sort) {
        try {
            return await productsMongo.getProducts(page, limit, category, sort)
        } catch(error) {
            console.error(error)
        }
    }

    async updateProduct(pid, obj) {
        try {
            return await productsMongo.updateProduct(pid, obj)
        } catch(error) {
            console.error(error)
        }
    }

    async createWithOwner(obj, owner) {
        try {
            obj.product_owner = owner
            const product = await productsMongo.createWithOwner(obj)
            return product
        } catch(error) {
            console.error(error)
        }
    }

    async deleteWithOwner(pid) {
        try {
            const productToDelete = await productsMongo.findById(pid)
            const mailToSend = productToDelete.owner
            const deletedProduct = await productsMongo.deleteWithOwner(pid)

            const transporter = nodemailer.createTransport({
                host: process.env.ETHEREAL_HOST,
                port: process.env.ETHEREAL_PORT,
                auth: {
                    user: process.env.ETHEREAL_USER_EMAIL,
                    pass: process.env.ETHEREAL_PASSWORD
                }
            })

            const mailOptions = {
                from: process.env.ETHEREAL_USER_EMAIL,
                to: mailToSend,
                subject: 'Se borro su producto.',
                text: 'Un producto perteneciente a usted se ha borrado de nuestra base de datos.'
            }

            const mailSent = await transporter.sendMail(mailOptions)
            console.log(mailSent.messageId)

            return deletedProduct

        } catch(error) {
            console.error(error)
        }
    }
}