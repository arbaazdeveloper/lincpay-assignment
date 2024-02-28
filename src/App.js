
import { useState } from 'react';
import './App.css';
import DataTable from './DataTable';

function App() {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };
  
  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="form-check form-switch toggle">
        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isDarkMode} onChange={toggleDarkMode} />
        <h1>Change Theme</h1>
        
      </div>
      <DataTable dark={isDarkMode}/>
    </div>
  );
}

export default App;
