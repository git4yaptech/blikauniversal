/**
 * Created by Admin on 03-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet,Image } from 'react-native';
import faspaService from '../service/Faspa';
import IconService from '../service/IconService';
import { Styles } from './globalStyle';
import Moment from 'moment';

export default class Dagsspa extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource : [],
            isLoading: true,
        }
    }
    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log('params',params);
        const itemID = params ? params.itemId : null;
        const ar = params ? params.ar : null;
        const man = params ? params.man : null;
        const dagur = params ? params.dagur : null;
        faspaService.getForecastDay(itemID, ar, man, dagur)
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
                <View>
                <Text style={styles.heading}>{Moment(this.state.dataSource[0].dags_spar).format('dddd D.MMM')}</Text>
                </View>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item: rowData, index}) => this.displayRow(rowData, index)}
                />
            </View>
        )

    }
    displayRow(rowData, index) {
        let imageIcon = IconService.getWeatherIcon(rowData.merki);
            return (
                    <View style={styles.containerCss}>
                        <View style={{width: '15%'}}>
                            <Text style={styles.textcss}>{Moment(rowData.dags_spar).format('HH')}</Text>
                        </View>
                        <View style={{width: '20%'}}>
                            <Image style={{height: 30, width: 30}}
                                   source={imageIcon}/>
                        </View>

                        <View style={{width: '15%'}}>
                            <Text style={[(rowData.t2).toFixed(0) > 0 ? Styles.textcssHot : Styles.textcssCold]}>{(rowData.t2).toFixed(0) + '°'}</Text>
                        </View>

                        <View style={{width: '30%'}}>
                            <Text style={styles.textcss}>{(rowData.r).toFixed(1.0-1) + ' mm'}</Text>
                        </View>
                        <View style={{width: '10%'}}>
                            <Text style={Styles.windIcon}>{IconService.getWindName(rowData.dtexti)}</Text>
                        </View>

                        <View style={{width: '15%'}}>
                            <Text style={styles.textcss}>{(rowData.f10).toFixed(0)}</Text>
                        </View>
                    </View>
            )
        }
}
const styles = StyleSheet.create({
    containerCss: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#e6e6e1',
        borderBottomWidth: 1,
    },
    textcss: {
        paddingLeft: 10,
        paddingRight: 10
    },
    heading : {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    }

});