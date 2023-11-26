import axios from 'axios';

export const signup = async (newUser) => {
  const response = await axios
    .post('/users/signup', {
      name: newUser.name,
      email: newUser.email,
      password: newUser.password
    });
  console.log('Profile Successfully Created');
};

export const login = async (user) => {
  try {
    const response = await axios
      .post('/users/login', {
        email: user.email,
        password: user.password
      });
    localStorage.setItem('usertoken', response.data.token);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};


