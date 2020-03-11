import React, { useState, useRef } from "react";
const Todo = () => {
    const [todos, setTodos] = useState([
        { id: 1, item: "Fix bugs" },
        { id: 2, item: "Take out the trash" }
    ]);
    const [username, setusername] = useState('');
    const todoRef = useRef();
    const removeTodo = id => {
        setTodos(todos.filter(todo => todo.id !== id));
    };
    const addTodo = data => {
        let id = todos.length + 1;
        setTodos([
            ...todos,
            {
                id,
                item: data
            }
        ]);
    };
    const handleNewTodo = e => {
        e.preventDefault();
        const item = todoRef.current;
        addTodo(item.value);
        item.value = "";
    };
    const handleInputChange = (event) => {
       setusername(event.target.value)
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <h2>Add Todo</h2>
                </div>
            </div>
            <form>
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            name='username'
                            autoFocus
                            ref={todoRef}
                            placeholder="Enter a task"
                            className="form-control"
                            data-testid="input"
                            onChange={handleInputChange}
                            value={username}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button
                            type="submit"
                            onClick={handleNewTodo}
                            className="btn-custom"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            </form>
            <div className="row todo-list">
                <div className="col-md-6">
                    <h3>Lists</h3>
                    {!todos.length ? (
                        <div className="no-task">No task!</div>
                    ) : (
                        <ul data-testid="todos">
                            {todos.map(todo => {
                                return (
                                    <li key={todo.id}>
                                        <div>
                                            <span>{todo.item}</span>
                                            <button
                                                className="btn btn-danger"
                                                data-testid="delete-button"
                                                onClick={() => removeTodo(todo.id)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Todo;

