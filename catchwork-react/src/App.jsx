import './App.css'

import Header from './components/common/Header'
import Footer from './components/common/Footer'
import AppRoute from './AppRoute'

function App() {
  return (
    <>
      <Header />
      <main>
        <AppRoute/>
      </main>
      <Footer />
    </>
  );
}

export default App;
