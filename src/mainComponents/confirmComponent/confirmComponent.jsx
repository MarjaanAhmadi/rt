import React from 'react';
import i18next from "i18next";
const ConfrimComponent = (props) => {
    return(
        <React.Fragment >
            <h6>{i18next.t("Are you sure?")}</h6>
            <span onClick={props.delete} className='btn-custom mr-2 pointer'>{i18next.t("yes")}</span>
            <span onClick={props.closeModal} className='btn-custom pointer'>{i18next.t("no")}</span>

        </React.Fragment>
    )
}
export default ConfrimComponent;
