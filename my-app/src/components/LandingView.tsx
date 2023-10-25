import React, { Component } from "react";

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
      };
    }

  componentDidMount() {
    const storedFriends = localStorage.getItem("friends");
    if (storedFriends) {
      this.setState({ friends: JSON.parse(storedFriends) });
    }
  }

  handleInputChange = (event) => {
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

  deleteFriend = (index) => {
    const updatedFriends = [...this.state.friends];
    updatedFriends.splice(index, 1);
    this.setState({ friends: updatedFriends }, () => {
      localStorage.setItem("friends", JSON.stringify(updatedFriends));
    });
  };

  render() {
    return (
      <div>
        <ul>
          {this.state.friends.map((friend, index) => (
            <li key={index}>
              Nome: {friend.name}
              <button onClick={() => this.deleteFriend(index)}>Excluir</button>
            </li>
          ))}
        </ul>

        <form>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={this.state.newFriend.name}
            onChange={this.handleInputChange}
          />
          {/* Outros campos do formulário */}
          <button onClick={this.addFriend}>Adicionar Amigo</button>
        </form>
      </div>
    );
  }
}

export default FriendsList;
