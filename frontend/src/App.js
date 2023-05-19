import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
  return (
    <div className="App">
      <Router>
        <h1 className="title-header">Forum</h1>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <div className="center-content">
                <p>
                  Welcome! <br /> Please login or register to enter!
                </p>
                <div className="button-container">
                  <Link to="/login" className="LinkButton">Login</Link>
                  <Link to="/register" className="LinkButton">Register</Link>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
