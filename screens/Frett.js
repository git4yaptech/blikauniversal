/**
 * Created by Admin on 01-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, Image, WebView, TouchableOpacity } from 'react-native';
import faspaService from '../service/Faspa';
import Moment from 'moment';


export default class Frett extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        const slug = params ? params.url : null;
        faspaService.getFrett(slug)
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
        const dataArray = this.state.dataSource;
        return (
            <View>
            </View>
        )
    }
}