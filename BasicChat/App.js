import React, { Component } from 'react';
import { View, Text,TextInput,Button,FlatList } from 'react-native';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hubConnection: null,
      messages: [],
      message: '',
      nick: ''
    };
  }
  componentDidMount() {
    this.state.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection', err));

    this.state.hubConnection.on('sendToChannel', (nick, message) => {
      const text = `${nick}: ${message}`;
      const messages = this.state.messages.concat([text]);
      this.setState({ messages });
    });
  }
  componentWillMount() {
    this.setState({
      hubConnection: new HubConnectionBuilder()
        .withUrl("http://chat.trakus.org/chat")
        .configureLogging(LogLevel.Debug)
        .build()
    });
  }
  sendMessage() {
    this.state.hubConnection
      .invoke('sendToChannel', this.state.nick, this.state.message)
      .catch(err => console.error(err));

    this.setState({ message: '' });
  }
  render() {
    return (
      <View>
        <Text>Welcome to Simple SignalR</Text>
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
