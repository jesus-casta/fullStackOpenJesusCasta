const Header = (props) => {
  return <h1>{props.name}</h1>;
};

const Course = (props) => {
  const total = props.course.parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
      <p>
        <strong>Total of exercises: {total}</strong>
      </p>
    </div>
  );
};

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => (
        <Part key={part.id} row={part} />
      ))}
    </div>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.row.name} {props.row.exercises}
    </p>
  );
};

const Courses = (props) => {
  return (
    <div>
      {props.courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ];

  return <Courses courses={courses} />;
};

export default App;
