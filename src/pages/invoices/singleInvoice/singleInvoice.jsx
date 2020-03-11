import React, {useState} from 'react'
import Moment from 'react-moment';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Link} from "react-router-dom"
import './singleInvoice.css'
import i18next from "i18next";
import currency from "../../../filtering/currency";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faEye

} from '@fortawesome/free-solid-svg-icons'
import {useSelector} from "react-redux";
import axiosInstance from "../../../config/axios";
library.add(
    faEye
)



const SingleInvoice = (props) => {
    const getPdf =async () => {
        axiosInstance.defaults.responseType = 'arraybuffer';
        const res = await axiosInstance.get(`bill/api/bill/${props.invoice.id}/export/`);
        const url = window.URL.createObjectURL(new Blob([res.data],{type: 'application/pdf'}));
        const link = document.getElementById('dwnldLnk');
        link.href = url;
        link.setAttribute('download', 'file.pdf');
        document.body.appendChild(link);
        link.click();
    };

    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className='table-td'>
                    {props.invoice.main_number}
                </td>
                <td className="table-td">
                    {props.invoice.id}

                </td>
                <td className="table-td">
                    {props.invoice.tracking_code}

                </td>

                <td className="table-td">
                    {
                        props.invoice.invoice_type_code === 'interim' ? 'میان‌دوره' : 'پایان‌دوره'
                    }
                </td>





                <td className="table-td">
                    <Moment format="YYYY/MM/DD" locale="L">{props.invoice.created_at_jalali}</Moment>

                </td>
                <td className="table-td">
                    {currency(props.invoice.total_cost)} {i18next.t('rial')}

                </td>

                <td className="table-td">
                    <span className={props.state.color}> {props.state.text} </span>

                </td>
                {/*<td className="table-td">*/}
                {/*    {*/}
                {/*        props.invoice.status_code === "ready" && props.invoice.total_cost > 0 ? (*/}
                {/*        <span onClick={showPayInfo} className="btn-custom pointer">*/}
                {/*    {i18next.t('pay')}*/}
                {/*        </span>*/}
                {/*        ) : (*/}
                {/*        ""*/}
                {/*        )}*/}

                {/*</td>*/}
                <td className="table-td">
                    <a
                        onClick={getPdf}
                    >
                        <FontAwesomeIcon className="active-icon" icon="download" />
                    </a>
                    <a id='dwnldLnk'/>
                </td>
                <td className="table-td">
                    <Link to={`/invoice/${props.invoice.id}`}>
                        <FontAwesomeIcon className="active-icon" icon="eye" />
                    </Link>
                </td>
            </tr>
        </React.Fragment>

    )
}
export default SingleInvoice
