/**
 * Created by Admin on 01-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Card } from 'react-native-elements';
import faspaService from '../service/Faspa';
import Header from '../screens/Header';
import Vinsaelir from '../screens/Vinsaelir';
import { WebView } from 'react-native-webview';

export default class Frettir extends Component {
    constructor(props) {
        super(props)
        this.state = {
        dataSource : [],
    }
}
    componentDidMount() {
        faspaService.getFrettir()
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

            <ScrollView>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item: rowData, index}) => this.displayRow(rowData, index)}
                />
            </ScrollView>
        )
    }
    displayRow = (rowData, index) => {
        const imageSrc = "http://api.blika.is/media/"+rowData.mynd;
        return (
            <TouchableOpacity onPress={() => this._onPress(rowData.url)}>
            <Card title={rowData.titill}>
                <Image style={{height: 200, width: '100%'}} source={{uri:imageSrc }}/>
               {/* <WebView style={{height: 60, width: '100%'}}  source={{uri:rowData.efni}} />*/}
                <WebView source={{ uri: rowData.efni}}
                         style={{height: 80, width: '100%'}}
                />
                <Text>Read more...</Text>
            </Card>
            </TouchableOpacity>
        )}
    _onPress = (url) => {
        this.props.navigation.navigate('Frett', {url});
    }


}
