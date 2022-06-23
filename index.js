/* eslint-disable quotes */
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const axios = require('axios')

require("dotenv").config()

const Person = require('./models/person')

const PaymentController = require("./controllers/PaymentController")

const PaymentService = require("./services/PaymentService")

const PaymentInstance = new PaymentController(new PaymentService())

const app = express()

morgan.token('person', function getPerson (req) {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
  
    next(error)
}

app.get('/api/persons',(request, response, next) => {
    Person.find({})
        .then(persons => {
            // response.json(persons)
            response.json(persons.map(p => p.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id',(request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }      
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const {name, number} = request.body
    
    Person.find({name: name, number: number})
        .then(persons => {
            if (persons.length > 0) {
                return response.status(400).json({ 
                    error: 'that number already exists for that name' 
                })
            } else {
                const person = new Person({
                    name: name,
                    number : number
                })
                person.save()
                    .then(savedPerson => {
                        response.json(savedPerson)
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.countDocuments({}, (err, count) => {
        if (err) { 
            return response.status(400).send()
        } //handle possible errors
        const date = new Date
        response.send(`<h1>Phonebook has info for ${count} people</h1>
                <div>${date}</div>`)
    }) 
}) 

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
  
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person,{ new: true, runValidators: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/payment-test', (req, res) => {
    PaymentInstance.getPaymentLink(req, res)
    // console.log('Got body:', req.body);
    // res.sendStatus(200);
})

app.post('/payment', async (req, res) => {
    const body = req.body

    // const body = {
    //     payer_email: "test_user_24559756@testuser.com",
    //     items: [
    //         {
    //             title: "Dummy Title",
    //             description: "Dummy description",
    //             picture_url: "http://www.myapp.com/myimage.jpg",
    //             category_id: "category123",
    //             quantity: 1,
    //             unit_price: 50
    //         }
    //     ],
    //     back_urls: {
    //         failure: "https://google.com.ar",
    //         pending: "https://google.com.ar",
    //         success: "https://google.com.ar"
    //     }
    // }

    try {
        const {data} = await axios.post('https://api.mercadopago.com/checkout/preferences', body, {
            headers: {
                'Content-Type': 'application/json',
                // eslint-disable-next-line no-undef
                // Authorization: 'Bearer APP_USR-8882286153796418-062008-ef881bbec8fedd975510644fa943091f-1145863615'

                // eslint-disable-next-line no-undef
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        })

        console.log(data)

        res.status(200).json(data)   
        
    } catch (error) {
        console.log(error.message)
    }
    
    // res.send("OK")
})


app.get('/rick', async (req, res) => {
    try {
        const {data}  = await axios.get('https://rickandmortyapi.com/api/character')
        console.log(data)
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

app.post('/info', function (req, res) {

    const body = req.body

    taxee(body).then(function(payment){
        res.send(payment)
    // eslint-disable-next-line no-unused-vars
    }).catch(function (error) {
        res.render('error')
    })

})

function taxee(body) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {

        
        axios.post('https://api.mercadopago.com/checkout/preferences', body, {
            //data sent to Taxee.io
            headers: {
                'Content-Type': 'application/json',
                // eslint-disable-next-line no-undef
                // Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                Authorization: 'Bearer APP_USR-8882286153796418-062008-ef881bbec8fedd975510644fa943091f-1145863615'
            }
            
        }).then(function (response) {
            // var taxData = {
            //     income: '$' + income
            //     , fica: response.data.annual.fica.amount
            //     , federal: response.data.annual.federal.amount
            //     , stateTax: response.data.annual.state.amount
            //     , state
            //     , zip: zip
            // }
            resolve(response.data)
        }).catch(function (error) {
            console.log('break')
            resolve(error)
        })
    })
}


  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})