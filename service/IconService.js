/**
 * Created by Admin on 03-Jun-19.
 */
import WEATHER_ICONS from '../service/constants';

var IconService = {
    getIconName : function(name) {
         return String.fromCharCode(WEATHER_ICONS.day[name]);
    },

    getWindName : function(name) {
        return String.fromCharCode(WEATHER_ICONS.wind[name]);
    },
};

export default IconService;