import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    fetch('/dummy', { credentials: 'include' })
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => console.log(error));
  }, []);

  const onPress = () => {
    fetch('/dummy/check', { method: 'POST', credentials: 'include' })
      .then((response) => {
        console.log(response.status);

        return response.json();
      })
      .then((json) => console.log(json))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Hello From React!!</h1>
      <button onClick={onPress}>Press</button>
    </div>
  );
};

export default App;
