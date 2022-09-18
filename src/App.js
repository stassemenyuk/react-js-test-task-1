import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainPage from './pages/MainList';
import ItemPage from './pages/ItemPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/item/:id" exact element={<ItemPage />} />
        <Route path="/" exact element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
