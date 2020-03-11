import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Table, Form, InputGroup} from "react-bootstrap";
import SingleExtension from "./singleExtension/singleExtension";
import {withTranslation} from "react-i18next";
import DefaultModal from "../../components/modals/defaultModal";
import ExtensionActions from "./extensionActions/extensionActions";
import Pagination from "../../mainComponents/pagination/pagination";
import users from "../users/users";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";
const Extensions = ({t}) => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const extensions = useSelector(state => state.extensions);
    const [showModal, setShowModal] = useState(false);
    const [params, setParams] = useState({
        limit: 25,
        offset: 0
    });
    const [extension, setExtension] = useState({t: ''})
    const [count, setCount] = useState(0)


    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };
    const changePage = async ({...childData}) => {
        const currentOffset = childData.selected * 20;
        setParams({
            ...params,
            offset: currentOffset
        });
    };

    const keyPress = async (e) => {
        if(e.keyCode === 13) await filterExtensions();
    };
    const filterExtensions = async () => {
        dispatch({
            loading: true,
            type: 'SHOW_LOADING'
        });
        const response = await axiosInstance.get('/extension/api/',{
            params:extension
        });
        setCount(response.data.count);
        dispatch({extensions: response.data.data, type:'SET_EXTENSIONS'});
        dispatch({
            loading: false,
            type: 'SHOW_LOADING'
        });
    };

    //request for getting extensions from server
    const getExtensions = async () => {

        dispatch({
            loading: true,
            type: 'SHOW_LOADING'
        });
        const response = await axiosInstance.get('/extension/api/',{
            params:params
        });
        setCount(response.data.count);
        dispatch({extensions: response.data.data, type:'SET_EXTENSIONS'});
        dispatch({
            loading: false,
            type: 'SHOW_LOADING'
        });
    };


    useEffect(() => {
        setHeader();
        getExtensions();
    },[]);
    useEffect(() => {
        getExtensions();
    }, [params])

    const renderExtensions = ()=> {
        return(
            extensions.length > 0 ?
                extensions.map((extension, index) => {
                    return <SingleExtension updatePhoneList={getExtensions} extension={extension} key={index}/>
                })
                : <NoRowFounded/>
        )
    };
    return(
        <React.Fragment >
            <div className='p-5'>
                <span className="main-title">{t('Extensions')}</span>

                <div className='header-item'>
                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={filterExtensions}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onKeyDown={keyPress}
                                    type="text"
                                    placeholder="سرشماره خود را وارد نمایید"
                                    value={extension.t}
                                    onChange={(event) => {
                                        setExtension({
                                            ...extension,
                                            t: event.target.value
                                        })
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>
                    </div>

                    <DefaultModal
                        viewComponent={<span className='btn-custom pointer' onClick={()=>setShowModal(true)}>{t('createExtension')}</span>}
                        content={
                            <React.Fragment>
                                <ExtensionActions edit={false} created={()=>setShowModal(false)} updateExtensionList={getExtensions}/>
                                <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{t('exit')}</span>
                            </React.Fragment>
                        }
                        open={showModal}
                        size={'lg'}
                        header={t('create')}
                    ></DefaultModal>
                </div>

                <div className="p-5">

                    <Table responsive className="table-borderless table-hover table-sep p-2">
                        <thead className="header-font text-secondary">
                        <tr>
                            <th >
                            </th>
                            <th>
                                {t("Extension")}
                            </th>
                            <th>
                                {t("Username")}
                            </th>
                            <th >
                                Caller ID
                            </th>
                            <th>
                                {t("ringingTime‌")}
                            </th>
                            <th>
                                {t("Status")}
                            </th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="table-body-font text-secondary">
                        {renderExtensions()}
                        </tbody>
                    </Table>
                    <Pagination onChangePage={changePage} count={Math.ceil(count / 25)}/>
                </div>
            </div>

        </React.Fragment>
    )
}
export default withTranslation()(Extensions);
