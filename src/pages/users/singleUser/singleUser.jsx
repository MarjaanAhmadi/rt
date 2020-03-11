import React,{useState} from 'react';
import {Link} from "react-router-dom";
import i18next from "i18next";
import EditUser from "../editUser/editUser";
import DefaultModal from "../../../components/modals/defaultModal";
import ConfrimComponent from "../../../mainComponents/confirmComponent/confirmComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit,faTrash} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../../config/axios";
library.add(
    faEdit,
    faTrash
);
toast.configure({
    position: "bottom-center"
})
const SingleUser = (props) => {

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const deleteUser = async () => {
        try {
            await axiosInstance.delete(`/users/api/user/${props.user.id}`);
            setShowDeleteModal(false)
            props.updateUserList();
        }
        catch(e) {
            console.log(e);
            // toast.error(i18next.t('Rejected'))

        }
    };


    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.user.username}
                </td>
                <td className="table-td">
                    {props.user.first_name}
                </td >
                <td className="table-td">
                    {props.user.last_name}
                </td>
                <td className="table-td">
                    {props.user.mobile_number}
                </td>
                <td className="table-td">
                    {!props.user.is_active ? 'غیرفعال' : 'فعال'}

                </td>
                <td className="table-td">

                </td>
                <td className="table-td">
                    <DefaultModal
                        viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}
                        content={
                            <React.Fragment>
                                <EditUser user={props.user} closeModal={() => setShowModal(false)}/>
                                <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{i18next.t('exit')}</span>
                            </React.Fragment>
                        }
                        size='lg'
                        header={i18next.t('edit')}
                        open={showModal}
                    ></DefaultModal>
                </td>
                {/*<td className="table-td">*/}
                {/*    <DefaultModal*/}
                {/*        viewComponent={<Link><FontAwesomeIcon onClick={()=> setShowDeleteModal(true)} className="active-icon" icon="trash"/></Link>}*/}
                {/*        content={<ConfrimComponent delete={deleteUser} closeModal={()=>{setShowDeleteModal(false)}}/>}*/}
                {/*        size='sm'*/}
                {/*        open={showDeleteModal}*/}
                {/*        header={i18next.t('delete')}*/}
                {/*    ></DefaultModal>*/}
                {/*</td>*/}
            </tr>
        </React.Fragment>
    );
}
export default SingleUser;
