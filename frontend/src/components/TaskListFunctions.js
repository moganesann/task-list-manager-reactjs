import axios from 'axios';

export const getList = async (token) => {
  try {
    const res = await axios
      .get('/api/tasks', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
    res.data.status = 'success';
    return res.data;
  } catch (err) {
    return {
      error: 'Please login again!',
      status: 'failed',
      message: err.message
    };
  }
};

export const addTaskList = async (task) => {
  try {
    const response = await axios
      .post(
        '/api/task',
        {
          name: task.name,
          description: task.description,
          status: task.status,
          updatedAt: task.updatedAt
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': task.token
          }
        }
      );
    return response.data;
  } catch (err) {
    return {
      error: 'Error to add',
      status: 'failed',
      message: err.message
    };
  }
};

export const deleteItem = async (task, token) => {
  try {
    const response = await axios
      .delete(`/api/task/${task}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateItem = async (taskUpdateRequest) => {
  try{
  const response = await axios
    .put(
      `/api/task/${taskUpdateRequest.id}`,
      {
        name: taskUpdateRequest.name,
        description: taskUpdateRequest.description,
        status: taskUpdateRequest.status,
        updatedAt: taskUpdateRequest.updatedAt
      },

      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': taskUpdateRequest.token
        }
      }
    );
    console.log(taskUpdateRequest.updatedAt);
    console.log(response.data);

  return response.data;

    } catch (error) {
      // Log the error or handle it accordingly
      console.error('Error updating task:', error);
      throw error; // Re-throw the error to handle it further if needed
    }

    
};


