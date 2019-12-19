import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Text,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class HomeContainer extends Component {
    static navigationOptions = {
        title: 'Home'
    }

    state = {
        userList: [],
        searchKey: ''
    }

    async componentDidMount() {
        let token = await AsyncStorage.getItem('token');
        fetch('http://192.168.43.170:3000/users/getallname', {
            method: 'GET',
            headers: { 'Authorization': token }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    userList: responseJson
                })
            })
            .then(console.log('Fetched all name'))
    }

    _logout = async () => {
        await AsyncStorage.clear();
        console.log('Signing Out..');
        this.props.navigation.navigate('Auth');
    }

    render() {
        const { userList } = this.state;
        const filteredData = userList.filter((item) => {
            return item.name.indexOf(this.state.searchKey) >= 0
        })

        return (
            <Fragment>
                <View style={styles.wrapper}>
                    <StatusBar backgroundColor="#fbc02d" barStyle="dark-content" />

                    <View style={styles.searchWrapper}>
                        <TextInput
                            style={styles.searchbox}
                            placeholder="Search for user..."
                            onChangeText={(value) => this.setState({ searchKey: value })} />
                    </View>

                    <View style={styles.listWrapper}>
                        <ScrollView >
                            {filteredData.map((item, index) => {
                                if (index == 0) {
                                    return (
                                        <View style={styles.firstlistItem} key={index}>
                                            <Text>{index + 1}. {item.name}</Text>
                                        </View>);
                                } else {
                                    return (
                                        <View style={styles.listItem} key={index}>
                                            <Text>{index + 1}. {item.name}</Text>
                                        </View>)
                                }
                            })}
                        </ScrollView>
                    </View>

                    <View style={styles.logoutWrapper}>
                        <TouchableOpacity onPress={this._logout} style={styles.logoutButton}>
                            <Text style={{ textAlign: 'center', color: '#000000' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Fragment>
        );
    }

}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#E1E2E1',
        alignContent: 'center',
        paddingHorizontal: '10%',
        flex: 1,
        paddingTop: 20
    },
    searchWrapper: {
        marginVertical: 10,
        height: 50
    },
    searchbox: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white'
    },
    listWrapper: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        height: 500,
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    firstlistItem: {
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingBottom: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderBottomColor: 'gray',
        backgroundColor: '#fffffa'
    },
    listItem: {
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingTop: 15,
        paddingBottom: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderBottomColor: 'gray',
        backgroundColor: '#fffffa'
    },
    logoutWrapper: {
        backgroundColor: '#E1E2E1',
        height: 70,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoutButton: {
        width: '30%',
        padding: 10,
        backgroundColor: '#FBC02D'
    }
})