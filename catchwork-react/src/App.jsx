import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import MyPage from "./pages/myPage/MyPage";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/catchwork" element={<MyPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
