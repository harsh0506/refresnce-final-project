import Image from 'next/image'
import React from 'react'

function Try() {

  let imgVar
  let img

  const[info , setInfo] = React.useState({
    date:"",
    hum:"",
    
  })
  
  async function call(){
    const oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=19.2403&lon=73.1305&exclude=hourl&appid=bb471eabde0feda3a85cd98f18f1442f`
    const data = await (await fetch(oneCall)).json()
    console.log(data.daily)
    console.log(data)
    var d = new Date(data.current.dt * 1000);
    console.log(data.current.weather[0].icon)
    imgVar = data.current.weather[0].icon
    img = `https://openweathermap.org/img/w/${imgVar}.png`

  }
  
  call()
  return (
    <div>

      <Image src={img} fill />
    </div>
  )
}

export default Try