import React from 'react';
import {withTranslation} from "react-i18next";
import './noRowList.css';

const NoRowFounded = ({t}) => {
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <span className='p-3 norow-txt'>
                    {t('noDataFounded')}
                </span>
            </tr>
        </React.Fragment>
    )
}
export default withTranslation()(NoRowFounded);
