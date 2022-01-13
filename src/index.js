const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Mongoose = require('mongoose')
require('dotenv').config()

const authRouter = require('./routes/auth.router')
const indexRouter = require('./routes/index.router')

const port = process.env.PORT || 3001
const app = express()
const connection = Mongoose.connection

Mongoose.connect(process.env.CONNECTION_DB)
connection.on('error', () => console.log('Error al conectar a la base de datos.'))
connection.once('open', () => console.log('Base de datos conectada.'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/auth/', authRouter)
app.use('/', indexRouter)

app.listen(port, () => console.log(`Server run on port ${port}`))