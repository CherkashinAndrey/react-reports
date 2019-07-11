import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';
// import { setFormFields } from '../actions/burgerBuilder';

const initialState = {
    ingredients: null,
    reports: null,
    editReportIndex: null,
    totalPrice: 4,
    error: false,
    building: false,
    calendar: {},
    formField: null
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const addIngredient = ( state, action ) => {
    const updatedIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 }
    const updatedIngredients = updateObject( state.ingredients, updatedIngredient );
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject( state, updatedState );
};

const removeIngredient = (state, action) => {
    const updatedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 }
    const updatedIngs = updateObject( state.ingredients, updatedIng );
    const updatedSt = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true
    }
    return updateObject( state, updatedSt );
};

const setIngredients = (state, action) => {
    return updateObject( state, {
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        reports: action.ingredients.data,
        totalPrice: 4,
        error: false,
        building: false
    } );
};

const changeUpdateReportsTime = (state, action) => {
    return updateObject( state, {
        reports: state.reports.map((el) => { 
            if (el.id === action.reports.id) {
                return action.reports 
            } else {
                return el;
            }
            
        }),
        editReportIndex: null,
        error: false,
        building: false
    } );
};

const editReportIndex = (state, action) => {
    return updateObject( state, {
        editReportIndex: action.editReportIndex,
        error: false,
        building: false
    } );
};

const setUnfoldedCalendar = (state, action) => {
    return updateObject(state, {
        calendar: action.calendar.data,
        error: false,
        building: false
    });
};

const setFormFieldsState = (state, action) => {
    return updateObject(state, {
        formField: action.formFields.data,
        error: false,
        building: false
    });
}

const fetchIngredientsFailed = (state, action) => {
    return updateObject( state, { error: true } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_INGREDIENT: return addIngredient( state, action );
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);    
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
        case actionTypes.CHANGE_REPORTS_TIME: return changeUpdateReportsTime(state, action);
        case actionTypes.EDIT_REPORT_INDEX: return editReportIndex(state, action);
        case actionTypes.SET_UNFOLDED_CALENDAR: return setUnfoldedCalendar(state, action);
        case actionTypes.SET_FORM_FIELDS : return setFormFieldsState(state, action);
        default: return state;
    }
};

export default reducer;