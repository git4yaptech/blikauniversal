/**
 * Created by Admin on 03-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity ,Image} from 'react-native';
import { Card } from 'react-native-elements';
import faspaService from '../service/Faspa';
import IconService from '../service/IconService';
import Moment from 'moment';


export default class Topforecast extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource : [],
            isLoading: true,
        }
    }
    componentDidMount(){
    const { params } = this.props.navigation.state;
    const itemID = params ? params.itemId : null;
    faspaService.getForecast12(itemID)
                .then((data) => {
                    this.setState({
                        isLoading: false,
                        dataSource: data,
                    }, function () {
                    });
                }).catch((error) => {
                console.log(error);
            })
    }

    render() {
        console.log(this.state.dataSource);
        if (this.state.isLoading) {
            return (

                <View style={{flex: 1, padding: 20}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (
            <View>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item: rowData, index}) => this.displayRow(rowData, index)}
                />
            </View>
        )
    }

    displayRow(rowData, index){
        var hours = Moment(rowData.dags_spar).format('HH');
      /*  var v1 = Moment(rowData[index+1].dags_spar.format('HH'));*/
        if(hours != '12') {
            return (
                <TouchableOpacity onPress={() => this._onPress(rowData)}>
                    <Card title={Moment(rowData.dags_spar).format('dddd D.MMM')}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{width: '20%'}}>
                                {hours < '12' ? <Text>{hours + '-12'}</Text> : null}
                                {hours >= '12' ? <Text>{hours + '-00'}</Text> : null}
                            </View>
                            <View style={{width: '20%'}}>
                                <Text>{rowData.merki}</Text>
                                {/*<Text>{this.getWindIcon(rowData.merki)}</Text>*/}
                            </View>
                            <View style={{width: '10%'}}><Text>{(rowData.t2).toFixed(0) + '°'}</Text></View>
                            <View style={{width: '20%'}}><Text>{(rowData.r).toFixed(0) + 'mm' } </Text></View>
                            <View style={{width: '20%'}}><Text>{rowData.dtexti}</Text></View>
                            {/*<View style={{width: '20%'}}>
                               <Text>{this.getWindIcon(rowData.dtexti)}</Text>*/}
                            <View style={{width: '10%'}}><Text>{(rowData.f10).toFixed(0) }</Text></View>
                            </View>
                    </Card>
                </TouchableOpacity>

            )
        }
}
    _onPress(rowData) {
        const param1 = Moment(rowData.dags_spar).format('YYYY');
            const param2 = Moment(rowData.dags_spar).format('MM');
            const param3 = Moment(rowData.dags_spar).format('DD');
            this.props.navigation.navigate('Dags',{itemId: rowData.stodid,ar:param1,man:param2,dagur:param3});
    }
    getWindIcon(dtexti){
            return IconService.getWindName(dtexti);
    }
    getWindIcon(merki){
        return IconService.getWindName(merki);
    }
}