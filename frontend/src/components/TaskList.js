import React, { useEffect, useState } from 'react';
import { getList, addTaskList, deleteItem, updateItem } from './TaskListFunctions';
import FormValidator from './FormValidator';

const TaskList = () => {

  const validator = new FormValidator([
    {
      field: 'task',
      method: 'isEmpty',
      validWhen: false,
      message: 'Task name is required'
    },
    {
      field: 'status',
      method: 'isEmpty',
      validWhen: false,
      message: 'Status is required'
    },
    {
      field: 'details',
      method: 'isEmpty',
      validWhen: false,
      message: 'Description is required'
    },
  ]);

  const initialValidation = validator.valid(); // Initialize validation object

  const [id, setId] = useState('');
  const [task, setTask] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState(0);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [items, setItems] = useState([]);
  const [validation, setValidation] = useState(initialValidation);

  const resetState = () => {
    setId('');
    setTask('');
    setDetails('');
    setStatus(0);
    setCreatedAt('');
    setUpdatedAt('');
    setIsUpdate(false);
    setErrorMessage('');
    setItems([]);
    setValidation(initialValidation);
  }

  // const [listState, setListState] = useState({
  //   id: '',
  //   task: '',
  //   details: '',
  //   status: 0,
  //   createdAt: '',
  //   updatedAt: '',
  //   isUpdate: false,
  //   errorMessage: '',
  //   items: [],
  //   validation: initialValidation,
  // });



  useEffect(() => {
    const token = localStorage.usertoken;
    getAll(token);
  }, []);

  const onChange = (e) => {
    // setValidation(initialValidation);
    // setErrorMessage('');

  if (e.target.name === 'status') {
    setStatus(parseInt(e.target.value));
  } else if (e.target.name === 'task') {
    setTask(e.target.value);
  } else if (e.target.name === 'details'){
    setDetails(e.target.value);
  }
  
    // setListState({ ...listState, [e.target.name]: e.target.value });

  };

  const onCreate = (e) => {
    e.preventDefault();
    const token = localStorage.usertoken;
    resetState();
    getAll(token);
  };

  const getStatus = (statusCode) => {
    const status = ['Start', 'In Progress', 'Completed'];
    return status[statusCode];
  };

  const formatDate = (date) => {
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ', ' + date.getFullYear();
  };


  const getAll = (token) => {
    getList(token)
      .then((data) => {
        if (data.status !== 'success') {
          localStorage.removeItem('usertoken');
          this.props.navigate("/login");
        } else {
          setTask('');
          // setDetails('');
          setItems([...data]);
        }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Error fetching data');
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validation = validator.validate({ task, status, details });
    setValidation(validation);

    if (validation.isValid) {
      const token = localStorage.usertoken;

      const formattedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const taskRequest = {
        token: token,
        name: task,
        description: details,
        status: status,
        updatedAt: formattedDateTime
      };

      addTaskList(taskRequest)
        .then(() => getAll(token))
        .then(() => {
          setIsUpdate(false);
          setStatus(0);
          setTask('');
          setDetails('');
        })
        .catch((err) => {
          setErrorMessage(err.message);
        });
    }
  };

  const onUpdate = (e) => {
    e.preventDefault();
    const validation = validator.validate({ id, task, status, details });
    setValidation(validation);

    if (validation.isValid) {
      const token = localStorage.usertoken;


      const formattedDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const taskUpdateRequest = {
        id: id,
        token: token,
        name: task,
        description: details,
        status: status,
        updatedAt: formattedDateTime
      };
      

      updateItem(taskUpdateRequest)
        .then(() => getAll(token))
        .then(() => {
          setIsUpdate(false);
          setStatus(0);
          setTask('');
          setDetails(''); // Clear details state after successful update
        })
        .catch((err) => {
          setErrorMessage(err.message);
          setIsUpdate(false);
        });
    }

  };

  const onEdit = (item_id, item, details, status, e) => {
    e.preventDefault();
    setId(item_id);
    setTask(item);
    setDetails(details);
    setStatus(status);
    setErrorMessage('');
    setIsUpdate(true);
    setValidation(initialValidation);
  };

  const onDelete = (val, e) => {
    e.preventDefault();
    const token = localStorage.usertoken;
    deleteItem(val, token)
      .then((res) => {
        if (res.data.status === 'failed') {
          setErrorMessage(res.data.message);
        }
        getAll(token);
      })
      .catch((err) => {
        setErrorMessage(err.data.message);
      });
  };

  return (
    <div className="row">
      <div className="col-md-12 mt-5">
        <div className="col-md-12">
          {errorMessage !== '' ?
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error Message: </strong> {errorMessage}
            </div>
            :
            <div></div>
          }
        </div>
        <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="task">Task Title</label>
        <div className="row">
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              value={task}
              name="task"
              onChange={onChange}
            />
            <span className="help-block">{validation.task.message}</span>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="details">Description</label>
        <div className="row">
          <div className="col-md-12">
            <input
              type="text"
              className="form-control"
              value={details}
              name="details"
              onChange={onChange}
            />
            <span className="help-block">{validation.details.message}</span>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="status">Task Status</label>
        <div className="row">
          <div className="col-md-12">
            <select
              className="form-control"
              value={status}
              name="status"
              onChange={onChange}
            >
              <option value="0">Start</option>
              <option value="1">In Progress</option>
              <option value="2">Completed</option>
            </select>
            <span className="help-block">{validation.status.message}</span>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary btn-block"
        onClick={onUpdate}
        style={isUpdate ? {} : { display: 'none' }}
      >
        Update
      </button>
      <button
        type="submit"
        className="btn btn-success btn-block"
        onClick={onSubmit}
        style={isUpdate ? { display: 'none' } : {}}
      >
        Submit
      </button>
      <button
        onClick={onCreate}
        className="btn btn-info btn-block"
        style={isUpdate ? {} : { display: 'none' }}
      >
        Create New
      </button>
    </form>
        <table className="table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Created Date</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
          <tr key={index}>
          <td className={`text-left ${item.status === 2 ? 'crossed-out' : ''}`}>{item.name}</td>
          <td className={`text-left ${item.status === 2 ? 'crossed-out' : ''}`}>{item.description}</td>
          <td className="text-left">{getStatus(item.status)}</td>
          <td className="text-left">{formatDate(new Date(item.updatedAt))}</td>
          <td className="text-left">{formatDate(new Date(item.createdAt))}</td>
          <td className="text-right">
            <button
              className="btn btn-info mr-1"
              disabled={item.status === 2}
              onClick={(e) => onEdit(item.id, item.name, item.description, item.status, e)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => onDelete(item.id, e)}
              style={{ display: isUpdate ? 'none' : '' }}
            >
              Delete
            </button>
          </td>
        </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;