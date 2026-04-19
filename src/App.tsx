import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
/* import viteLogo from '/vite.svg' */
import htmlLogo from './assets/html.png'
import jslogo from './assets/js.webp'
import './App.css'
import NavBar from './components/navbar/navBar'
import ProductCard from './components/productCard/productCard'
import {buttonText} from './components/buttonText/buttonText'

import CatCard from './components/catCard/catCard'
import type { CatCardProps } from './components/catCard/catCard.types'


function App() {

  const [cats, setCats] = useState <CatCardProps[]>([]);

  const [count, setCount] = useState(0)
  


  useEffect(() => {
    const fetchCats = async () => {
      const respuesta = await fetch('https://api.thecatapi.com/v1/images/search?limit=50&mime_types=gif',
        {
            headers: {
            'x-api-key': 'live_uNG8HmdB7WMgJJayqJ7mp4Hbazj8O1yTocsKQY3ZbcGTBGtiPhHICdYJ6oEfIG9F'
          }
        }       
      )
      const data = await respuesta.json()
      setCats(data)
    } 

    fetchCats()
  }, [])

 


  return (
    <>
     {cats.map((cat) => (
    <CatCard 
      key = {cat.id}
      id={cat.id}
      url={cat.url} 
      width={cat.width} 
      height={cat.height} 
      breeds={cat.breeds}/>
  ))}
      <NavBar seccion1="Inicio" seccion2="Acerca de" seccion3="Contacto" />

    <div className="listProducts">
      <ProductCard url="batido" nombre="batido" precio={10000} descripcion="Delicioso batido proteinico para disfrutar." boton={buttonText({ text: "Comprar", onClick: () => {}, options: 'primary' })}/>
      <ProductCard url="ensalada" nombre="ensalada" precio={15000} descripcion="Fresca ensalada llena de nutrientes para tu bienestar." boton={buttonText({ text: "Comprar", onClick: () => {}, options: 'primary' })}/>
      <ProductCard url="brownie" nombre="brownie" precio={25000} descripcion="Delicioso brownie de chocolate para satisfacer tu antojo con una buena compañia que endulce la tarde." boton={buttonText({ text: "Comprar", onClick: () => {}, options: 'primary' })}/>  
    </div>
      <div>--
        <a href="" target="_blank">
          <img src={jslogo} className="logo" alt="JavaScript logo" />
        </a>
        <a href="" target="_blank">
          <img src={htmlLogo} className="html " alt="HTML logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Emmanuel Perez Castrillon</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Primer <code>Hola mundo</code> con React y Vite
        </p>
      </div>
      <p className="read-the-docs">
        Primer codigo modificado en React con Vite
      </p>

    </>
  )
}

export default App
