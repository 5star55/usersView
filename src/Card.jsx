import React from 'react'

export default function Card(props) {
  return (
    <div className="bg-white py-10 m-5 rounded-2xl">
        <h1 className='pb-10'>{props.name}</h1>
        <h2>id:{props.id}</h2>
        <h2>email: {props.email}</h2>
        <button className="mt-10 bg-amber-600 rounded-lg px-3 py-1" onClick={()=> props.onClick()}>{props.button}</button>
    </div>
  )
}
