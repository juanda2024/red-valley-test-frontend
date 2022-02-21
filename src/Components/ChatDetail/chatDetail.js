import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./chatDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Form from "react-bootstrap/Form";

class chatDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatDetailPage: true,
      alreadyload: false,
      inputMessage: "",
      historicalMessages: [],
      historicalMembers: [],
    };
  }
  toggleRender = (RTA) => {
    this.setState({ showChatListPage: RTA });
  };

  updateInputMessage = (value) => {
    this.setState({ inputMessage: value });
  };

  submitMessage = (e) => {
    const { inputMessage } = this.state;
    const { lastUserData, data } = this.props;

    var todayDate = new Date().toISOString().slice(0, 10);
    var token = lastUserData.data.logedUsertoken;
    const options = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "x-access-token": lastUserData.data.logedUsertoken,
      },
      body: JSON.stringify({
        date: todayDate,
        chat: data.finalChatId,
        content: inputMessage,
        contentType: "text",
      }),
    };

    fetch("https://intense-basin-05348.herokuapp.com/messages/", options)
      .then((response) => response.json())
      .then((dataRes) => {
        if (dataRes) {
          const put_add_message_options = {
            method: "put",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              "x-access-token": token,
            },
            body: JSON.stringify({
              message: dataRes.insertedId,
            }),
          };
          var messageAddedtoChat = false;
          fetch(
            "https://intense-basin-05348.herokuapp.com/chats/addMessage/" +
              data.finalChatId,
              put_add_message_options
          )
            .then((response) => response.json())
            .then((data) => {
              if (data && data.message) {
                if (
                  data.message === "TThe chat´s message was added succesfully!"
                ) {
                  messageAddedtoChat = true;
                } else {
                  //show message detail from server response
                }
              }
            });
          this.setState(
            {
              historicalMessages: [
                ...this.state.historicalMessages,
                {
                  _id: dataRes.insertedId ? dataRes.insertedId : "",
                  owner: lastUserData.data.logedUserId,
                  date: todayDate,
                  content: inputMessage,
                  contentType: "text",
                },
              ],
            },
            () => {
              this.updateInputMessage("");
            }
          );
        } else {
          //Show general error message
        }
      });
  };

  componentDidMount() {
    const { lastUserData, data } = this.props;
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "x-access-token": lastUserData.data.logedUsertoken,
      },
    };
    for (let index = 0; index < data.finalChatMessages.length; index++) {
      const message = data.finalChatMessages[index];
      fetch(
        "https://intense-basin-05348.herokuapp.com/messages/" + message,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            historicalMessages: [
              ...this.state.historicalMessages,
              {
                _id: data[0] ? (data[0]._id ? data[0]._id : "") : "",
                owner: data[0] ? (data[0].owner ? data[0].owner : "") : "",
                date: data[0]
                  ? data[0].date
                    ? data[0].date.split("T")[0]
                    : ""
                  : "",
                content: data[0]
                  ? data[0].content
                    ? data[0].content
                    : ""
                  : "",
                contentType: data[0]
                  ? data[0].contentType
                    ? data[0].contentType
                    : ""
                  : "",
              },
            ],
          });
        });
    }
    for (let index = 0; index < data.finalChatmembersList.length; index++) {
      const user = data.finalChatmembersList[index];
      fetch("https://intense-basin-05348.herokuapp.com/users/" + user)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            historicalMembers: [
              ...this.state.historicalMembers,
              {
                _id: data[0] ? (data[0]._id ? data[0]._id : "") : "",
                username: data[0]
                  ? data[0].username
                    ? data[0].username
                    : ""
                  : "",
                name: data[0]
                  ? data[0].first_name
                    ? data[0].first_name
                    : ""
                  : "",
              },
            ],
          });
        });
    }
    this.setState({ alreadyload: true });
  }

  render() {
    const {
      showChatDetailPage,
      alreadyload,
      historicalMessages,
      historicalMembers,
    } = this.state;
    const { data } = this.props;
    let MessageBoard;
    let MembersList;
    if (historicalMessages.length > 0) {
      MessageBoard = historicalMessages.map((item, i) => (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.content} secondary={item.date} />
        </ListItem>
      ));
    }
    if (historicalMembers.length > 0) {
      MembersList = historicalMembers.map((item, i) => (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.username} secondary={item.name} />
        </ListItem>
      ));
    }
    if (showChatDetailPage && alreadyload) {
      return (
        <div>
          <Container>
            <Row>
              <Col xs={9}>
                <Row>
                  <Col>
                    <h3 id="members">Chat: {data.finalChatSubject} </h3>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 800,
                        height: 450,
                        bgcolor: "background.paper",
                      }}
                    >
                      {MessageBoard}
                    </List>
                  </Col>
                </Row>
                <Row>
                  <Col xs={9}>
                    <Form>
                      <Form.Control
                        type="text"
                        placeholder="Enter a message"
                        value={this.state.inputMessage}
                        onInput={(e) => this.updateInputMessage(e.target.value)}
                      />
                    </Form>
                  </Col>
                  <Col xs={3}>
                    <button
                      type="button"
                      style={{
                        width: "160px",
                      }}
                      className="btn btn-primary btn-block"
                      onClick={this.submitMessage}
                    >
                      Submit
                    </button>
                  </Col>
                </Row>
              </Col>
              <Col>
                <h3 id="members">Members in the chat </h3>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {MembersList}
                </List>
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
export default chatDetail;
