/**
 * Created by Admin on 31-May-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Styles } from './globalStyle';
import Header from '../screens/Header';
import faspaService from '../service/Faspa';
import Frettir from '../screens/Frettir';
import Advertisment from '../screens/Advertisment';
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
                <View style={styles.HeadingContainer}>
                    <View style={{width: '40%'}}>
                    </View>

                    <View style={{width: '30%'}}>
                        <Text style={styles.textcss}>Í dag</Text>
                    </View>

                    <View style={{width: '30%'}}>
                        <Text style={styles.textcss}>Á morgun</Text>
                    </View>

                </View>

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
                        <Text style={[(rowData.t2).toFixed(0) > 0 ? Styles.textcssHot : Styles.textcssCold]}>{(rowData.t2).toFixed(0) + '°'}</Text>
                        </View>

                        <View style={{width: '10%'}}>
                            <Image style={{height: 30, width: 30}}
                                    source={imageIconNext}/>
                        </View>
                        <View style={{width: '20%'}}>
                        <Text style={[(this.state.dataSource[index+1].t2).toFixed(0) > 0 ? Styles.textcssHot : Styles.textcssCold]}>{(this.state.dataSource[index+1].t2).toFixed(0) + '°'}</Text>
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
    HeadingContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        marginRight: 10,
        marginLeft: 10
    },
    containerCss: {
        flex: 1,
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#e6e6e1',
        borderBottomWidth: 1,
        marginRight: 10,
        marginLeft: 10
    },


});
