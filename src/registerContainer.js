import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
    ToastAndroid,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Content, Button, Text, Form, Item, Label, Input } from 'native-base';

export default class RegisterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "", name: "", password: ""
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <Container>
                <StatusBar backgroundColor="#fbc02d" barStyle="dark-content" />
                <Content style={styles.wrapper}>
                    <Text style={styles.loginHeader}>Register</Text>

                    <Form style={styles.formWrapper}>
                        <Item floatingLabel>
                            <Label>Name</Label>
                            <Input
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                placeholder="example@email.com"
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </Item>

                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                            />
                        </Item>
                        <Text style={styles.sample}>(Kindly input at least 6 alphanumeric characters)</Text>

                        <View style={{ height: 30 }} />
                        <Button style={styles.buttonWrapper} onPress={this._register}>
                            <Text style={{ textAlign: 'center' }}>Register</Text>
                        </Button>
                    </Form>

                    <View style={styles.textRow}>
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigate('login')}>
                            <Text style={styles.signupText}>Sign in now.</Text>
                        </TouchableOpacity>
                    </View>
                </Content>
            </Container>
        );
    }

    _register = async () => {
        if (this.state.name == "") {
            ToastAndroid.show('What\'s your name?', ToastAndroid.SHORT);
        }
        else if (this.state.email == "") {
            ToastAndroid.show('Did you forgot to type your email?', ToastAndroid.SHORT);
        }
        else if (this.state.password == "") {
            ToastAndroid.show('Hey, you left out your password', ToastAndroid.SHORT);
        }
        else if (this.state.password.length < 6) {
            ToastAndroid.show('Please enter a password with at least 6 alphanumeric characters', ToastAndroid.SHORT);
        }
        else if (this.state.name != "" && this.state.email != "" && this.state.password.length >= 6) {
            try {
                let response = await fetch('http://ec2-18-219-240-129.us-east-2.compute.amazonaws.com:3000/users/signup', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password,
                    }),
                });
                let responseJson = await response.json();
                if (responseJson.token == null || responseJson.error == 'Email exist!') {
                    Alert.alert('Email Exist!', 'Hey, your email is registered in our database. Try to sign in instead.', [{
                        text: 'Okay'
                    }])
                    return;
                }
                await AsyncStorage.setItem('token', responseJson.token);
                await AsyncStorage.setItem('isLoggedIn', '1');
                console.log('Registering..');
                this.props.navigation.navigate('home');
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert('Oh oh', 'There\'s something wrong with our server. Try again..', [{
                text: 'Okay'
            }])
        }
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingTop: 30
    },
    loginHeader: {
        fontSize: 28
    },
    formWrapper: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10
    },
    sample: {
        fontSize: 10,
        fontStyle: 'italic'
    },
    buttonWrapper: {
        width: "50%",
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    signupText: {
        color: "blue",
        fontWeight: 'bold'
    }
})