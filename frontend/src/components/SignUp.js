import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from './UserFunctions';
import FormValidator from './FormValidator';

const SignUp = () => {
  const navigate = useNavigate();

  const validator = new FormValidator([
    {
      field: 'email',
      method: 'isEmpty',
      validWhen: false,
      message: 'Email is required.',
    },
    {
      field: 'email',
      method: 'isEmail',
      validWhen: true,
      message: 'That is not a valid email.',
    },
    {
      field: 'name',
      method: 'isEmpty',
      validWhen: false,
      message: 'Name is required.',
    },
    {
      field: 'password',
      method: 'isEmpty',
      validWhen: false,
      message: 'Password is required.',
    },
  ]);

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    errors: {},
    validation: validator.valid(),
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const validation = validator.validate(state);
    setState({ ...state, validation });

    if (validation.isValid) {
      const newUser = {
        name: state.name,
        email: state.email,
        password: state.password,
      };
      signup(newUser).then(() => {
        navigate("/login");
      });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mt-5 mx-auto">
          <form>
            <h1 className="h3 mb-3 font-weight-normal">Sign Up</h1>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter your full name"
                required
                value={state.name}
                onChange={onChange}
              />
              <span className="help-block">{state.validation.name.message}</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                required
                value={state.email}
                onChange={onChange}
              />
              <span className="help-block">{state.validation.email.message}</span>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                required
                value={state.password}
                onChange={onChange}
              />
              <span className="help-block">{state.validation.password.message}</span>
            </div>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="btn btn-lg btn-primary btn-block"
            >
              Sign Up!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
