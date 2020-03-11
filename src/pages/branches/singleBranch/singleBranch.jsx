import React, {useState} from 'react';
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useHistory} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import DefaultModal from "../../../components/modals/defaultModal";
import BranchActions from '../branchActions/branchActions';
import ConfrimComponent from "../../../mainComponents/confirmComponent/confirmComponent";
import axiosInstance from "../../../config/axios";
import moment from "jalali-moment";
library.add(
    faEdit
);
const SingleBranch = (props) => {
    const history = useHistory();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const deleteBranch = async () => {
        try {
            await axiosInstance.delete(`/cgrates/v1/api/branches/${props.branch.id}/`);
            props.getBranches();
            setShowDeleteModal(false);
        }
        catch(e) {
            console.log(e);
        }
    };
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.branch.branch_code}
                </td>
                <td className="table-td">
                      {props.branch.branch_name}
                </td >
                <td className="table-td">
                     {moment.unix(props.branch.created_at).format("jYYYY/jMM/jDD")}
                </td>
                <td className="table-td">
                    {moment.unix(props.branch.updated_at).format("jYYYY/jMM/jDD")}
                </td>

                <td className="table-td">
                        <DefaultModal
                            viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}
                            content={
                                <React.Fragment>
                                    <BranchActions getBranches={() => {props.getBranches()}} edit={true} branch={props.branch} closeModal={() => setShowModal(false)}/>
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
                        content={<ConfrimComponent delete={deleteBranch} closeModal={()=>{setShowDeleteModal(false)}}/>}
                        size='sm'
                        open={showDeleteModal}
                        header={i18next.t('delete')}
                    ></DefaultModal>
                </td>
                <td className="table-td">
                    <FontAwesomeIcon className="active-icon"
                                     icon="eye"
                                     onClick={() => {history.push(`/Branch/${props.branch.id}`)}}
                    />
                </td>
            </tr>
        </React.Fragment>
    );
}
export default SingleBranch;
