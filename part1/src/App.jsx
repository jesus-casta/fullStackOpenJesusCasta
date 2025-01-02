const Header = (props) => {
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
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;
  const data_all = [
    { name: part1, exercises: exercises1 },
    { name: part2, exercises: exercises2 },
    { name: part3, exercises: exercises3 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content data={data_all} />
      <Total number={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
