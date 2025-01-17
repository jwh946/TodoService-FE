import React, { useState, useEffect } from 'react';
import { fetchTodos } from './service/TodoService';
import { call } from './service/ApiService';
import Todo from './Todo';
import { List, Button, Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Paper } from '@material-ui/core';

const TodoList = ({ add, delete: deleteTodo, update }) => {
    const [todos, setTodos] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState('createdAt');
    const [totalPages, setTotalPages] = useState(0);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const toggleSelect = (id) => {
        setSelectedItems((prevSelectedItems) => {
            const newSelectedItems = new Set(prevSelectedItems);
            if (newSelectedItems.has(id)) {
                newSelectedItems.delete(id);
            } else {
                newSelectedItems.add(id);
            }
            return newSelectedItems;
        });
    };

    const deleteBatch = () => {
        call("/todo/batch", "DELETE", Array.from(selectedItems)).then((response) => {
            setSelectedItems(new Set());
            loadTodos();
        });
    };

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <Grid container justify="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                <Grid item>
                    <TextField
                        label="검색"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ width: '200px', height: '40px', marginBottom: 16 }}
                    />
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" style={{ minWidth: 120 }}>
                        <InputLabel id="sort-label">정렬 기준</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sort}
                            onChange={handleSortChange}
                            label="정렬 기준"
                        >
                            <MenuItem value="createdAt">작성일</MenuItem>
                            <MenuItem value="title">제목</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Paper style={{ margin: 16 }}>
                <List>
                    {filteredTodos.map(todo => (
                        <Todo
                            key={todo.id}
                            item={todo}
                            delete={deleteTodo}
                            update={update}
                            toggleSelect={toggleSelect}
                            isSelected={selectedItems.has(todo.id)}
                        />
                    ))}
                </List>
            </Paper>
            <Grid container justify="space-between" alignItems="center" style={{ marginTop: '16px' }}>
                <Grid item>
                    <Button onClick={handlePreviousPage} disabled={page === 0}>Previous</Button>
                </Grid>
                <Grid item>
                    <Typography>{page + 1} / {totalPages}</Typography>
                </Grid>
                <Grid item>
                    <Button onClick={handleNextPage} disabled={page >= totalPages - 1}>Next</Button>
                </Grid>
            </Grid>
            <Button
                variant="contained"
                color="secondary"
                onClick={deleteBatch}
                disabled={selectedItems.size === 0}
                style={{ margin: 16 }}
            >
                Delete Selected
            </Button>
        </Container>
    );
};

export default TodoList;