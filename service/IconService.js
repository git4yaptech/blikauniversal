/**
 * Created by Admin on 03-Jun-19.
 */
import WEATHER_ICONS from '../service/constants';

var IconService = {

    getWindName : function(name) {
        return WEATHER_ICONS.wind[name];
    },

    getWeatherIcon: function (name) {
        return WEATHER_ICONS.day[name];
    },
};

export default IconService;