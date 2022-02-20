import React from "react";
import Navbar from "./Components//Navbar/navbar";
import Login from "./Components/Login/login";
import SignUp from "./Components/SignUp/signUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMainPage: true,
    };
  }

  toggleRender = (RTA) => {
    this.setState({ showMainPage: RTA });
  };

  render() {
    const { showMainPage } = this.state;
    if (showMainPage) {
      return (
        <div>
          <Router>
            <Navbar />
            <Login />
            <Routes>
              <Route
                path="/register"
                element={<SignUp showMainPage={this.toggleRender} />}
              />
            </Routes>
          </Router>
        </div>
      );
    } else {
      return (
        <div>
          <Router>
            <Navbar />
            <Routes>
              <Route
                path="/register"
                element={<SignUp showMainPage={this.toggleRender} />}
              />
            </Routes>
          </Router>
        </div>
      );
    }
  }
}
export default App;
