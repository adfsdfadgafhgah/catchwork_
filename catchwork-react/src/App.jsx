import { Routes, Route } from 'react-router-dom';
import './App.css'
import MainPage from './pages/major/MainPage'
import Header from './components/common/Header'
import Footer from './components/common/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/catchwork" element={<MainPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
