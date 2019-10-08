import React, { useState, useEffect } from 'react';
import noteService from './services/notes'
import './App.css';
import { Table, Form, Button } from 'react-bootstrap'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newCategory, setNewCat] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note: returnedNote))
      })
  }

  const rows = () => notesToShow.map(note => 
    <tr key={note.id}>
      <td>{note.content}</td>
      <td>{note.category}</td>
      <td>
        {note.important
        ? <Button onClick={() => toggleImportanceOf(note.id)}>Not important</Button>
        : <Button onClick={() => toggleImportanceOf(note.id)}>Important</Button>
        }
      </td>
    </tr>
  )

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      category: newCategory,
      date: new Date(),
      important: false
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  return (
    <div className="container">
      <div>
        <Button variant="primary" onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </Button>
      </div>
      <Table striped>
        <tbody>
          {rows()}
        </tbody>
      </Table>
      <Form onSubmit={addNote}>
        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control
          value={newNote}
          onChange={handleNoteChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control 
          value={newCategory} 
          as="select"
          onChange={({ target }) => setNewCat(target.value)}>
          <option>Default</option>
          <option>tst</option>
          </Form.Control>
          <Button variant="primary" type="submit">save</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default App;
