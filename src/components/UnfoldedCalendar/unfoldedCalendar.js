import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';
import classes from './unfoldedCalendar.css';

class UnfoldedCalendar extends Component {

    state = {
    }

    componentDidMount () {
        this.props.onInitCalendar();
    }

    render () {
        let _calendarSpiner = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        if ( this.props.calendar &&  this.props.calendar.days) {

            const weekDays = this.props.calendar.days.map((el, i) => {
                return ( <th key={i}>  {el.week_day}  </th>);
            });

            const dayMonth = this.props.calendar.days.map((el, i) => {
                return ( <td key={i}>  {el.day}  </td>);
            });

            const trackers = this.props.calendar.trackers.map((el, i) => {

                const calendarDateDays = this.props.calendar.days.map((item, index) => {
                    return ( <td key={index}>  {item.data[el.slug] ? item.data[el.slug]: ''}  </td>);
                });
                return (
                <tr key={i}>  
                    <td> {el.title} </td> 
                    {calendarDateDays} 
                </tr>)
            });

            const total = this.props.calendar.days.map((el, i) => {
                return ( <td key={i}>  {el.data.total} </td>   );
            });
            

            const reports = 
                        <table className={classes.tableCalendar}>
                            <thead>
                                <tr >
                                    <th className={classes.title} ></th>
                                    {weekDays}
                                </tr>
                            </thead>
                            <tbody>
                             <tr className={classes.bold}>
                                <td className={classes.title}>{this.props.calendar.month}</td>
                                {dayMonth}
                             </tr>
       
                             {trackers}                         

                            <tr className="total bold">
                                 <td className="title">Total</td>
                                 {total}
                            </tr> 
                            </tbody>
                </table>
                
                        
           
            _calendarSpiner = (
                <Aux>
                    {reports}
                </Aux>
            );
        }
        // {salad: true, meat: false, ...}
        return (
            <Aux>
                {_calendarSpiner}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        calendar: state.burgerBuilder.calendar,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitCalendar: () => dispatch(actions.onInitCalendar()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( UnfoldedCalendar, axios ));