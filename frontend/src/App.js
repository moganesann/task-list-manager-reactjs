import React from 'react'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';


import NavigationBar from './components/NavigationBar';
import Home  from './components/Home';
import Login   from './components/Login';
import SignUp from './components/SignUp';
import TaskList  from './components/TaskList';

function App() {
  return (
    <BrowserRouter>
        <NavigationBar /> 
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/task-list" element={<TaskList />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
