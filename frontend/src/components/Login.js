import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { login } from './UserFunctions';
import FormValidator from './FormValidator';

const Login = () => {
  const navigate = useNavigate ();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
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
      field: 'password',
      method: 'isEmpty',
      validWhen: false,
      message: 'Password is required.',
    },
  ]);

  const [validation, setValidation] = useState(validator.valid());
  const [submitted, setSubmitted] = useState(false);

  const onChange = e => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const validation = validator.validate({ email, password });
    setValidation(validation);
    setSubmitted(true);

    if (validation.isValid) {
      const user = {
        email,
        password,
      };

      login(user).then(res => {
        if (res) {
          navigate("/task-list");
        } else {
          setErrors('Invalid email or password. Please try again.');
        }
      })
      .catch(error => {
        // Handle error from login API call if needed
        console.error('Login error:', error);
        setErrors('An error occurred while logging in. Please try again.');
      });
  }
};


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mt-5 mx-auto">
          <form>
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
            <div className="form-group">
            {errors && <div className="alert alert-danger">{errors}</div>}
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className={`form-control ${
                  submitted && validation.email.isInvalid ? 'is-invalid' : ''
                }`}
                name="email"
                placeholder="Enter email"
                value={email}
                onChange={onChange}
              />
              {submitted && validation.email.isInvalid && (
                <div className="invalid-feedback">{validation.email.message}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={`form-control ${
                  submitted && validation.password.isInvalid ? 'is-invalid' : ''
                }`}
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
              {submitted && validation.password.isInvalid && (
                <div className="invalid-feedback">{validation.password.message}</div>
              )}
            </div>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="btn btn-lg btn-primary btn-block"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
