import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {CreateTodo} from "./components/CreateTodo.jsx";
import {Todos} from "./components/Todos.jsx";

function App() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/todos")
            .then(async (res) => {
                const json = await res.json();
                setTodos(json.todos);
            });
    }, []);
    
    return (
      <div>
          <CreateTodo/>
          <Todos todos={todos}></Todos> 
      </div>
  )
}

export default App
