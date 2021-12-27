const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('person', function getPerson (req) {
    return JSON.stringify(req.body)
})

let persons = [
    {
        id: 1,
        name: "Arto Hellas ju ru ju ja ju",
        number: "040-123456"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
      {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
      }
]

const generateId = () => {
    const personId = Math.floor(Math.random() * 1000)
    return personId
}

app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    deletePerson = persons.find(p => p.id === id)

    if (deletePerson) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
      return response.status(400).json({ 
        error: 'name or number are missing' 
      })
    }

    let exist = persons.find(p => p.name === name)
    if (exist) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    // let id = generateId()
    // exist = persons.find(p => p.id===id)     
    // while (exist) {
    //     console.log('existe id')
    //     console.log(id)
    //     id = generateId()
    //     exist = persons.find(p => p.id===id) 
    // }

    let id;
    do {
        id = generateId()
        exist = persons.find(p => p.id===id) 
    } while (exist)

    const person = {
      id: id,
      name: name,
      number : number
    }    
    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const totalPersons = persons.length
    const date = new Date
    response.send(`<div>Phonebook has info for ${totalPersons} people</div>
                <div>${date}</div>`)
}) 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})