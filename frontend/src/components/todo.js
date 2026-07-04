import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemIcon, Checkbox, ListItemText, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:5000/api/todo/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (!task) return;
    await axios.post('http://localhost:5000/api/todo/todos', { task });
    setTask('');
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`http://localhost:5000/api/todo/todos/${todo.id}`, { completed: !todo.completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todo/todos/${id}`);
    fetchTodos();
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        React MUI Todo List
      </Typography>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="New Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Button variant="contained" color="primary" style={{ marginLeft: '1rem' }} onClick={addTodo}>
          Add
        </Button>
      </div>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} dense button onClick={() => toggleComplete(todo)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={todo.completed}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.task}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                flex: 1,
              }}
            />
            <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;