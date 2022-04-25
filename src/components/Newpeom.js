import React from 'react'

import { useState } from "react";

const Newpeom = (props) => {

  const [title, setTitle] = useState('');
 const [peom, setPeom] = useState('');
 const [price, setPrice] = useState('');
  

 const submitHandler = (e) => {
  e.preventDefault();

  if(!title || !peom || !price) {
    alert('Please fill up all fields')
    return
  }
  props.addPeom(title, peom, price);
  setTitle('')
  setPeom('')
  setPrice('')
 };

 return ( 
 <div class="container mt-3">
 <h2>Peom form</h2>
 <form onSubmit={submitHandler}>
   <div class="mb-3 mt-3">
     <label for="title">Title:</label>
     <input type="title" class="form-control" id="title" placeholder="Enter title" name="email"  value={title} onChange={(e) => setTitle(e.target.value)}/>
    
   </div>

   <div class="mb-3">
     <label for="peom">Peom:</label>
     <input type="Peom" class="form-control" id="pwd" placeholder="Enter peom" name="peom" value={peom} onChange={(e) => setPeom(e.target.value)}/>
 
   </div>
   <div class="mb-3">
     <label for="price">Price:</label>
     <input type="price" class="form-control" id="price" placeholder="Enter price" name="price" value={price} onChange={(e) => setPrice(e.target.value)}/>
  
  </div>
  
   <button type="submit" class="btn btn-primary">Add Peom</button>
 </form>
</div>

)
}

export default Newpeom;