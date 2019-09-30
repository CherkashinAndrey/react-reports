import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import { SelectProject, SelectTrackers } from '../../helpers/selectProject';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';
import DatePicker from 'react-datepicker';
import UnfoldedCalendar from '../../components/UnfoldedCalendar/unfoldedCalendar';
import * as moment from 'moment';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import './reports.scss';

class BurgerBuilder extends Component {

  state = {
    purchasing: false,
    startDate: new Date(),
    spent_time: '',
    description: '',
    editTracker: {
      startDate: new Date(),
      spent_time: '',
      description: ''
    },
    selectedTracker: null,
    selectedProject: null
  }

  componentDidMount() {
    this.onHandlerOnInitReports();
    // setTimeout(() => {
    //     this.props.initFormFields();
    // },0);
  }

  onHandlerOnInitReports() {
    const listReportsMonth = `from=${moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DD')}&to=${moment().endOf('month').subtract(1, 'month').format('YYYY-MM-DD')}`;
    setTimeout(() => {
      const pathLocal = window.location.pathname.replace('/', '');
      console.log('2', pathLocal);
      if (pathLocal.length && pathLocal === 'arhive') {
        this.props.onInitIngredients(listReportsMonth);
      } else {
        this.props.onInitIngredients('');
      }
    }, 0)

  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
    console.log('******************************');
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  handleChange = startDate => this.setState({startDate})

  onChangeHandler = (term, e, edit) => {
    edit !== 'new' ? this.setState(
      {editTracker: {...this.state.editTracker, [term]: e.target.value}}
    ) : this.setState({[term]: e.target.value})
  }

  onChangeHadlerState = (item, i) => {
    this.setState({
      editTracker: {
        startDate: new Date(item.date),
        spent_time: item.spent_time,
        description: item.description
      },
      selectedProject: new SelectProject(this.props.listForSelect.userProjects.find(el => el.id === item.project_id), 0),
      selectedTracker: new SelectTrackers(this.props.listForSelect.trackers.find(el => el.id === item.tracker_type), 0)
    })
    console.log('-----------------', item, this.state, this.props.listForSelect);
    this.props.onEditTracker(item, i)
  }

  onCopyReport = (el) => {
    this.setState({
      startDate: new Date(),
      spent_time: el.spent_time,
      description: el.description
    })
  }

  setValues = (term, value) => {
    console.log(value);
    switch (term) {
      case 'trackers':
        this.setState({selectedTracker: new SelectTrackers(value, 0)})
        break;
      case 'project':
        this.setState({selectedProject: new SelectProject(value, 0)})
        break;
      default:
        break;
    }
  }

  onHandlerEdit = (el) => {
    el.project_id = this.state.selectedProject.id;
    el.tracker_type = this.state.selectedTracker.id;
    this.props.onHourAdded(this.state.editTracker, el)
  }

  render() {
    const disabledInfo = {
      ...this.props.ings
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
    // let monthReports = [];
    let report = this.props.error ? <p>Ingredients can't be loaded!!</p> : <Spinner/>;
    const listReportsMonth = [];
    for (let i = 0; i <= 1; i++) {
      if (i === 0) {
        listReportsMonth.push({month: moment().startOf('month').subtract(i, 'month').format('MMMM') + ` (MONTHLY REPORT)`, path: '/reports'});
      }
      if (i === 1) {
        listReportsMonth.push({
          month: moment().startOf('month').subtract(i, 'month').format('MMMM') + ` (MONTHLY REPORT)`,
          path: '/arhive'
        });
      }
    }
    // console.log('this.props',this.props.listForSelect.trackers);

    let optionsSelectProjects = [];
    let optionsSelectTrackers = [];

    if (this.props.listForSelect && this.props.listForSelect.userProjects) {
      optionsSelectProjects = this.props.listForSelect.userProjects.map((el, i) => {
        return new SelectProject(el, i); //{...el, label : el.name, value : el.name, key : i }
      })
    }

    if (this.props.listForSelect && this.props.listForSelect.trackers) {
      optionsSelectTrackers = this.props.listForSelect.trackers.map((el, i) => {
        return new SelectTrackers(el, i);
      })
    }

    if (this.props.reports) {
      const reports = this.props.reports.map((el, i) => {
        return (this.props.editReportIndex === i ?
          <tr key={i}>
            <td><DatePicker
              selected={this.state.editTracker.startDate}
              onChange={this.handleChange}
              dateFormat="yyyy-MM-dd"
            /></td>
            <td>
              <Select
                options={optionsSelectTrackers}
                onChange={(values) => this.setValues('trackers', values)}
                value={this.state.selectedTracker}
              />
            </td>
            <td>
              <Select
                options={optionsSelectProjects}
                onChange={(values) => this.setValues('project', values)}
                value={this.state.selectedProject}
              />
              {/* selectedValue={this.state.selectedProject} */}
              {/* <input  value={this.state.editTracker.description}
                                        onChange={(e) => this.onChangeHandler('description', e, 'editTracker')} />   */}
            </td>

            <td>
              <input type="text"
                     className="input"
                     name="spentTime"
                     placeholder='введите значение'
                     onChange={(e) => this.onChangeHandler('spent_time', e, 'editTracker')}
                     value={this.state.editTracker.spent_time}/>
            </td>
            <td>
              <button onClick={() => this.onHandlerEdit(el)}>save</button>
            </td>
            <td>
              <button onClick={() => this.props.onEditTracker(el, null)}>close</button>
            </td>
          </tr>
          : <tr key={i}>
            <td>{el.date}*</td>
            <td>{el.description}</td>
            <td>{el.spent_time}</td>
            <td>
              <button onClick={() => this.onChangeHadlerState(el, i)}>edit</button>
            </td>
            <td>
              <button onClick={() => this.props.onHourAdded(+el.spent_time + 1, el)}>inc</button>
            </td>
            <td>
              <button onClick={() => this.props.onDicrementHour(+el.spent_time - 1, el)}>dec</button>
            </td>
            <td>
              <button onClick={() => this.onCopyReport(el)}>copy</button>
            </td>
          </tr>)
      });
      report = (
        <Aux>
          <div>
            {listReportsMonth.map((el, i) => {
              return (
                <NavLink
                  key={i}
                  to={el.path}
                  className="nav_link"
                  onClick={this.onHandlerOnInitReports.bind(this)}
                  activeClassName="activeRoute"
                  activeStyle={{color: 'red'}}
                >
                  {el.month}
                </NavLink>
              )
            })}
            <UnfoldedCalendar/>
            <table className="tableReports">
              <tbody>
              <tr>
                <td>/ <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleChange}
                  dateFormat="yyyy-MM-dd"/>

                </td>
                <td>/ <input className="input" value={this.state.description}
                             onChange={(e) => this.onChangeHandler('description', e, 'new')}/></td>
                <td>/ <input className="input" type="text" name="spentTime" placeholder='введите значение'
                             onChange={(e) => this.onChangeHandler('spent_time', e, 'new')}
                             value={this.state.spent_time}/></td>
                <td> /
                  <button onClick={() => this.props.onHourAdded(+this.state.spent_time, {
                    date: this.state.startDate,
                    description: this.state.description,
                    project_id: 79,
                    spent_time: this.state.spent_time,
                    task: null,
                    tracker_type: 4
                  })}> save*
                  </button>
                </td>

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
        purchaseContinued={this.purchaseContinueHandler}/>;
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
    editReportIndex: state.burgerBuilder.editReportIndex,
    listForSelect: state.burgerBuilder.formField
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: (path) => dispatch(actions.initIngredients(path)),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
    onHourAdded: (spentTime, newDate) => dispatch(actions.addHour(spentTime, newDate)),
    onDicrementHour: (spentTime, newDate) => dispatch(actions.dicrementHour(spentTime, newDate)),
    onEditTracker: (tracker, i) => {
      return dispatch(actions.editTracker(tracker, i))
    }
    // initFormFields: () => dispatch(actions.initFormFields()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
