/**
 * Created by Admin on 31-May-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Header from '../screens/Header';
import faspaService from '../service/Faspa';
import { Card } from 'react-native-elements/src/index.d';



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
        console.log(this.state.dataSource);
        return (
            <View>
                <FlatList
                data={this.state.dataSource}
                renderItem={({item: rowData, index}) => <View >{this.displayRow(rowData, index)}</View>}
                />
            </View>
        )
    }
    displayRow(rowData, index) {
        if (index % 2 === 0) {
            return (
                <TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={styles.textcss}>{rowData.nafn}</Text>
                        {/*<Image
                            source={require('./assets/css/wu/icons/black/png/256x256' + rowData.merki + '.png')}
                        />*/}
                        <Text style={styles.textcss}>{rowData.merki}</Text>

                        <Text style={styles.textcss}>{(rowData.t2).toFixed(0) + '°'}</Text>

                        <Text style={styles.textcss}>{this.state.dataSource[index+1].merki}</Text>

                        <Text style={styles.textcss}>{(this.state.dataSource[index+1].t2).toFixed(0) + '°'}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        /*else {
            return (
                <TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text>{rowData.merki}</Text>
                        <Text>{(rowData.t2).toFixed(0) + '°'}</Text>
                    </View>
                </TouchableOpacity>
            )
        }*/
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
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
