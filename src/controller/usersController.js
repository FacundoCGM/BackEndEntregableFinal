import UserService from '../service/usersService.js'
import Controllers from './classController.js'
const userService = new UserService()
import { HttpResponse, errorsDictionary } from '../../utils/httpResponse.js' 
import { logger } from '../../utils/logger.js' 
const httpResponse = new HttpResponse()

export default class UserController extends Controllers {
    constructor () {
        super(userService)
    }

    async login(req, res, next) {
        try {
            const { email, password} = req.body
            const loginSuccessful = await userService.login(email, password)
            if(!loginSuccessful){
                return httpResponse.NotFound(res, errorsDictionary.LOGIN)
            } else {
                return httpResponse.Ok(res, loginSuccessful)
            }
        } catch (error) {
            logger.error('Error crítico')
            next(error.message)
        }
    }

    async register(req, res, next) {
        try {
            const registerSuccessful = await userService.register(req.body)
            if(!registerSuccessful){
                return httpResponse.NotFound(res, errorsDictionary.CREATE)
            } else {
                return httpResponse.Ok(res, registerSuccessful)
            }
        } catch (error) {
            logger.error('Error crítico')
            next(error.message)
        }
    }

    async getInfo(req, res, next) {
        try {
            const { id } = req.params
            const userInfo = await userService.getInfo(id)
            if(!userInfo){
                return httpResponse.NotFound(res, errorsDictionary.FIND)
            } else {
                return httpResponse.Ok(res, userInfo)
            }
        } catch (error) {
            logger.error('Error crítico')
            next(error.message)
          }
    }

    async deleteOldUsers(req, res, next) {
        try {
            const deletedUsers = await userService.deleteOldUsers()
            if(!deletedUsers){
                return httpResponse.NotFound(res, errorsDictionary.DELETE)
            } else {
                return httpResponse.Ok(res, deletedUsers)
            }
        } catch (error) {
            logger.error('Error crítico')
            next(error.message)
        }
    }
}

