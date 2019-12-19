import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    StatusBar,
    TouchableOpacity,
    Alert,
    ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Text, Form, Item, Label, Input } from 'native-base';

export default class LoginContainer extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            email: "", password: ""
        }
    }

    render() {
        const { navigate } = this.props.navigation;

        return (
            <KeyboardAvoidingView>
                <StatusBar backgroundColor="#EBAC1F" barStyle="dark-content" />
                <View style={styles.wrapper}>
                    <Text style={styles.loginHeader}>Login</Text>

                    <Form style={styles.formWrapper}>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
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
                                onChangeText={(password) => this.setState({ password })} />
                        </Item>
                        <Button style={styles.buttonWrapper} onPress={this._login}>
                            <Text style={{ textAlign: 'center' }}>Login</Text>
                        </Button>
                    </Form>

                    <View style={styles.textRow}>
                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigate('register')}>
                            <Text style={styles.signupText}>Sign up now.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }

    _login = async () => {
        if (this.state.email == "") {
            ToastAndroid.show('Did you forgot to type your email?', ToastAndroid.SHORT);
        }
        else if (this.state.password == "") {
            ToastAndroid.show('Can I get your password?', ToastAndroid.SHORT);
        }
        else if (this.state.password.length < 6) {
            Alert.alert('Wrong Credentials', 'Are your credentials correct? Try again..', [{
                text: 'Okay'
            }])
        }
        else if (this.state.email != "" && this.state.password.length >= 6) {
            try {
                let response = await fetch('http://192.168.43.170:3000/users/signin', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                    }),
                });
                let responseJson = await response.json();
                await AsyncStorage.setItem('token', responseJson.token);
                await AsyncStorage.setItem('isLoggedIn', '1');
                ToastAndroid.show('Signing In....', ToastAndroid.SHORT);
                console.log('Logging In...');
                this.props.navigation.navigate('home');

            } catch (error) {
                console.log(error);
                Alert.alert('Wrong Credentials', 'Are your credentials correct? Try again..', [{
                    text: 'Okay'
                }])
            }
        } else {
            Alert.alert('Wrong Credentials', 'Are your credentials correct? Try again..', [{
                text: 'Okay'
            }])
        }
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#EBAC1F",
        paddingHorizontal: 30,
        paddingVertical: 20,
        height: "100%",
        alignContent: 'center',
        justifyContent: 'center'
    },
    loginHeader: {
        fontSize: 28,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    formWrapper: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 20,
        borderColor: "#D3D3D3",
        borderRadius: 30,
        borderWidth: 0.5,
        justifyContent: "space-between",
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