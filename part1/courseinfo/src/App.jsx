const Header = (props) => {
  console.log(props)
  return <h1>{props.course}</h1>;
};

const Part = (props) => {
  return (
    <p>
      {props.row.name} {props.row.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      <h2>Content</h2>
      <Part row={props.data[0]} />
      <Part row={props.data[1]} />
      <Part row={props.data[2]} />
    </div>
  );
};

const Total = (props) => {
  return <p>Number of exercises {props.number}</p>;
};

const App = () => {

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

 


  return (
    <div>
      <Header course={course.name} />
      <Content data={course.parts} />
      <Total number={course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises} />
    </div>
  );
};

export default App;
