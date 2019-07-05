import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
// import Burger from '../../components/Burger/Burger';
// import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';
import DatePicker from 'react-datepicker';
// import './../../../node_modules/react-datepicker/dist/react-datepicker.css';
import UnfoldedCalendar from '../../components/UnfoldedCalendar/unfoldedCalendar';

class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        startDate: new Date(),
        spent_time: '',
        description: ''
    }

    componentDidMount () {
        this.props.onInitIngredients();
    }

    updatePurchaseState ( ingredients ) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState( { purchasing: true } );
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } );
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    handleChange = startDate => this.setState({ startDate })

    onChangeHandler = (term, e) => {
        console.log(term, e.target.value)
        this.setState({[term]: e.target.value})
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        
        if ( this.props.reports ) {
            const reports = this.props.reports.map( (el, i) => {
                return (this.props.editReportIndex === i ? 
                        <tr key={i} >
                            <td> <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                dateFormat="YYYY-MM-DD"
                            /></td>
                                 {/* <input value={el.date}/> */}
                            <td> <input  value={this.state.spent_time} readOnly='false'/>  </td>
                            <td> <input type="text" name="spentTime" placeholder='введите значение' onChange={(e) => this.onChangeHandler('spent_time', e)} value={this.state.spent_time} />  </td>
                            <td><button onClick={() => this.props.onHourAdded(+this.state.spent_time, el)}>save </button></td>
                            <td><button onClick={() => this.props.onEditTracker(el, null)}>close </button></td>
                        </tr>
                 : <tr key={i} >
                        <td>{el.date}</td>
                        <td>{el.description}</td>
                        <td>{el.spent_time}</td>
                        <td><button onClick={() => this.props.onEditTracker(el, i)}>edit</button></td>                       
                        <td><button onClick={() => this.props.onHourAdded(+el.spent_time + 1, el)}>inc</button></td>
                        <td><button onClick={() => this.props.onDicrementHour(+el.spent_time - 1, el)}>dec</button></td>
                    </tr>)
            });
            burger = (
                <Aux>
                    <div >
                        <UnfoldedCalendar />
                    <table className="tableReports">
                        <tbody>
                            <tr>
                            <td> <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                dateFormat="yyyy-MM-dd"/>
                                
                            </td>
                            <td> <input  value={this.state.description} onChange={(e) => this.onChangeHandler('description', e)}/>  </td>
                            <td> <input type="text" name="spentTime" placeholder='введите значение' onChange={(e) => this.onChangeHandler('spent_time', e)} value={this.state.spent_time} />  </td>
                            <td> <button onClick={() => this.props.onHourAdded(+this.state.spent_time, {
                                date: this.state.startDate,
                                description: this.state.description,
                                project_id: 79,
                                spent_time: this.state.spent_time,
                                task: null,
                                tracker_type: 4,
                            })}> save </button></td>
                   
                        </tr>
                            {reports}
                        </tbody>
                    </table>
                    </div>
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />;
        }
        // {salad: true, meat: false, ...}
        console.log(999999);
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
        reports: state.burgerBuilder.reports,
        editReportIndex: state.burgerBuilder.editReportIndex
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
        onHourAdded: (spentTime, newDate) => dispatch(actions.addHour(spentTime, newDate)),
        onDicrementHour: (spentTime, newDate) => dispatch(actions.dicrementHour(spentTime, newDate)),
        onEditTracker: (tracker, i) => {
            dispatch(actions.editTracker(tracker, i))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));