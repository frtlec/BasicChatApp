import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
const apiBase = "http://chat.trakus.org";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hubConnection: null,
      messages: [],
      message: '',
      nick: '',
      HelloHubConn: null,
      HelloMessage: ''

    };
  }
  componentDidMount() {
    this.state.hubConnection.on('sendToChannel', (nick, message) => {
      const text = `${nick}: ${message}`;
      const messages = this.state.messages.concat([text]);
      this.setState({ messages });
    });
    this.state.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection', err));
    this.state.HelloHubConn
      .start()
      .then(()=>this.helloMessage())
      .catch(err => console.log('Error while establishing connection', err));

      this.state.HelloHubConn.on('Counter', (hello) => {
        const HelloMessage = hello;
        console.log(hello);
        this.setState({ HelloMessage });
      });
      
      this.state.HelloHubConn.on('DisCounter', (hello) => {
        const HelloMessage = hello;
        console.log(hello);
        this.setState({ HelloMessage });
      });
  }

  helloMessage=()=>{
    this.state.HelloHubConn
    .invoke('Counter')
    .catch(err => console.error(err));
  }
  azaltCounter=()=>{
    this.state.HelloHubConn
    .invoke('DisCounter')
    .catch(err => console.error(err));


  }
  componentWillMount() {
    this.setState({
      hubConnection: new HubConnectionBuilder()
        .withUrl(apiBase + "/chat")
        .configureLogging(LogLevel.Debug)
        .build()
    });
    this.setState({
      HelloHubConn: new HubConnectionBuilder()
        .withUrl(apiBase + "/hello")
        .configureLogging(LogLevel.Debug)
        .build()
    });
    console.log(this.state.HelloHubConn);
  }
  sendMessage() {
    this.state.hubConnection
      .invoke('sendToChannel', this.state.nick, this.state.message)
      .catch(err => console.error(err));

  }
  render() {
    //this.setState({ message: '' });

    return (

      <View>
        <Text>Welcome to Simple SignalR</Text>
        <Text>{this.state.HelloMessage}</Text>
      <Button onPress={this.helloMessage} title="art"></Button>
      <View style={{marginTop:5}}>
      <Button onPress={this.azaltCounter} title="azalt"></Button>
      </View>
     
        <TextInput
          placeholder={"Nick name"}
          style={{ height: 40, width: 250, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({
            nick: text
          })}
          value={this.state.nick}
        />
        <TextInput
          placeholder={"Message"}
          style={{ height: 40, width: 250, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.setState({
            message: text
          })}
          value={this.state.message}
        />
        <Button
          onPress={this.sendMessage.bind(this)}
          title="Send"
          color="#841584"
        />
        <FlatList
          data={this.state.messages}
          renderItem={({ item }) => <Text>{item}</Text>}
        />
      </View>
    );
  }
}
