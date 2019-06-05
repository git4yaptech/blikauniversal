/**
 * Created by Admin on 31-May-19.
 */
import React, { Component } from 'react';
import faspaService from '../service/Faspa';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

export default class Header extends Component {
    /*  FaspaService = new Faspa();*/

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            query: null
        }
    }

    componentDidMount() {
    }

    autoCompleteData(text) {
            this.setState({query: text});
            let capitalWork: string = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            faspaService.getStadir(capitalWork)
                .then((data) => {
                    this.setState({
                        dataSource: data
                    }, function () {
                    });
                }).catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <View style={{padding : 5,flex: 1, flexDirection: 'row'}}>
                <View >
                     <Image style={{height: 70, width: 70}} source={{uri: "http://api.blika.is/static/img/logo/logo.png"}}  resizeMode="contain"/>
                </View>
                <View style={styles.auto}>
                    <Autocomplete
                        data={this.state.dataSource}
                        defaultValue={this.state.query}
                        onChangeText={text => this.autoCompleteData(text)}

                        renderItem={({item, i}) => (
                            <View>
                            <TouchableOpacity onPress={() => this._onPressCity(item[1])}>
                                <View style={styles.containerCss}>
                                <Text>{item[0]}</Text>
                                </View>
                            </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            </View>
        )
    }

    _onPressCity(id) {
        this.props.navigation.navigate('Top',{itemId: id});
    }
}
const styles = StyleSheet.create({
    auto: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
    },
    containerCss: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#e6e6e1',
        borderBottomWidth: 1,
        marginRight: 10,
        marginLeft: 10,
    },
    textcss: {
        paddingLeft: 10,
        paddingRight: 10
    },
});