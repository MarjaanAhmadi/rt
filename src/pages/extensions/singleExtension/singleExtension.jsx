import React, {useState} from 'react';
import i18next from "i18next";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import DefaultModal from "../../../components/modals/defaultModal";
import ExtensionActions from "../extensionActions/extensionActions";
import ConfrimComponent from "../../../mainComponents/confirmComponent/confirmComponent";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import Modal from "react-modal";
import {Col, Form, Row} from "react-bootstrap";
library.add(
    faEdit
);
const SingleExtension = (props) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [forwardTo, setForwardTo] = useState({
        show: false,
        number: ''
    })
    const params = useState({
        limit: 25,
        offset: 0
    });
    const [status, setStatus] = useState('');

    const statuses = useState({
        list: [
            {id: 0, name: 'available', label: "فعال"},
            {id: 1, name: 'disable', label: "غیر فعال"},
            {id: 2, name: 'transfer', label: "انتقال"}
        ]
    });

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "iransans",
            textAlign: "right",
            direction: 'rtl'
        }
    };

    const deletePhone = async () => {
        try {
            await axiosInstance.delete(`/extension/api/${props.extension.id}/`);
            setShowDeleteModal(false);
            toast.success(i18next.t('Deleted'));
            props.updatePhoneList();
        }
        catch(e) {
            console.log(e);
            // toast.error(i18next.t('Rejected'))

        }
    };

    const statusUpdates = async (status) => {

        try {
            const data = {
                id : props.extension.id,
                status: status,
                forward_to: forwardTo.number
            };
            await axiosInstance.put(`/extension/api/${props.extension.id}/status/`,data);
            if (status !== 'forward')
            {
                props.extension.enabled ?
                    await axiosInstance.delete(`/extension/api/extension/${props.extension.id}/enable/`)
                    :
                    await axiosInstance.put(`/extension/api/extension/${props.extension.id}/enable/`);

            }
            getExtensions();
            closeModal();
            toast.success(i18next.t('Edited'));

        }
        catch(e){
            console.log(e)
        }
    }

    const checkForward = async () => {
        if(forwardTo.number !== '') await statusUpdates('forward')
    }
    const changeStatusAndLabel = async (e) => {
        setForwardTo({
            ...forwardTo,
            show: false
        })

        let status = '';
        switch(e.target.value){
            case '0':
                status = 'available';
                await statusUpdates(status);
                break;
            case '1':
                status = 'disable';
                await statusUpdates(status);
                break;
            case '2':

                setForwardTo({
                    ...forwardTo,
                    show: true
                })
                break;
            default: return status;
        }

    };
    const changeEnableStatus = async (e) => {

        await changeStatusAndLabel(e);
    };
    const closeModal = () => {
        setStatusModal(false)
    }
    //request for getting extensions from server
    const getExtensions = async () => {

        dispatch({
            loading: true,
            type: 'SHOW_LOADING'
        });
        const response = await axiosInstance.get('/extension/api/',{
            params:params
        });
        dispatch({extensions: response.data.data, type:'SET_EXTENSIONS'});
        dispatch({
            loading: false,
            type: 'SHOW_LOADING'
        });
    };
    return(
        <React.Fragment>
            <Modal
                isOpen={statusModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h5>تغییر وضعیت</h5>
                <hr />
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('Status')}</Form.Label>
                        <Form.Control
                            as='select'
                            value={status}
                            onChange={(event) => {

                                setStatus(event.target.value)
                                changeEnableStatus(event)
                            }
                            }
                        >
                            {
                                statuses[0].list.map((item, index) => {
                                    return(
                                        <option key={index} value={item.id}>
                                            {item.label}
                                        </option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Form.Group>
                    {
                        forwardTo.show ?
                            <Form.Group as={Col}>
                                <Form.Label>شماره داخلی</Form.Label>
                                <Form.Control
                                    value={forwardTo.number}
                                    onChange={(event) => {
                                        setForwardTo({
                                            ...forwardTo,
                                            number: event.target.value
                                        })
                                        }
                                    }
                                >
                                </Form.Control>
                                <button
                                    type="submit"
                                    className="btn-custom"
                                    onClick={checkForward}
                                >
                                    {i18next.t("edit")}
                                </button>
                            </Form.Group>

                            : null
                    }


                </Row>
            </Modal>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.extension.extension_number}
                </td>
                <td className="table-td">
                    {props.extension.user.full_name}
                </td >
                <td className="table-td">
                    {props.extension.callerid}
                </td>
                <td className="table-td">
                    {props.extension.ring_seconds}
                </td>
                <td className="table-td"
                    onClick={() => {

                        setStatusModal(true)
                    }}
                >
                    {props.extension.status === 'available' ? <span className='text-success'>{i18next.t('active')}</span> : props.extension.status === 'disable' ? <span className='text-danger'>{i18next.t('deActive')}</span> : <span className='text-warning'>انتقال به {props.extension.forward_to}</span>}
                </td>

                <td className="table-td">
                        <DefaultModal
                            viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}
                            content={
                                <React.Fragment>
                                    <ExtensionActions closeModal={closeModal} statusModal={statusModal} edit={true} extension={props.extension} closeModal={() => setShowModal(false)} />
                                    <span onClick={()=>setShowModal(false)} className='btn-custom pointer ml-2'>{i18next.t('exit')}</span>
                                </React.Fragment>
                            }
                            size={'lg'}
                            open={showModal}
                            header={i18next.t('edit')}
                        ></DefaultModal>
                </td>
                {/*<td className="table-td">*/}
                {/*    <DefaultModal*/}
                {/*        viewComponent={<Link><FontAwesomeIcon onClick={()=> setShowDeleteModal(true)} className="active-icon" icon="trash"/></Link>}*/}
                {/*        content={<ConfrimComponent delete={deletePhone} closeModal={()=>{setShowDeleteModal(false)}}/>}*/}
                {/*        size='sm'*/}
                {/*        open={showDeleteModal}*/}
                {/*        header={i18next.t('delete')}*/}
                {/*    ></DefaultModal>*/}
                {/*</td>*/}
            </tr>
        </React.Fragment>
    );
}
export default SingleExtension;
