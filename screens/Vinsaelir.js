/**
 * Created by Admin on 31-May-19.
 */
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Header from '../screens/Header';
import faspaService from '../service/Faspa';
import { Card } from 'react-native-elements/src/index.d';
import Frettir from '../screens/Frettir';



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

            <ScrollView>
                <Header/>

                <FlatList
                data={this.state.dataSource}
                renderItem={({item: rowData, index}) => <View >{this.displayRow(rowData, index)}</View>}
                />
                <Frettir/>
            </ScrollView>
        )
    }
    displayRow(rowData, index) {
        if (index % 2 === 0) {
            return (
                <TouchableOpacity onPress={() => this._onPressCity(rowData.stodid)}>
                    <View style={styles.containerCss}>
                        <View style={{width: '30%'}}>
                        <Text style={styles.textcss}>{rowData.nafn}</Text>
                        </View>

                        <View style={{width: '20%'}}>
                       {/* <Text style={styles.textcss}>{rowData.merki}</Text>*/}
                             <Image style={{height: 20, width: 20}}
                             source={{uri:'../256x256/' + rowData.merki + '.png'}}
                             />
                        </View>

                        <View style={{width: '20%'}}>
                        <Text style={styles.textcss}>{(rowData.t2).toFixed(0) + '°'}</Text>
                        </View>

                        <View style={{width: '20%'}}>
                        <Text style={styles.textcss}>{this.state.dataSource[index+1].merki}</Text>
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
