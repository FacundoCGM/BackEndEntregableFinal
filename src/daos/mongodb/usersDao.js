import { UserModel } from "./models/usersModel.js"
import { hashPass, validPassword } from "../../utils.js"
import MongoDao from "./mongoDao.js"
import 'dotenv/config'


export default class UsersMongo extends MongoDao {
    constructor() {
        super(UserModel)
    }

    async findByEmail(email) {
        try {
            return await UserModel.findOne({ email })
        } catch (error) {
            console.error(error)
        }
    }

    async register(user) {
        try {
            const { email, password } = user
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                return await UserModel.create({...user, password: hashPass(password), role: 'admin'})
            }
            const userExists = await this.findByEmail(email)
            if (!userExists) return await UserModel.create({...user, password: hashPass(password)})
            else return false
        } catch (error) {
            console.error(error)
        }
    }
    
    async login(email, password) {
        try {
            const userExists = await UserModel.findOne({ email })
            if (userExists) {
                const validatedPassword = validPassword(password, userExists)
                if (validatedPassword) {
                    await this.updateConnection(userExists._id)
                    return userExists
                } else return false
            } else return false
        } catch (error) {
            console.error(error)
        }
    }

    async updateConnection(uid) {
        try {
            await UserModel.findByIdAndUpdate(uid, { last_connection: new Date() })
        } catch (error) {
            console.error(error)
        }
    }

    async deleteOldUsers() {
        try {
            const oldUsers = await UserModel.find({ last_connection: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } })
            console.log(oldUsers)
            await UserModel.deleteMany({ _id: { $in: oldUsers.map(user => user._id) } })
            return oldUsers
        } catch (error) {
            console.error(error)
        }
    }
}