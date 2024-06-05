const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sergiogcidm:${password}@notes.pc0kh7t.mongodb.net/appNotes?retryWrites=true&w=majority&appName=Notes`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'MongooseSH too much easy!',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})