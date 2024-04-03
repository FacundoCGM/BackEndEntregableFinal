import UsersMongo from "../daos/mongodb/usersDao.js"
import Services from "./classService.js"
import UserRepository from "../repository/userRepository.js"
import nodemailer from "nodemailer"
import 'dotenv/config'
const userRepository = new UserRepository()
const usersMongo = new UsersMongo()


export default class UserService extends Services {
    constructor() {
        super(usersMongo)
    }

    async register(user) {
        try {
            return await usersMongo.register(user)
        } catch (error) {
            console.error(error)
        }
    }

    async login(email, password) {
        try {
            return await usersMongo.login(email, password)
        } catch (error) {
            console.error(error)
        }
    }

    async getInfo(id) {
        try {
            const userInfo = await userRepository.getInfo(id)
            return userInfo
        } catch (error) {
            console.log(error)
          }
    }

    async deleteOldUsers() {
        try {
            const oldUsers = await usersMongo.deleteOldUsers()
            
            const transporter = nodemailer.createTransport({
                host: process.env.ETHEREAL_HOST,
                port: process.env.ETHEREAL_PORT,
                auth: {
                    user: process.env.ETHEREAL_USER_EMAIL,
                    pass: process.env.ETHEREAL_PASSWORD
                }
            })

            for (const user of oldUsers) {
                const mailOptions = {
                    from: process.env.ETHEREAL_USER_EMAIL,
                    to: user.email,
                    subject: 'Desactivación de cuenta.',
                    text: 'Su cuenta ha sido desactivada debido a inactividad.'
                }
    
                const mailSent = await transporter.sendMail(mailOptions)
                console.log(mailSent.messageId) 
            }

            return oldUsers
        } catch (error) {
            console.error(error)
        }
    }
}