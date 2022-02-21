import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./chatList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import ChatDetail from "../ChatDetail/chatDetail";

class chatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatListPage: true,
      chatNamesListAvaliable: false,
      showChatDetail: false,
      selectedChat: "-",
      finalChatId: "",
      finalChatSubject: "",
      avaliableChats: [],
      finalChatmembersList: [],
      finalChatMessages: []
    };
  }
  toggleRender = (RTA) => {
    this.setState({ showChatListPage: RTA });
  };

  afterSetStateFinished() {
    this.setState({ chatNamesListAvaliable: true });
  }

  updateChatPickerValue = (value) => {
    this.setState({ selectedChat: value });
  };

  showChatDetail = () => {
    this.setState({ showChatDetail: true });
    this.toggleRender(false);
  };

  startSelectedChat = (e) => {
    const { selectedChat, avaliableChats, finalChatId } = this.state;
    const {data} = this.props;
    const chatObject = avaliableChats[selectedChat.split("_")[1]]
    this.setState({ finalChatId: chatObject._id });
    this.setState({ finalChatSubject: chatObject.subject });

    const options = {
        method: "get",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-access-token": data.logedUsertoken
        },
      };

      const put_add_member_options = {
        method: "put",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-access-token": data.logedUsertoken
        },
        body: JSON.stringify({
            member:data.logedUserId
          }),
      };

      const put_add_chat_options = {
        method: "put",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-access-token": data.logedUsertoken
        },
        body: JSON.stringify({
            id: chatObject._id
          }),
      };
      if(!data.logedUserChats.includes(chatObject._id)){
        var memberAddedtoChat= false; 
        var chatAddedtoMember = false;
        fetch("https://intense-basin-05348.herokuapp.com/chats/addMember/"+chatObject._id, put_add_member_options)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.message) {
            if(data.message === "The chat´s member was added succesfully!"){
                memberAddedtoChat = true;
            }
            else{
                //show message detail from server response
            }
          } 
        });
        fetch("https://intense-basin-05348.herokuapp.com/users/addChat/"+data.logedUserId, put_add_chat_options)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.message) {
            if(data.message === "The user`s chat was added succesfully!"){
                chatAddedtoMember = true;
            }
            else{
                //show message detail from server response
            }
          } 
        });
      }

      fetch("https://intense-basin-05348.herokuapp.com/chats/"+chatObject._id, options)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            this.setState(
              {
                finalChatmembersList: data[0].membersList ? data[0].membersList : [],
                finalChatMessages: data[0].messages? data[0].messages: []
              },
              () => {
                this.updateChatPickerValue("-");
                this.showChatDetail();
              }
            );
          } else {
            //Show general error message
          }
        });
  }

  componentDidMount() {
    fetch("https://intense-basin-05348.herokuapp.com/chats/")
      .then((response) => response.json())
      .then((data) => {
        this.setState(
          {
            avaliableChats: data,
          },
          () => {
            this.afterSetStateFinished();
          }
        );
      });
  }

  render() {
    const {
      showChatListPage,
      chatNamesListAvaliable,
      avaliableChats,
      selectedChat,
      showChatDetail
    } = this.state;
    let Chats;
    if (avaliableChats.length > 0) {
      Chats = avaliableChats.map((item, i) => (
        <Dropdown.Item eventKey={item.subject+"_"+i}>{item.subject}</Dropdown.Item>
      ));
    }
    if (showChatListPage && chatNamesListAvaliable) {
      return (
        <div>
          <Container>
            <Row>
              <Col xs={{ order: "first" }}></Col>
              <Col xs>
                <form>
                  <h3 id="welome">Choose the chat you want to join. </h3>
                  <div className="form-group">
                    <label>Chats</label>
                    <DropdownButton
                      title="Choose a chat"
                      id="dropdown-menu-align-right"
                      onSelect={this.updateChatPickerValue}
                    >
                      {Chats}
                    </DropdownButton>
                  </div>
                  <Form.Group
                    className="mb-3"
                    style={{
                      width: "370px",
                      marginTop: "30px",
                      marginBottom: "10px",
                    }}
                  >
                    <Form.Label>Selected Chat</Form.Label>
                    <Form.Control
                      placeholder={selectedChat.split("_")[0]}
                      value={selectedChat.split("_")[0]}
                      disabled
                    />
                  </Form.Group>
                  <button
                    type="button"
                    disabled={this.state.selectedChat === "-"?true:false} 
                    style={{
                      width: "370px",
                      marginTop: "30px",
                      marginBottom: "10px",
                    }}
                    className="btn btn-primary btn-block"
                    onClick={this.startSelectedChat}
                  >
                    Enter chat
                  </button>
                </form>
              </Col>
              <Col xs={{ order: "last" }}></Col>
            </Row>
          </Container>
        </div>
      );
    }
    if(showChatDetail){
        return (
            <div>
              <ChatDetail showLastPage={this.toggleRender} data={this.state} lastUserData={this.props} />
            </div>
          );
    }
    else {
      return <div></div>;
    }
  }
}
export default chatList;
