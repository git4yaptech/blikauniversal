/**
 * Created by Admin on 01-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Card } from 'react-native-elements';
import faspaService from '../service/Faspa';
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
                <Image style={{height: 150, width: '100%'}} source={{uri:imageSrc }}/>
               <Text>Read More...</Text>
             {/*  <WebView source={{uri: rowData.efni}} style={{height: 150, width: '100%'}} />*/}
            </Card>
            </TouchableOpacity>
        )
    }
    _onPress = (url) => {
        this.props.navigation.navigate('Frett', {url});
    }


}
