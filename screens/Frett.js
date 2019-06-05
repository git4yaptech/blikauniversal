/**
 * Created by Admin on 01-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import faspaService from '../service/Faspa';
import Moment from 'moment';


export default class Frett extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            isLoading: true,

        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        const slug = params ? params.url : null;
        faspaService.getFrett(slug)
            .then((data) => {
                this.setState({
                    isLoading: false,
                    dataSource: data
                }, function () {
                });
            }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        if (this.state.isLoading) {
            return (

                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        var rowData = this.state.dataSource[0];
        var imageData = 'http://api.blika.is/media/' + rowData['mynd'];
        var news = rowData.efni.replace(/<img[^>]*>/g, '');
        return (
            <ScrollView>
            <View>
                <Text>{rowData.hofundur} | {Moment(rowData.dags_spar).format('dd.MM.YYYY HH:mm')}</Text>
                <Text>{rowData.titill}</Text>
                <Image style={{height: 200, width: '100%', paddingHorizontal: 5}}
                       source={{uri: imageData}}/>
                <WebView source={{html:news}} style={{height: 200, width: '100%', paddingHorizontal: 5,fontSize:20}}/>
            </View>
            </ScrollView>
        )
    }
}