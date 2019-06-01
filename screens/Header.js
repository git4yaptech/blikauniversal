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
        console.log(capitalWork);
        faspaService.getStadir(capitalWork)
            .then((data) => {
                console.log('data', text, data);
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
                            <TouchableOpacity>
                                <Text>{item[0]}</Text>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    auto: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
    }
});