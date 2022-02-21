import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Styles from "./signUp.css";
import Navbar from "../Navbar/navbar";
import ChatList from "../ChatList/chatList";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    const { showMainPage } = this.props;
    showMainPage(false);
    this.state = {
      showSignUpPage: true,
      showChatList: false,
      inputFisrtName: "",
      inputLastName: "",
      inputEmail: "",
      inputUserName: "",
      inputPassword: "",
      logedUsertoken: "",
      logedUserId: "",
      logedUserFirstName: "",
      logedUserLastName: "",
      logedUserEmail: "",
      logedUserUsername: "",
      logedUserpassword: "",
      logedUserChats: [],
    };
  }
  toggleRender = (RTA) => {
    this.setState({ showSignUpPage: RTA });
  };

  updateFirstNameInputValue = (value) => {
    this.setState({ inputFisrtName: value });
  };

  updateLastNameInputValue = (value) => {
    this.setState({ inputLastName: value });
  };

  updateEmailInputValue = (value) => {
    this.setState({ inputEmail: value });
  };

  updateUserNameInputValue = (value) => {
    this.setState({ inputUserName: value });
  };

  updatePasswordInputValue = (value) => {
    this.setState({ inputPassword: value });
  };

  showAvaliableChats = () => {
    this.setState({ showChatList: true });
    this.toggleRender(false);
  };

  signUpVerification = (e) => {
    const {
      inputFisrtName,
      inputLastName,
      inputEmail,
      inputUserName,
      inputPassword,
    } = this.state;
    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: inputFisrtName,
        last_name: inputLastName,
        email: inputEmail,
        username: inputUserName,
        password: inputPassword,
      }),
    };
    fetch("https://intense-basin-05348.herokuapp.com/users/", options)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          this.setState(
            {
              logedUsertoken: data.user
                ? data.user.token
                  ? data.user.token
                  : ""
                : "",
              logedUserId: data.user
                ? data.user._id
                  ? data.user._id
                  : ""
                : "",
              logedUserFirstName: data.user
                ? data.user.first_name
                  ? data.user.first_name
                  : ""
                : "",
              logedUserLastName: data.user
                ? data.user.last_name
                  ? data.user.last_name
                  : ""
                : "",
              logedUserEmail: data.user
                ? data.user.email
                  ? data.user.email
                  : ""
                : "",
              logedUserUsername: data.user
                ? data.user.username
                  ? data.user.username
                  : ""
                : "",
              logedUserpassword: data.user
                ? data.user.password
                  ? data.user.password
                  : ""
                : "",
              logedUserChats: data.user
                ? data.user.chats
                  ? data.user.chats
                  : ""
                : "",
            },
            () => {
              this.updateFirstNameInputValue("");
              this.updateLastNameInputValue("");
              this.updateEmailInputValue("");
              this.updateUserNameInputValue("");
              this.updatePasswordInputValue("");
              this.showAvaliableChats();
            }
          );
        } else if (
          data &&
          data.message &&
          data.message === "This username is already taken. try with another"
        ) {
          //show alert saying username already taken should login
        } else if (
          data &&
          data.message &&
          data.message === "This email is already registered. try to Login"
        ) {
          //show alert saying email already taken should login
        } else {
          //Show general error message
        }
      });
  };

  render() {
    const { showSignUpPage, showChatList } = this.state;
    if (showSignUpPage) {
      return (
        <div>
          <div style={Styles}></div>
          <Container>
            <Row>
              <Col xs={{ order: "first" }}></Col>
              <Col xs>
                <form>
                  <h3 id="welome">¡Welcome to RV Chat!</h3>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="first_name"
                      className="form-control"
                      value={this.state.inputFisrtName}
                      onInput={(e) =>
                        this.updateFirstNameInputValue(e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="last_name"
                      className="form-control"
                      value={this.state.inputLastName}
                      onInput={(e) =>
                        this.updateLastNameInputValue(e.target.value)
                      }
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      className="form-control"
                      value={this.state.inputEmail}
                      onInput={(e) =>
                        this.updateEmailInputValue(e.target.value)
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.inputUserName}
                      onInput={(e) =>
                        this.updateUserNameInputValue(e.target.value)
                      }
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={this.state.inputPassword}
                      onInput={(e) =>
                        this.updatePasswordInputValue(e.target.value)
                      }
                      placeholder="Enter password"
                    />
                  </div>
                  <button
                    type="button"
                    style={{
                      width: "370px",
                      marginTop: "30px",
                      marginBottom: "10px",
                    }}
                    className="btn btn-primary btn-block"
                    onClick={this.signUpVerification}
                  >
                    Sign Up
                  </button>
                </form>
              </Col>
              <Col xs={{ order: "last" }}></Col>
            </Row>
          </Container>
        </div>
      );
    }
    if (showChatList) {
      return (
        <div>
          <ChatList showLastPage={this.toggleRender} data={this.state} />
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
export default SignUp;
