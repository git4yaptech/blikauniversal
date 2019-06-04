/**
 * Created by Admin on 31-May-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Card } from 'react-native-elements/src/index.d';
import Header from '../screens/Header';
import faspaService from '../service/Faspa';
import Frettir from '../screens/Frettir';
import IconService from '../service/IconService';



export default class Vinsaelir extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource : [],
        }
    }

    componentDidMount() {
        faspaService.getVinsaelir()
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
                <Header navigation={this.props.navigation}/>
                <FlatList
                data={this.state.dataSource}
                renderItem={({item: rowData, index}) => <View >{this.displayRow(rowData, index)}</View>}
                />
                <Frettir navigation={this.props.navigation}/>
            </ScrollView>
        )
    }
    displayRow(rowData, index) {
        const { dataSource } = this.state;
        if (index % 2 === 0) {
            let imageIcon = IconService.getWeatherIcon(rowData.merki);
            let imageIconNext = '';
            if (dataSource.length > index) {
                 imageIconNext = IconService.getWeatherIcon(this.state.dataSource[index+1].merki);
            }
            return (
                <TouchableOpacity onPress={() => this._onPressCity(rowData.stodid)}>
                    <View style={styles.containerCss}>
                        <View style={{width: '40%'}}>
                        <Text style={styles.textcss}>{rowData.nafn}</Text>
                        </View>

                        <View style={{width: '10%'}}>
                        {/*<Text style={styles.textcss}>{rowData.merki}</Text>*/}
                             <Image style={{height: 30, width: 30}}
                             source={imageIcon}/>
                        </View>

                        <View style={{width: '20%'}}>
                        <Text style={styles.textcss}>{(rowData.t2).toFixed(0) + '°'}</Text>
                        </View>

                        <View style={{width: '10%'}}>
                            <Image style={{height: 30, width: 30}}
                                    source={imageIconNext}/>
                        </View>
                        <View style={{width: '20%'}}>
                        <Text style={styles.textcss}>{(this.state.dataSource[index+1].t2).toFixed(0) + '°'}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    _onPressCity(id) {
        this.props.navigation.navigate('Top',{itemId: id});
    }
}

const styles = StyleSheet.create({
    containerCss: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#e6e6e1',
        borderBottomWidth: 1,
        marginRight: 10,
        marginLeft: 10
    },
    textcss: {
        paddingLeft: 10,
        paddingRight: 10
    },

});
