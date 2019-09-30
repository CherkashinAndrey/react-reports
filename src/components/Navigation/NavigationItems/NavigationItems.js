import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = ( props ) => (
    <ul className={classes.NavigationItems}>
        {/*<NavigationItem link="/" exact>Reports</NavigationItem>*/}
        {/*{props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null}*/}
        {!props.isAuthenticated
            ? <NavigationItem link="/auth">Authenticate</NavigationItem>
          : <div className={classes.NavigationItems}><NavigationItem link="/" exact>Reports</NavigationItem><NavigationItem link="/logout">Logout</NavigationItem></div>}
    </ul>
);

export default navigationItems;
