/**
 * Created by Admin on 01-Jun-19.
 */
import React, { Component } from 'react';
import { View, Text, Image} from 'react-native';
import faspaService from '../service/Faspa';
import Moment from 'moment';


export default class Frett extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource : {},
        }
    }

    componentDidMount() {
        const {params} = this.props.navigation.state;
        const slug = params ? params.url : null;
        faspaService.getFrett(slug)
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
        /* setTimeout(function () {
        this.state.details = this.state.dataSource;
        },1000);
        console.log(details);*/
        return (

                <View>
                    <Text>News Details Page</Text>
                    {/* <Text>{ this.state.details[0].hofundur}</Text>
                     <Text>{Moment( this.state.details[0].dags_spar).format('dd.MM.YYYY HH:mm')}</Text>
                     <Text>{ this.state.details[0].titill}</Text>*/}
                </View>


        )
    }
}