import React from 'react'
import {useSelector, useDispatch} from "react-redux";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import routes from "../config/routes";
import Header from "./header/header";
import Sidebar from "./sidebar/sidebar";
import './defaultLayout.css'
import NotFound from "../pages/notFound404";

const DefaultLayout = () => {
    const showNav = useSelector(state => state.showNav)
    const dispatch = useDispatch()

    const loading = () => {
        console.log('loading')
    }

    return(
        <React.Fragment>
            <Sidebar/>

            <div id="main" className={showNav ? 'main-margin' : 'sub-margin'}>
                <Header />
                <div className='p-4'>
                    <React.Suspense fallback={loading}>

                        <Switch>
                            {
                                routes.map((route, idx) => {
                                    return route.component ? (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (
                                                <route.component {...props} />
                                            )} />
                                    ) : (null);
                                })}
                            <Redirect from="/" to="/users-management" />
                        </Switch>
                    </React.Suspense>
                </div>
            </div>
        </React.Fragment>
    )
}
export default DefaultLayout;
