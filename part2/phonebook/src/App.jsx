import { useState, useEffect } from 'react';

// Componente para mostrar el filtro
const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input name="filter" value={filter} onChange={handleFilterChange} />
  </div>
);

// Componente para el formulario de agregar contacto
const PersonForm = ({ newName, newNumber, handleInputChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <h3>Add a new</h3>
    <div>
      name: <input name="newName" value={newName} onChange={handleInputChange} />
    </div>
    <div>
      number: <input name="newNumber" value={newNumber} onChange={handleInputChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

// Componente para mostrar la lista de contactos con botón de eliminación
const Persons = ({ persons, deletePerson }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        {person.name} - {person.number}
        <button onClick={() => deletePerson(person.id)}>Delete</button>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  // Obtener los datos de la API al cargar el componente
  useEffect(() => {
    fetch('http://localhost:3001/persons')  // Cambio de puerto
      .then(response => response.json())
      .then(data => setPersons(data));
  }, []);

  // Manejador genérico para cambios en inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'newName') setNewName(value);
    if (name === 'newNumber') setNewNumber(value);
    if (name === 'filter') setFilter(value);
  };

  // Agregar una nueva persona o actualizar el número si ya existe
  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      // Si la persona ya existe, actualizamos su número
      const updatedPerson = { ...existingPerson, number: newNumber };
      fetch(`http://localhost:3001/persons/${existingPerson.id}`, {  // Cambio de puerto
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPerson),
      })
        .then((response) => response.json())
        .then((data) => {
          setPersons(persons.map((person) =>
            person.id === data.id ? data : person
          ));
          setNewName('');
          setNewNumber('');
        });
    } else {
      // Si no existe, agregamos la nueva persona
      const newPerson = { name: newName, number: newNumber };
      fetch('http://localhost:3001/persons', {  // Cambio de puerto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPerson),
      })
        .then((response) => response.json())
        .then((data) => {
          setPersons(persons.concat(data));
          setNewName('');
          setNewNumber('');
        });
    }
  };

  // Eliminar una persona
  const deletePerson = (id) => {
    fetch(`http://localhost:3001/persons/${id}`, {  // Cambio de puerto
      method: 'DELETE',
    })
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  // Filtrar contactos según el texto del filtro
  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleInputChange} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleInputChange={handleInputChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
