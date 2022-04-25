import React from 'react';
 
 

const peotlist = (props) => {
  return (
    <div className="row">
    {props.peoms.map((peom) => (
      <div className= "col-3">
        <div class="card"  key={peom.index}>
  <div class="card-title"><h3>Peom title: {peom.title}</h3></div>

  <div class="card-section"><h3>peom: {peom.peom}</h3></div>
  <div class="card-footer"><h3>Price : {peom.price /1000000000000000000}cUSD</h3></div>
</div>
 
  <div> 
       <sm><button type="button" class="btn btn-outline-primary" onClick={() => props.buyPeom(peom.index)}>Buy peom</button></sm>
       <sm><button onClick={ ()=> props.Like(peom.index)} class="btn btn-dark btn-b"><i class="fa-solid fa-heart"></i></button></sm>
                
       </div>
       </div>
       
        
     ))};

       </div>

     
  )
    }
       
       
       



    
    
  export default peotlist;