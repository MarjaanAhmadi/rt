import React, {useEffect, useState} from 'react';
import i18next from "i18next";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import moment from "jalali-moment";
import {useSelector} from "react-redux";
library.add(
    faEdit
);
const SingleProfit = (props) => {
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.profit.operator_code}
                </td >
                <td className="table-td">
                      {Math.floor(props.profit.outbound_cost_first_part)} {i18next.t('rial')}
                </td >
                <td className="table-td">
                     {Math.floor(props.profit.outbound_cost_second_part)} {i18next.t('rial')}
                </td>
                <td className="table-td">
                     {Math.floor(props.profit.inbound_cost_first_part)} {i18next.t('rial')}
                </td>
                <td className="table-td">
                    {Math.floor(props.profit.inbound_cost_second_part)} {i18next.t('rial')}
                </td>
                <td className="table-td">
                    {Math.floor(props.profit.used_percent)}%
                </td>
                <td className="table-td">
                    {moment.unix(props.profit.from_date).format("jYYYY/jMM/jDD")}
                </td>
                <td className="table-td">
                    {moment.unix(props.profit.to_date).format("jYYYY/jMM/jDD")}
                </td>
                <td className="table-td">
                    {moment.unix(props.profit.created_at).format("jYYYY/jMM/jDD")}
                </td>
                <td className="table-td">
                    {moment.unix(props.profit.updated_at).format("jYYYY/jMM/jDD")}
                </td>
            </tr>
        </React.Fragment>
    );
}
export default SingleProfit;
