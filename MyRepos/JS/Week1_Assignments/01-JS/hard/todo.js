class Todo {
    constructor()
    {
        this.todos = [];
    }

    add(todo)
    {
        this.todos.push(todo);
    }
    remove(indexofTodo)
    {
        if(indexofTodo >= 0 && indexofTodo < this.todos.length)
        {
            return this.todos.splice(indexofTodo,1);
        }
    }
    update(index,updatedTodol)
    {
        if(index >= 0 && index < this.todos.length)
        {
            return this.todos[index] = updatedTodol;
        }
    }
    getAll()
    {
        return this.todos;
    }
    get(indexofTodo)
    {
        if(indexofTodo >= 0 && indexofTodo < this.todos.length)
        {
            return this.todos[indexofTodo];
        }
        else{
            return null;
        }
    }
    clear()
    {
        this.todos = [];
    }
}

module.exports = Todo;