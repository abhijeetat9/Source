import React, {Fragment, useEffect} from 'react'
import {useState} from "react";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch("https://sum-server.100xdevs.com/todos")
        .then((res) => {
          const json = res.json();
          setTodos(json.todos);
        }, [])
  })
  
return <div>
  {todos.length}
  {todos.map(todo => <Todo key={todo.id} title={todo.title} description={todo.description}/>)}
</div>  
}

function Todo({title,description}) {
  return <div>
    <h1>{title}</h1>
    <h2>{description}</h2>
  </div>
}
export default App
