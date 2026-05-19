import React from 'react'
import { useState,useEffect } from 'react';
const Todo = () => {
    const[title,setTitle] = useState("");
    const[description,setDescription] = useState("");
    const[todos,setTodos] = useState([]);
    const[message,setMessage] = useState("");
    const[error,setError] = useState("");
    //edit button changes
    const[editId,setEditId] = useState(-1);
    //Edit title and description
    const[editTitle,setEditTitle] = useState("");
    const[editDesc,setEditDesc] = useState("");
    //URL
    const apiUrl = "http://localhost:8000";

    useEffect(()=>{
      getItems()
    },[])

    //read the item
    const getItems = async()=>{
      try {
        const res = await fetch(apiUrl+"/todos");
        const datas = await res.json();
        setTodos(datas);
      } catch (error) {
        console.log(error.message)
      }
    }

    //edit
    const handleEdit = (item)=>{
      setEditId(item._id);
      setEditTitle(item.title);
      setEditDesc(item.description);
    }

    //edit cancel
    const handleEditCancel = ()=>{
      setEditId(-1)
    }

    //update 
    const handleUpdate = (id,title,description)=>{
      
      setError("");
      if(title.trim() !== "" && description.trim() !== ""){
        fetch(apiUrl+"/todos/"+id,{
          method:"PUT",
          headers:{
            "content-Type":"application/json"
          },
          body:JSON.stringify({title,description})
        }).then(async(res)=>{
          const updateTodo =await res.json();
          if(res.ok){
            //update item to list
            const updatedTodos = todos.map((item)=>
              (item._id === id)?updateTodo:item
            )
            setTodos(updatedTodos)
            setEditTitle("")
            setEditDesc("")
            setMessage("Item Updated Successfully")
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1)
          }else{
            //set error
            setError("unable to create Todo Item");
          }
        }).catch((err)=>{
          setError("unable to create Todo");
        })
      }
    }

    //delete 
    const handleDelete = (id)=>{
      setError("")
        if(window.confirm(" Are you Sure You Want To Delete ")){
        fetch(apiUrl+"/todos/"+id,{
          method:"DELETE"
        })
        .then((res)=>{
          if(res.ok){
            setMessage("Item Deleted Succcesfull")
            const updatedItems = todos.filter((item)=>(item._id !== id))
            setTodos(updatedItems)
          }
          else{
            setError("Item Not deleted")
          }
          setTimeout(()=>{
            setMessage("")
          },3000)
        }).catch((err)=>{
          setError("Item Not deleted")
        })

        }
    }
    //add item

    const handleSubmit = (title,description)=>{
      
      setError("");
      if(title.trim() !== "" && description.trim() !== ""){
        fetch(apiUrl+"/todos",{
          method:"POST",
          headers:{
            "content-Type":"application/json"
          },
          body:JSON.stringify({title,description})
        }).then(async(res)=>{
          const newTodo =await res.json();
          console.log(newTodo)
          if(res.ok){
            //add item to list
            setTodos([...todos,newTodo])
            setTitle("")
            setDescription("")
            setMessage("Item Added Successfully")
            setTimeout(() => {
              setMessage("");
            }, 3000);
          }else{
            //set error
            setError("unable to create Todo Item");
          }
        }).catch((err)=>{
          setError("unable to create Todo");
        })
      }
    }
  return (
    <>
      <div className='row p-3 bg-success text-light'>
        <h1>Task Management</h1>
      </div>
      <div className='row mt-2'>
        <h3>Add Task</h3>
        {message && <p className='text-success'>{message}</p>}
        <div className='form-group d-flex gap-2'>
            <input className='form-control' placeholder='Enter Title' type='text' value={title} onChange={(e)=>setTitle(e.target.value)}></input>
            <input className='form-control' placeholder='Enter Description' type='text' value={description} onChange={(e)=>setDescription(e.target.value)}></input>
            <button className='btn btn-dark' onClick={()=> handleSubmit(title,description)}>Submit</button>
        </div> 
        {error && <p className='text-danger'>{error}</p>}
      </div>
      <div className='row mt-2'>
        <h3>Tasks</h3>
        <div className='col-md-6'>
          {(todos.length !== 0)?<ul className='list-group'>
          {
            todos.map((item)=>(
              <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-1' key={item._id}>
                <div className='d-flex flex-column'>
                  {(editId === -1) || (editId !== item._id)? <>
                    <span className='fw-bold'>{item.title}</span>
                    <span>{item.description}</span>
                  </>:
                  <div className='form-group d-flex gap-2 me-2'>
                    <input className='form-control' placeholder='Enter Title' type='text' value={editTitle} onChange={(e)=>setEditTitle(e.target.value)}></input>
                    <input className='form-control' placeholder='Enter Description' type='text' value={editDesc} onChange={(e)=>setEditDesc(e.target.value)}></input>
                  </div>}

                </div>
                <div className='d-flex gap-2'>
                  {(editId === -1) || (editId !== item._id)?
                    <button className='btn btn-warning' onClick={()=> handleEdit(item)}>Edit</button>:
                    <button className='btn btn-warning' onClick={()=>handleUpdate(item._id,editTitle,editDesc)}>Update</button>
                  }
                  {
                    (editId === -1)?
                      <button className='btn btn-danger' onClick={()=>handleDelete(item._id)}>Delete</button>:
                      <button className='btn btn-danger' onClick={()=>handleEditCancel()}>Cancel</button>
                  }
                </div>
              </li>
            ))
          }
        </ul>:
        <h3 className='text-danger text-center mt-5'>Not Found</h3>}       
        </div>
      </div>
    </>
  )
}

export default Todo