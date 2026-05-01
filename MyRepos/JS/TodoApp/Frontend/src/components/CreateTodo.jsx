import {useState} from "react";

export function CreateTodo(){
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    return <div>
        <input id="title" style={{
            padding: "10px",
            margin: "10px"
        }}
            type="text" placeholder="title" onChange={function (e){
                const value = e.target.value;
                setTitle(e.target.value);
        }}></input><br/>
        <input id="description" style={{
            padding: "10px",
            margin: "10px"
        }}
            type="text" placeholder="description" onChange={function (e){
                const value = e.target.value;
                setDescription(e.target.value);
            }}></input><br/>
        
        <button style={{
            padding: "10px",
            margin: "10px"
        }} onClick={() => {
            fetch("http://localhost:3000/todo", {
                method: "POST",
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(async (res) => {
                    const json = await res.json();
                    alert(json);
                })
        }}>Add a Todo</button>
    </div>
}

