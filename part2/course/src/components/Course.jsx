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

export default Course