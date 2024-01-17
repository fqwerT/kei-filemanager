import React from 'react';
import { Reader } from './components/converter/fileReader';
import './App.css'

function App() {

  // const ipcRenderer = (window as any).ipcRenderer;
  // const handleSubmit = () =>
  // ipcRenderer.send('file:upload', { value: '123' });


  return (

      <Reader/>

  )
}

export default App;
