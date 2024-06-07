import React, { useState, useEffect } from 'react';
import { fetchTodos } from './service/TodoService';
import Todo from './Todo';
import { List, Button, Container, Typography, Grid } from '@material-ui/core';

const TodoList = ({ add, delete: deleteTodo, update }) => {
    const [todos, setTodos] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState('id');
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadTodos();
    }, [page, size, sort]);

    const loadTodos = async () => {
        try {
            const response = await fetchTodos(page, size, sort);
            setTodos(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    return (
        <Container>
            <Typography variant="h4" style={{ margin: '16px 0' }}>오늘의 할일</Typography>
            <Grid container spacing={3} justify="space-between">
                <Grid item>
                    <Button onClick={handlePreviousPage} disabled={page === 0}>Previous</Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleNextPage} disabled={page >= totalPages - 1}>Next</Button>
                </Grid>
            </Grid>
            <List>
                {todos.map(todo => (
                    <Todo key={todo.id} item={todo} delete={deleteTodo} update={update} />
                ))}
            </List>
        </Container>
    );
};

export default TodoList;
