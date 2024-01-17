import React from 'react';
import { Reader } from './components/converter/fileReader';


function App() {

  // const ipcRenderer = (window as any).ipcRenderer;
  // const handleSubmit = () =>
  // ipcRenderer.send('file:upload', { value: '123' });


  return (
    <div>
      <Reader/>
    </div>
  )
}

export default App;
