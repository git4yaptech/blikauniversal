/**
 * Created by Admin on 03-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity ,Image, ScrollView} from 'react-native';
import { Card, Icon } from 'react-native-elements';
import Header from '../screens/Header';
import faspaService from '../service/Faspa';
import IconService from '../service/IconService';
import { Styles } from './globalStyle';
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
             <ScrollView>
                <Header/>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item: rowData, index}) => this.displayRow(rowData, index)}
                />
             </ScrollView>
        )
    }

    displayRow(rowData, index){
        var hours = Moment(rowData.dags_spar).format('HH');
        if(hours != '12') {
            let imageIcon = IconService.getWeatherIcon(rowData.merki);
            return (
                <TouchableOpacity onPress={() => this._onPress(rowData)}>
                    <Card title={Moment(rowData.dags_spar).format('dddd D.MMM')}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{width: '20%'}}>
                                {hours < '12' ? <Text>{hours + '-12'}</Text> : null}
                                {hours >= '12' ? <Text>{hours + '-00'}</Text> : null}
                            </View>
                            <View style={{width: '20%'}}>
                                <Image style={{height: 30, width: 30}}
                                       source={imageIcon}/>
                            </View>
                            <View style={{width: '20%'}}><Text>{(rowData.t2).toFixed(0) + '°'}</Text></View>
                            <View style={{width: '20%'}}><Text>{(rowData.r).toFixed(0) + ' mm' } </Text></View>
                            <View style={{width: '10%'}}>
                                <Text style={Styles.windIcon}>{IconService.getWindName(rowData.dtexti)}</Text>
                            </View>
                            <View style={{width: '10%'}}><Text>{(rowData.f10).toFixed(0) }</Text></View>
                        </View>
                        {this.state.dataSource.length != index+1 &&  Moment(this.state.dataSource[index+1].dags_spar).format('HH') != '00' ?
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{width: '20%'}}>
                                    {Moment(this.state.dataSource[index+1].dags_spar).format('HH') < '12' ? <Text>{Moment(this.state.dataSource[index+1].dags_spar).format('HH') + '-12'}</Text> : null}
                                    {Moment(this.state.dataSource[index+1].dags_spar).format('HH') >= '12' ? <Text>{Moment(this.state.dataSource[index+1].dags_spar).format('HH') + '-00'}</Text> : null}
                                </View>
                                <View style={{width: '20%'}}>
                                 {/*   <Text>{this.state.dataSource[index+1].merki}</Text>*/}
                                    <Image style={{height: 30, width: 30}}
                                           source={IconService.getWeatherIcon(this.state.dataSource[index+1].merki)}/>
                                </View>
                                <View style={{width: '20%'}}><Text>{(this.state.dataSource[index+1].t2).toFixed(0) + '°'}</Text></View>
                                <View style={{width: '20%'}}><Text>{(this.state.dataSource[index+1].r).toFixed(0) + ' mm' } </Text></View>
                                <View style={{width: '10%'}}><Text style={Styles.windIcon}>{IconService.getWindName(this.state.dataSource[index+1].dtexti)}</Text></View>
                                <View style={{width: '10%'}}><Text>{(this.state.dataSource[index+1].f10).toFixed(0) }</Text></View>
                            </View>
                             : null}
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
}