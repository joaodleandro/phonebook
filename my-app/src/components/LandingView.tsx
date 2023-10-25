import React, { Component, ChangeEvent, KeyboardEvent } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Card, OverlayTrigger, Popover } from "react-bootstrap";


  interface Friend {
    name: string;
    country: string;
    city: string;
    phone: string;
    email: string;
    timezone: string;
    flag: string;
  }

  interface State {
    friends: Friend[];
    newFriend: Friend;
    friendsList: JSX.Element[];
  }
  
  class FriendsList extends Component<{}, State> {
    constructor(props: {}) {
      super(props);
      this.state = {
        friends: [],
        newFriend: {
          name: "",
          country: "",
          city: "",
          phone: "",
          email: "",
          timezone: "",
          flag: "",
        },
        friendsList: [],
      };
    }

  componentDidMount() {
    const storedFriends = localStorage.getItem("friends");
    if (storedFriends) {
      this.setState({ friends: JSON.parse(storedFriends) });
    }
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newFriend: {
        ...prevState.newFriend,
        [name]: value,
      },
    }));
  };

  addFriend = () => {

    this.setState(
      (prevState) => ({
        friends: [...prevState.friends, this.state.newFriend],
        newFriend: {
          name: "",
          country: "",
          city: "",
          phone: "",
          email: "",
          timezone: "",
          flag: "",
        },
      }),
      () => {
        localStorage.setItem("friends", JSON.stringify(this.state.friends));
      }
    );
  };

  deleteFriend = (index: number) => {
    const updatedFriends = [...this.state.friends];
    updatedFriends.splice(index, 1);
    this.setState({ friends: updatedFriends }, () => {
      localStorage.setItem("friends", JSON.stringify(updatedFriends));
    });
  };

  handleKeyEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.addFriend();
      event.preventDefault();
    }
  }

  renderAddFriendForm() {
    return (
      <OverlayTrigger
        rootClose={true}
        trigger="click"
        placement="bottom"
        overlay={this.renderAddFriendPopover()}
      >
        <Button className="mx-4" variant="success">
          Add Friend
        </Button>
      </OverlayTrigger>
    );
  }
  
  renderAddFriendPopover() {
    return (
      <Popover>
        <Popover.Body>
          <Form>
            <Form.Control
              type="text"
              name="name" 
              value={this.state.newFriend.name} 
              placeholder="Contact user name"
              onChange={this.handleInputChange} 
              onKeyDown={this.handleKeyEnter} 
            />
            <button onClick={this.addFriend}>Add</button>
          </Form>
        </Popover.Body>
      </Popover>
    );
  }
  

  render() {
    return (
        <div className="mx-4 my-4 py-4 border p-2 mb-6">
          <div className="d-flex flex-wrap overflow-hidden justify-content-center">
          {this.state.friends.map((friend, index) => (
            <div key={index} className="friend-card">
              <p>Name: {friend.name}</p>
            </div>
          ))}
          </div>
          <div className="d-flex justify-content-center">
            {this.renderAddFriendForm()}
          </div>
        </div>
      );
  }
}

export default FriendsList;
