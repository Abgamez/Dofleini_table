import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Table from './pages/table';;

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Table/>} />
      </Routes>
    </Router>
  );
}

export default App;
