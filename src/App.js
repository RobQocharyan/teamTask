/* eslint-disable no-undef */
import './App.css';
import React, { useEffect, useState} from 'react';
import jwt_decode from "jwt-decode";

const clientId = "662481931593-e10guqugk57bg87sm4589tbl4873lmm9.apps.googleusercontent.com"

function App () {
  const [user,setUser] = useState({}) 
  const [data,setData] = useState([])
  const [comment,setComment] = useState([])


// eslint-disable-next-line react-hooks/exhaustive-deps
function handleCallbackResponse(response){
    console.log("Encoded jWT ID token:" + response.credential)
    let userObject = jwt_decode(response.credential);
    setUser(userObject)
    document.getElementById("signInDiv").hidden = true

}

function handleSignOut(event){
    setUser({});
    document.getElementById("signInDiv").hidden = false 

}

useEffect(()=>{
  fetch ('https://dummyjson.com/posts')
  .then(res => res.json()).then(res =>{
    return setData(res.posts)
  })
},[])


const handleClick = (id)=>{
    fetch(`https://dummyjson.com/posts/${id}/comments`)
      .then(res => res.json())
        .then(res => setComment(res.comments));      
}

useEffect(()=>{
 
    window.google.accounts.id.initialize({
      client_id:clientId,
      callback:handleCallbackResponse,
    })
    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline",size:"large"}  
    )

    window.google.accounts.id.prompt()
},[])




return (
  <>
        <div id='signInDiv'></div>

      <div className='menu'>
      {Object.keys(user).length !== 0 &&
        <div className='section'>
           <button onClick={(e)=>{handleSignOut(e)}}> Log Out</button>
           <div>
                {
                    data.map((i)=>{
                          return <div className="title" key={i.id} onClick={(e)=>handleClick(i.id)}>{i.title}</div>
                    })
                }
           </div>

           <div>
            {comment.map((i)=>{
                  return <ul className="body" key={i.id}>
                            <li key={i.id}>{i.body}</li>                  
                          </ul>
    
              })}
            </div>
        </div>
          
              
      }
  
      </div>
    </>
  );
}

export default React.memo(App);
