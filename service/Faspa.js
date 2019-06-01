/**
 * Created by Admin on 31-May-19.
 */
import React, { Component } from 'react';

baseurl = 'http://api.blika.is/';
baseurl2 = 'http://blika.is/api/';

var faspaService = {
    getStadir: function(upphaf){
        return fetch(baseurl + 'FaStadi/' + upphaf + '/7').then((response) => response.json());
    },
    getVinsaelir: function() {
        return fetch(baseurl + 'FaVinsaela').then((response) => response.json());
    },
    getFrettir: function() {
        return fetch(baseurl + 'FaFrettir').then((response) => response.json());
    },
    getFrett: function(slug) {
        return fetch(baseurl + 'FaFrett/' + slug).then((response) => response.json());
    }
};

export default faspaService;
