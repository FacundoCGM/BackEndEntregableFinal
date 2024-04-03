import express from 'express'
import { __dirname } from './utils.js'
import { errorHandler } from './middlewares/errorHandler.js'
import 'dotenv/config'
import './db/database.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { info } from './docs/info.js'
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import MainRouter from './routes/index.js'


const app = express()

const specs = swaggerJSDoc(info)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.use(errorHandler)

const mongoStoreOptions = {
    store: MongoStore.create({
      mongoUrl: process.env.MONGOOSEURL,
      ttl: 180,
      crypto: {
        secret: process.env.MONGO_STORE_SECRET
      }
    }),
    secret: process.env.MONGO_STORE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 180000
    }
}

app.use(session(mongoStoreOptions))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

const mainRouter = new MainRouter()
app.use('/api', mainRouter.getRouter())

app.listen(process.env.PORT, () => {
    console.log(`servidor levantado correctamente en puerto ${process.env.PORT}`)
})