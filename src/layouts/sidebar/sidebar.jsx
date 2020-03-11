import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import routes from "../../config/routes";
import {withTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import './sidebar.css';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faFile,
    faCreditCard,
    faSearch,
    faDownload,
    faList
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faFile,
    faCreditCard,
    faSearch,
    faDownload,
    faList
)


const Sidebar = ({t}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const showNav = useSelector(state => state.showNav)
    const renderRoutes = () => {
        return(
            routes.map((route) => {
                if(route.meta.child === false)
                return(
                    <React.Fragment key={route.path}>
                        <Link to={route.path}>
                                    <span className={`icon-color ${history.location.pathname === route.path ? 'active-icon' : ''}`}>
                                        {
                                            showNav ?
                                                   <span>{t(route.name)}</span>
                                                : ''
                                        }
                                    </span>
                        </Link>
                        <hr/>
                    </React.Fragment>
                )
            })
        )
    };
    return(
        <div id="mySidebar" className={`sidebar shadow bg-white rounded ${showNav ? 'show-width' : ''}`}>
            <span className="openbtn pointer" onClick={() => {dispatch({showNav,type: "SET_SHOWNAV"})}}>
                <FontAwesomeIcon className="toggle-icon" icon="list"/>
            </span>
            <hr/>
            {renderRoutes()}
        </div>
    )
};
export default withTranslation()(Sidebar);
