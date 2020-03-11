import React, {useState} from 'react';
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useHistory} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import DefaultModal from "../../../components/modals/defaultModal";
import OperatorActions from "../operatorActions/operatorActions";
import ConfrimComponent from "../../../mainComponents/confirmComponent/confirmComponent";
import axiosInstance from "../../../config/axios";
library.add(
    faEdit
);
const SingleOperator = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteOperator = async () => {

        try {
            await axiosInstance.delete(`/cgrates/v1/api/operators/${props.operator.id}/`);
            props.getOperators();
            setShowDeleteModal(false);
        }
        catch(e) {
            console.log(e);
        }
    }
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.operator.operator_code}
                </td>
                <td className="table-td">
                      {Math.floor(props.operator.outbound_rate)} {i18next.t('rial')}
                </td >
                <td className="table-td">
                     {Math.floor(props.operator.inbound_rate)} {i18next.t('rial')}
                </td>
                <td className="table-td">
                     {props.operator.divide_on_percent}%
                </td>
                <td className="table-td">
                    {props.operator.rate_time} {i18next.t(props.operator.rate_time_type)}
                </td>
                <td className="table-td">
                        <DefaultModal
                            viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}
                            content={
                                <React.Fragment>
                                    <OperatorActions getOperators={() => {props.getOperators()}} edit={true} operator={props.operator} closeModal={() => setShowModal(false)}/>
                                    <span onClick={()=>setShowModal(false)} className='btn-custom pointer ml-2'>{i18next.t('exit')}</span>
                                </React.Fragment>
                            }
                            size={'lg'}
                            open={showModal}
                            header={i18next.t('edit')}
                        ></DefaultModal>
                </td>
                <td className="table-td">
                    <DefaultModal
                        viewComponent={<Link><FontAwesomeIcon onClick={()=> setShowDeleteModal(true)} className="active-icon" icon="trash"/></Link>}
                        content={<ConfrimComponent delete={deleteOperator} closeModal={()=>{setShowDeleteModal(false)}}/>}
                        size='sm'
                        open={showDeleteModal}
                        header={i18next.t('delete')}
                    ></DefaultModal>
                </td>
                <td className="table-td">
                    <FontAwesomeIcon className="active-icon"
                                     icon="eye"
                                     onClick={() => {history.push(`/operator/${props.operator.id}`)}}
                    />
                </td>
            </tr>
        </React.Fragment>
    );
}
export default SingleOperator;
