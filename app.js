import express from "express";
import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/todo-list').then(() => {
    console.log('Connected to MongoDB!');
}).catch((error) => {
    console.log('MongoDB connection error: ' + error);
})

//Schema method allows us to define our document's structure (such settings as data types, required, default)
const todoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, default: " "},
    completed: {type: Boolean, default: false}
});

//There are a lot of useful methods that work in connection with model method. Model method takes two parameters: model's name and db's schema. A third parameter can be added: a special name of the collection (not a default one with an ending -s)
//Methods that work with the model are used to find collections, to update them, to delete documents from them and to count documents in them. 

const Todo = mongoose.model('Todo', todoSchema);



const getTodos = async() => {
    try {
    const todos = await Todo.find();
    
    //We can give some criteria e.g. Todo.find({completed: true});
    
    console.log('Your todos: ' + todos);
    } catch(err) {
        console.log('An error occurred while fetching todos: ' + err);
    }
}

const createTodo = async(title, description) => {
    const todo = new Todo({
        title,
        description,
        completed: false
    });

    try {

        //If a new document is to save you save a new document. It means that you call the save-method on a new just created document, not on its model!
        
        const result = await todo.save();
        console.log('A new todo created: ' + result._id);
        getTodos();
    } catch(err) {
        console.log('An error occurred while creating a new todo!' + err);
    }
} 
const updateTodo = async(id, update) => {
    try {

    //The very first argument when calling update and delete methods on the model is a filter-object!

    const updateResult = await Todo.updateOne(
        {_id: `${id}`},
        update
    );
    if (updateResult.modifiedCount > 0) {
        console.log('Your document is successfully updated! ' + updateResult.modifiedCount);
        getTodos();
    } else {
        console.log('Something went wrong while updating the doc with id: ' + id);
    }
} catch(err) {
    console.log('An error occurred while updating! ' + err);
}
}
const deleteTodo = async(id) => {
    try {

     //The very first argument when calling update and delete methods on the model is a filter-object!

    const deleteResult = await Todo.deleteOne(
        {_id: `${id}`}
    );
    if (deleteResult.deletedCount > 0) {
        console.log('Your document is successfully deleted! ' + deleteResult.deletedCount);
    } else {
        console.log('An error occurred while deleting!');
    }
} catch(err) {
    console.log('Error while deleting: ' + err);
}
}

//updateTodo('66f047a59eadaec6d8f417da', {title: 'Test the app one more time / done done done done', description: 'Create a new unnecessary task / done', completed: true});

//createTodo('Test the app one more time', 'Create a new unnecessary task');

deleteTodo('66f047a59eadaec6d8f417da');
