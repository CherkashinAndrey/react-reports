import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
// import { token } from '../../consts/token';
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

export const setFormFields = (res) => {
    return {
        type: actionTypes.SET_FORM_FIELDS,
        formFields: res
    };
}

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
    debugger
    const newDateMod = {
        date: newDate.id  && typeof(time)!=='number' ?   moment(time.startDate).format('YYYY-MM-DD') : moment(newDate.date).format('YYYY-MM-DD'),
        description: newDate.id && typeof(time)!=='number' ? time.description : newDate.description,
        project_id: newDate.project_id,
        spent_time: newDate.id  && typeof(time)!=='number' ? time.spent_time : time,
        task: newDate.task,
        tracker_type: newDate.tracker_type,
    };

    const method = newDate.id ? 'patch' : 'post';
    const path = newDate.id ? newDate.id : 'new';
    return (dispatch, getState) => {
        axios[method]( `https://home.flexaspect.com/api/${newDate.id ? '' : 'user/'}reports/${path}`, newDateMod , { headers: { authorization: `Bearer ` + getState().auth.token } } )
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

    return (dispatch, getState) => {
        axios.patch( `https://home.flexaspect.com/api/reports/${newDate.id}`, newDateMod , { headers: { authorization: `Bearer ` + getState().auth.token } } )
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
    return {
        type: actionTypes.EDIT_REPORT_INDEX,
        editReportIndex: i
    }
}

export const initIngredients = (path = '') => {
console.log('*path',path);
    return (dispatch, getState) => {
        axios.get( `https://home.flexaspect.com/api/user/88/reports${'?'+path}`, { headers: { authorization: `Bearer ` + getState().auth.token } } )
            .then( response => {
                console.log(response);
                dispatch(setIngredients(response));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
    
};

export const initFormFields = () => {
        return (dispatch, getState) => {
            axios.get( `https://home.flexaspect.com/api/reports/form-fields`, { headers: { authorization: `Bearer ` + getState().auth.token } } )
                .then( response => {
                    console.log(response);
                   dispatch(setFormFields(response));
                } )
                .catch( error => {
                    dispatch(fetchIngredientsFailed());
                } );
        };    
};


export const onInitCalendar = () => {
    return (dispatch, getState) => {
        axios.get( 'https://home.flexaspect.com/api/user/calendar', { headers: { authorization: `Bearer ` + getState().auth.token } } )
            .then( response => {
                console.log('calendar',response);
                dispatch(setUnfoldedCalendar(response));
            } )
            .catch( error => {
                dispatch(fetchIngredientsFailed());
            } );
    };
    
};