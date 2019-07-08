import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import { token } from '../../consts/token';
import * as moment from 'moment';

export const addIngredient = ( name ) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = ( name ) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = ( ingredients ) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const changeIncremrentTime = ( res ) => {
    return {
        type: actionTypes.CHANGE_REPORTS_TIME,
        reports: res
    };
};


export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    };
};

export const setUnfoldedCalendar = ( res ) => {
    return {
        type: actionTypes.SET_UNFOLDED_CALENDAR,
        calendar: res
    };
};

export const addHour = ( time, newDate ) => {
    
    const newDateMod = {
        date: newDate.id ?   moment(time.startDate).format('YYYY-MM-DD') : moment(newDate.date).format('YYYY-MM-DD'),
        description: newDate.id ? time.description : newDate.description,
        project_id: newDate.project_id,
        spent_time: newDate.id ? time.spent_time : time,
        task: newDate.task,
        tracker_type: newDate.tracker_type,
    };

    const method = newDate.id ? 'patch' : 'post';
    const path = newDate.id ? newDate.id : 'new';
    return dispatch => {
        axios[method]( `https://home.flexaspect.com/api/${newDate.id ? '' : 'user/'}reports/${path}`, newDateMod , { headers: { authorization: token } } )
            .then( response => {
                console.log(response);
               dispatch(onInitCalendar());
               if (!newDate.id) {
                dispatch(initIngredients());
               }
               dispatch(changeIncremrentTime(response.data));
            })
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
}

export const dicrementHour = ( time, newDate ) => {
    // console.log(time, newDate, moment);
    const newDateMod = {
        date: moment(newDate.date).format('YYYY-MM-DD'),
        description: newDate.description,
        project_id: newDate.project_id,
        spent_time: time,
        task: newDate.task,
        tracker_type: newDate.tracker_type,
    };

    return dispatch => {
        axios.patch( `https://home.flexaspect.com/api/reports/${newDate.id}`, newDateMod , { headers: { authorization: token } } )
            .then( response => {
                console.log(response);
                dispatch(onInitCalendar());
                dispatch(changeIncremrentTime(response.data));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
}


export const editTracker = (tracker, i) => {
    console.log(tracker);
    return {
        type: actionTypes.EDIT_REPORT_INDEX,
        editReportIndex: i
    }
}

export const initIngredients = () => {
    return dispatch => {

        axios.get( 'https://home.flexaspect.com/api/user/88/reports', { headers: { authorization: token } } )
            .then( response => {
                console.log(response);
               dispatch(setIngredients(response));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
    
};

export const onInitCalendar = () => {
    return dispatch => {
        axios.get( 'https://home.flexaspect.com/api/user/calendar', { headers: { authorization: token } } )
            .then( response => {
                console.log('calendar',response);
                dispatch(setUnfoldedCalendar(response));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
    
};