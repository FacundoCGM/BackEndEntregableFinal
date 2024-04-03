import { Router } from "express"
import routerProducts from "./productsRouter.js"
import routerUsers from "./usersRouter.js"
import routerTicket from "./ticketRouter.js"
import routerCart from "./cartRouter.js"

export default class MainRouter {
    constructor() {
        this.router = Router()
        this.initRoutes()
    }

    initRoutes() {
        this.router.use("/products", routerProducts)
        this.router.use("/users", routerUsers)
        this.router.use("/ticket", routerTicket)
        this.router.use("/cart", routerCart)
    }

    getRouter() {
        return this.router
    }
}