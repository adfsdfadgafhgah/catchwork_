import WriteSupportPage from "./pages/support/WriteSupportPage";
import logo from "./assets/logo.png"; // 실제 logo.png 경로
import "./App.css";

function App() {
  return (
    <div>
      <WriteSupportPage logo={logo} />
    </div>
  );
}

export default App;
