import React, { Component, ChangeEvent, KeyboardEvent } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Card, OverlayTrigger, Popover } from "react-bootstrap";

import { request, gql } from 'graphql-request';

  const endpoint = 'https://api.geographql.rudio.dev/graphql';

  interface CountryData {
    countries: {
      edges: {
        node: {
          name: string;
        }[];
      };
    };
  }
  
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
    countries: string[];
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
        countries: [],
      };
    }

  componentDidMount() {

    this.fetchCountries();

    const storedFriends = localStorage.getItem("friends");
    if (storedFriends) {
      this.setState({ friends: JSON.parse(storedFriends) });
    }
  }

  async fetchCountries() {
    const query = gql`
      query {
        countries(
          page: { first: 10 }
        ) {
          edges {
            node {
              name
            }
          }
        }
      }
    `;
  
    try {
      const data = await request<CountryData>(endpoint, query);
      console.log("data before:" ,data)
      const countryNames = data.countries.edges.map(edge => edge.node.name);
      console.log("data after: ",countryNames);
      if (Array.isArray(countryNames)) {
        this.setState({ countries: countryNames });
        console.log("Dentro do state: ",this.state.countries)
      }
      return countryNames
    } catch (error) {
      console.error('Erro ao buscar países da API:', error);
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

  handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    this.setState((prevState) => ({
      newFriend: {
        ...prevState.newFriend,
        country: selectedCountry, 
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
        <Button className="mx-4 mt-5" variant="success">
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
            <Form.Select className="mt-2" aria-label="Default select example"
              placeholder=""
              onChange={this.handleCountryChange}
              value={this.state.newFriend.country}>
              <option value="">Contact country</option>
              {this.state.countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </Form.Select>
            <Button className="mx-auto d-block mt-2" onClick={this.addFriend}>Add</Button>
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
                <Card
                  key={index}
                  className="mx-3 my-3"
                  style={{ width: "300px", height: "200px" }} 
                >
                <Card.Body>
                  <Card.Title as="h5">Name: {friend.name}</Card.Title>
                  <Card.Title as="h6">Country: {friend.country}</Card.Title>
                  <Card.Text>
                    TODO: this is supposed to be the first message
                  </Card.Text>
                </Card.Body>
                </Card>
                <Button className="mx-auto d-block mt-2" onClick={() => this.deleteFriend(index)}>Delete</Button>
              </div>          
              ))}
          </div>
          <div className="d-flex justify-content-center mt-5">
            {this.renderAddFriendForm()}
          </div>
      </div>
      );
  }
}

export default FriendsList;
