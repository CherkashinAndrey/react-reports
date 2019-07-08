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
import * as moment from 'moment';

class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        startDate: new Date(),
        spent_time: '',
        description: '',
        editTracker: {
            startDate: new Date(),
            spent_time: '',
            description: '',
        }
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

    onChangeHandler = (term, e, edit) => {
        edit !== 'new' ? this.setState(
             {editTracker : {...this.state.editTracker, [term]: e.target.value } }
            ) : this.setState({[term]: e.target.value})
    }

    onChangeHadlerState = (el, i) => {   
        this.setState({
            editTracker : {
                startDate: new Date(el.date),
                spent_time: el.spent_time,
                description: el.description
            } 
 
        })
        this.props.onEditTracker(el, i)
    }

    onCopyReport = (el) => {
        this.setState({
            startDate: new Date(el.date),
            spent_time: el.spent_time,
            description: el.description
        })
    }

    render () {
        const disabledInfo = {
            ...this.props.ings
        };
        
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let monthReports = [];
        let report = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        const listReportsMonth = [];
        for (let i=0; i<=1; i++) {
            listReportsMonth.push( moment().startOf('month').subtract(i, 'month').format('MMM'));  
        }

        if ( this.props.reports ) {
            const reports = this.props.reports.map( (el, i) => {
                return (this.props.editReportIndex === i ? 
                        <tr key={i} >
                            <td> <DatePicker
                                selected={this.state.editTracker.startDate}
                                onChange={this.handleChange}
                                dateFormat="yyyy-MM-dd"
                            /></td>
                            <td> <input  value={this.state.editTracker.description} 
                                        onChange={(e) => this.onChangeHandler('description', e, 'editTracker')} />  </td>
                            <td> <input type="text" 
                                        name="spentTime" 
                                        placeholder='введите значение' 
                                        onChange={(e) => this.onChangeHandler('spent_time', e, 'editTracker')} 
                                        value={this.state.editTracker.spent_time} />  </td>
                            <td><button onClick={() => this.props.onHourAdded(this.state.editTracker, el)}>save -</button></td>
                            <td><button onClick={() => this.props.onEditTracker(el, null)}>close </button></td>
                        </tr>
                 : <tr key={i} >
                        <td>{el.date}*</td>
                        <td>{el.description}</td>
                        <td>{el.spent_time}</td>
                        <td><button onClick={() => this.onChangeHadlerState(el, i)}>edit</button></td>                       
                        <td><button onClick={() => this.props.onHourAdded(+el.spent_time + 1, el)}>inc</button></td>
                        <td><button onClick={() => this.props.onDicrementHour(+el.spent_time - 1, el)}>dec</button></td>
                        <td><button onClick={() => this.onCopyReport(el)}>copy</button></td>
                    </tr>)
            });
            report = (
                <Aux>
                    <div >
                    {listReportsMonth.map((el,i) => {
                        return (<span key={i}>
                            {el}
                        </span>)
                    })}
                    <UnfoldedCalendar />
                    <table className="tableReports">
                        <tbody>
                            <tr>
                            <td>/ <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                dateFormat="yyyy-MM-dd"/>
                                
                            </td>
                            <td>/ <input  value={this.state.description} onChange={(e) => this.onChangeHandler('description', e, 'new')}/>  </td>
                            <td>/ <input type="text" name="spentTime" placeholder='введите значение' onChange={(e) => this.onChangeHandler('spent_time', e, 'new')} value={this.state.spent_time} />  </td>
                            <td> /<button onClick={() => this.props.onHourAdded(+this.state.spent_time, {
                                date: this.state.startDate,
                                description: this.state.description,
                                project_id: 79,
                                spent_time: this.state.spent_time,
                                task: null,
                                tracker_type: 4,
                            })}> save* </button></td>
                   
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
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {report}
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
            
            return dispatch(actions.editTracker(tracker, i))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));