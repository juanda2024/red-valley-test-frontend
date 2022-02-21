import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./login.css";
import ChatList from "../ChatList/chatList";
import "bootstrap/dist/css/bootstrap.min.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginPage: true,
      showChatList: false,
      inputEmail: "",
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
    this.setState({ showLoginPage: RTA });
  };

  updateEmailInputValue = (value) => {
    this.setState({ inputEmail: value });
  };

  updatePasswordInputValue = (value) => {
    this.setState({ inputPassword: value });
  };

  showAvaliableChats = () => {
    this.setState({ showChatList: true });
    this.toggleRender(false);
  };

  loginVerification = (e) => {
    const { inputEmail, inputPassword } = this.state;

    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: inputEmail,
        password: inputPassword,
      }),
    };
    fetch("https://intense-basin-05348.herokuapp.com/users/login/", options)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.message && data.message.includes("succesfully")) {
          this.setState(
            {
              logedUsertoken: data.token ? data.token : "",
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
              this.updateEmailInputValue("");
              this.updatePasswordInputValue("");
              this.showAvaliableChats();
            }
          );
        } else if (
          data &&
          data.message &&
          data.message === "The password is incorrect"
        ) {
          //show alert saying incorrect password
        } else if (
          data &&
          data.message &&
          data.message === "The user with the given email was not found."
        ) {
          //show alert saying email not registered
        } else {
          //Show general error message
        }
      });
  };

  render() {
    const { showLoginPage, showChatList } = this.state;
    if (showLoginPage) {
      return (
        <div>
          <Container>
            <Row>
              <Col xs={{ order: "first" }}></Col>
              <Col xs>
                <form>
                  <h3 id="welome">¡Welcome to RV Chat!</h3>
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
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={this.state.inputPassword}
                      onInput={(e) =>
                        this.updatePasswordInputValue(e.target.value)
                      }
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
                    onClick={this.loginVerification}
                  >
                    Login
                  </button>
                  <p className="forgot-password text-right">
                    Dont have an account? <a href="/register"> Sign Up</a>
                  </p>
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
export default Login;
