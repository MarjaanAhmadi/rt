import React, {useState} from 'react';
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import DefaultModal from "../../../components/modals/defaultModal";
import PhoneActions from "../phoneActions/phoneActions";
import ConfrimComponent from "../../../mainComponents/confirmComponent/confirmComponent";
import axiosInstance from "../../../config/axios";
library.add(
    faEdit
);
const SinglePhone = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deletePhone = async () => {

        try {
            await axiosInstance.delete(`/endpoint/api/endpoint/${props.endPoint.id}/`);
            setShowDeleteModal(false);

            props.updatePhoneList();
        }
        catch(e) {
            console.log(e);
            // toast.error(i18next.t('Rejected'))

        }
    }
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.endPoint.brand.name}
                </td>
                <td className="table-td">
                    {props.endPoint.mac_address}
                </td >
                <td className="table-td">
                    {props.endPoint.user.full_name}
                </td>
                <td className="table-td">
                    {props.endPoint.enabled ? <span className='text-success'>{i18next.t('active')}</span> : <span className='text-danger'>{i18next.t('deActive')}</span>}
                </td>

                <td className="table-td">
                        <DefaultModal
                            viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}
                            content={
                                <React.Fragment>
                                    <PhoneActions edit={true} endpoint={props.endPoint} closeModal={() => setShowModal(false)}/>
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
                        content={<ConfrimComponent delete={deletePhone} closeModal={()=>{setShowDeleteModal(false)}}/>}
                        size='sm'
                        open={showDeleteModal}
                        header={i18next.t('delete')}
                    ></DefaultModal>
                </td>
            </tr>
        </React.Fragment>
    );
}
export default SinglePhone;
