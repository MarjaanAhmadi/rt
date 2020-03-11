import React from 'react';
import Pagination from "../../mainComponents/pagination/pagination";
const Dashboard = () => {

    const renderList = () => {
        console.log('rendered')
    }

    return(
        <React.Fragment>
            <h1>dashboard</h1>
            <Pagination onChangePage={renderList}/>
        </React.Fragment>
    )
}
export default Dashboard;