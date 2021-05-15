import { useEffect } from 'react';

const Dummy = () => {
  useEffect(() => {
    fetch('/dummy', { credentials: 'include' })
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => console.log(error));
  }, []);

  const onPress = () => {
    fetch('/v1/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailAddress: 'varun.h.khatri@gmail.com',
        password: 'varun123',
      }),
    })
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

export default Dummy;
