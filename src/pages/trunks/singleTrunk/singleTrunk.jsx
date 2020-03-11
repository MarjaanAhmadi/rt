import React, {useState} from 'react';
import currency from "../../../filtering/currency";
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import DefaultModal from "../../../components/modals/defaultModal";
import EditTrunk from "../../trunks/editTrunk/editTrunk";
import InvoiceInterim from "../../invoices/invoiceInterim/invoiceInterim";
import axiosInstance from "../../../config/axios";
import {useDispatch} from "react-redux";
library.add(
    faEdit
);
const SingleTrunk = (props) => {

    const [interim, setInterim] = useState({ item: {} });

    const [showModal, setShowModal] = useState(false);
    const [showInterimModal, setShowInterimModal] = useState(false);



    //request for getting new interim invoice
    const requestForInterim = async () => {

        // dispatch({ loading: true, type: "SHOW_LOADING" });

        try {
            const response = await axiosInstance.post("/bill/api/bill/",{subscription_code: props.trunk.subscription_code});
            //add body
            setInterim({
                ...interim,
                item: response.data.data
            });
            setShowInterimModal(true)
        } catch (e) {
            console.log(e)
        }
        // dispatch({ loading: false, type: "SHOW_LOADING" });
    };
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.trunk.main_number}
                </td>
                {/*<td className="table-td">*/}
                {/*    {i18next.t(props.trunk.callEvent)}*/}
                {/*</td >*/}
                <td className="table-td">
                    {props.trunk.destination_number === null ? '_' : props.trunk.destination_number}
                </td>
                <td className="table-td">
                    {currency(props.trunk.used_balance)} {i18next.t('rial')}

                </td>
                <td className="table-td">
                    {currency(props.trunk.base_balance)} {i18next.t('rial')}

                </td>
                <td className="table-td">
                    {currency(props.trunk.current_balance)} {i18next.t('rial')}

                </td>
                <td>
                    <DefaultModal
                        viewComponent={
                            <span
                                onClick={requestForInterim}
                                className="btn-custom pointer inertim-btn"
                            >
                {i18next.t('requestForInterim')}
              </span>
                        }
                        open={showInterimModal}
                        header="قبض میاندوره"
                        size={"lg"}
                        content={
                            <React.Fragment>
                                <InvoiceInterim closeModal={() =>{setShowInterimModal(false)}} interim={interim.item} />

                            </React.Fragment>
                        }
                    ></DefaultModal>
                </td>
                <td className="table-td">
                        <DefaultModal
                            viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}
                            content={
                                <React.Fragment>
                                    <EditTrunk trunk={props.trunk} closeModal={() => setShowModal(false)}/>
                                    <span onClick={()=>setShowModal(false)} className='btn-custom pointer ml-2'>{i18next.t('exit')}</span>
                                </React.Fragment>
                            }
                            size={'lg'}
                            open={showModal}
                            header={i18next.t('edit')}
                        ></DefaultModal>
                </td>
            </tr>
        </React.Fragment>
    );
}
export default SingleTrunk;
