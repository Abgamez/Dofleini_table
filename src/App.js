import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Table from './pages/table';
import Tables from './pages/Tabla_Page';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Table/>} />
        <Route path='/q' element={<Tables/>} />
      </Routes>
    </Router>
  );
}

export default App;
