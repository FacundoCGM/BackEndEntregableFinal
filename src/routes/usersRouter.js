import { Router } from "express"
import UserController from "../controller/usersController.js"
import { checkUserRole } from "../middlewares/userVerification.js"
const usersController = new UserController()

const routerUsers = Router()

routerUsers.post('/register', usersController.register)

routerUsers.post('/login', usersController.login)

routerUsers.get('/current/:id', usersController.getInfo)

routerUsers.get('/', checkUserRole('admin'), usersController.getAll)

routerUsers.delete('/', checkUserRole('admin'), usersController.deleteOldUsers)

export default routerUsers