import React, {useState, useEffect} from 'react';
import Base from 'terra-base';
import logo from './logo.svg';
import './App.css';
import Button from "terra-button";
import Spacer from "terra-spacer";
import InputField from "terra-form-input/lib/InputField";
import Arrange from "terra-arrange";
import Input from 'terra-form-input';
import Divider from 'terra-divider';
import Table from 'terra-table/lib/Table';
import IconEdit from 'terra-icon/lib/icon/IconEdit';
import { fetchGetItems, fetchAddItem, fetchDeleteItem, fetchUpdateItem } from './dataFetchers';
import uuid from 'uuid';

function Todo({ todo, _id, completeTodo, removeTodo, updateTodo, isLoading }) {
    const [editedtodovalue, seteditedtodovalue] = useState("");
    const [editingtodo, seteditingtodo] = useState(false);

    const handleEditedTodoSubmit = e => {
        e.preventDefault();
        updateTodo(todo._id, editedtodovalue);
        seteditingtodo(false);
    }

    const editTodoButtonClicked = () => {
        seteditingtodo(true);
        seteditedtodovalue(todo.text);
    }

    return (
        <Table.Row
            key={todo._id}
            style={{
                backgroundColor: todo.isCompleted ? "#BCE1A3" : ""
            }}
        >
            <Table.Cell
                content={
                    editingtodo ? 
                    <form onSubmit={handleEditedTodoSubmit}>
                        <InputField
                            inputId="todoInput"
                            name="todo"
                            value={editedtodovalue}
                            label="Edit Todo"
                            help="Press 'Enter' to finish editing"
                            onChange={e => seteditedtodovalue(e.target.value)}
                        />
                    </form>
                    : todo.text
                }
                key="TODO"
            />
            <Table.Cell content={todo.date} key="DATE"/>
            <Table.Cell 
                content={
                    <div>
                        <Button text={todo.isCompleted ? "Undo" : "Complete"} isCompact onClick={completeTodo(todo._id)} isDisabled={isLoading}/>
                        <Button text={"Edit"} icon={<IconEdit />} isCompact onClick={editTodoButtonClicked} isDisabled={isLoading}/>
                        <Button text="Delete" isCompact onClick={removeTodo(todo._id)} isDisabled={isLoading}/>
                    </div>
                }
                key="ACTIONS"
            />
        </Table.Row>
    );
}

function TodoForm({ addTodo }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        setValue("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <Spacer margin="small">
                <InputField
                    inputId="todoInput"
                    name="todo"
                    value={value}
                    label="Add a new Todo"
                    help="Press 'Enter' to submit a Todo"
                    onChange={e => setValue(e.target.value)}
                />
            </Spacer>
        </form>
    );
}

function TodoTable({ todos, completeTodo, removeTodo, updateTodo, isLoading }) {
    return (
        <Spacer margin="small">
            <Table isStriped={true}>
                <Table.Header>
                    <Table.HeaderCell content="Todo" key="TODO" minWidth="large" />
                    <Table.HeaderCell content="Date" key="DATE" minWidth="small" />
                    <Table.HeaderCell content="Actions" key="ACTIONS" minWidth="small" />
                </Table.Header>
                <Table.Rows>
                    {
                        todos.map((todo, index) => (
                            <Todo
                                key={index}
                                todo={todo}
                                completeTodo={completeTodo}
                                removeTodo={removeTodo}
                                updateTodo={updateTodo}
                                isLoading={isLoading}
                            />
                            ))
                    }
                </Table.Rows>
            </Table>
        </Spacer>
    );
}

function App() {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGetItems({setIsLoading, setTodos});
    }, []);

    const addTodo = (text) => {
        const newTodo = { text, date: new Date().toLocaleString(), isCompleted: false };
        // Update DB
        fetchAddItem({newTodo, setIsLoading}).then((res) => {
            if (res.status == 200) {
                // Pull from DB to update UI
                fetchGetItems({setIsLoading, setTodos});
            } else {
                console.log("request failed!");
            }
        });
    }
        
    const completeTodo = _id => () => {
        const newTodo = [...todos].find(todo => todo._id === _id);
        newTodo.isCompleted = !newTodo.isCompleted;
        fetchUpdateItem({newTodo, _id, setIsLoading});
    }

    const removeTodo = id => () => {
        // Update DB
        fetchDeleteItem({setIsLoading, id}).then(() => { fetchGetItems({setIsLoading, setTodos}) });
    }

    const updateTodo = (_id, newText) => {
        const newTodo = [...todos].find(todo => todo._id === _id);
        debugger;
        newTodo.text = newText;
        fetchUpdateItem({newTodo, _id, setIsLoading});
    }

    return (
        <Base locale="en">
            <h1 style={{textAlign: "center"}}>The Official Todo List of Earth</h1>
            <TodoForm addTodo={addTodo} />
            <TodoTable
                todos={todos}
                completeTodo={completeTodo}
                removeTodo={removeTodo}
                updateTodo={updateTodo}
                isLoading={isLoading}
            />
        </Base>
    );
}

export default App;
