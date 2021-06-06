import './App.css';
import React from 'react'
import "./Componets/CountingPage/TasbihPage.js"
import LoadPage from './Componets/LoadPage/Load'
import {BrowserRouter} from 'react-router-dom'

export default function App() {
  return(
      <BrowserRouter>
        <LoadPage/>
      </BrowserRouter>
  )
}