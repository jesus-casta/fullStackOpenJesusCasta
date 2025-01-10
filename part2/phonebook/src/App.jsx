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

// Componente para mostrar la lista de contactos
const Persons = ({ persons }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        {person.name} - {person.number}
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
    fetch('http://localhost:3001/persons')
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

  // Agregar una nueva persona
  const addPerson = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    
    // Enviar el nuevo contacto a la API para agregarlo
    fetch('http://localhost:3001/persons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPerson),
    })
      .then(response => response.json())
      .then(data => {
        setPersons(persons.concat(data));
        setNewName('');
        setNewNumber('');
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
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
