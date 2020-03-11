import React, {useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Form, InputGroup, Table} from "react-bootstrap";
import SingleUser from "./singleUser/singleUser";
import {withTranslation} from "react-i18next";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";
import DefaultModal from "../../components/modals/defaultModal";
import CreateUser from "./createUser/createUser";
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Pagination from "../../mainComponents/pagination/pagination";


const Users = ({t}) => {

    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const [count, setCount] = useState(0);
    const [trunkNumber, setTrunkNumber] = useState({
        t: ''
    });
    const [params, setParams] = useState({
        limit: 25,
        offset: 0
    })

    const [showModal, setShowModal] = useState(false);
    const setHeader = () => {
        if (token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}` ;
    };
    const getUsers = async () => {
        dispatch({loading: true, type: 'SHOW_LOADING'});
        try{
            const response = await axiosInstance.get('users/api/user/',{params: params});
            setCount(response.data.count);
            dispatch({users: response.data.data, type: 'SET_USERS'});
        }
        catch(e){
            console.log(e)
        }
        dispatch({loading: false, type: 'SHOW_LOADING'});
    };

    const getUsersByFilter = async () => {
        dispatch({loading: true, type: 'SHOW_LOADING'});
        try{
            const response = await axiosInstance.get('users/api/user/',{params: trunkNumber});
            setCount(response.data.count);
            dispatch({users: response.data.data, type: 'SET_USERS'});
        }
        catch(e){
            console.log(e)
        }
        dispatch({loading: false, type: 'SHOW_LOADING'});
    };

    const updateUsers = async () => {
        const users = await getUsers();
        dispatch({users, type: 'SET_USERS'});
    };
    const keyPress = async (e) => {
        if(e.keyCode === 13) await getUsersByFilter();
    };
    const renderUsers = () => {
        return(
            users.length > 0 ?
               users.map((user, index) => {
                    return <SingleUser updateUserList={updateUsers} user={user} key={index} />
                })
                : <NoRowFounded />
        )
    };
    const changePage = async ({...childData}) => {
        const currentOffset = childData.selected * 20;
        setParams({
            ...params,
            offset: currentOffset
        });
    };

    useEffect(()=>{
        setHeader();
    },[]);
    useEffect(()=>{
        getUsers();
    },[params]);

    return (
        <React.Fragment>
            <div className='p-5'>
                <span className="main-title">{t('UsersManagement')}</span>
                <div className='header-item'>
                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={getUsersByFilter}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onKeyDown={keyPress}
                                    type="text"
                                    placeholder="سرشماره خود را وارد نمایید"
                                    value={trunkNumber.t}
                                    onChange={(event) => {
                                        setTrunkNumber({
                                            ...trunkNumber,
                                            t: event.target.value
                                        })
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <DefaultModal
                        viewComponent={<span className='btn-custom pointer' onClick={()=>setShowModal(true)}>{t('createNewUser')}</span>}
                        content={
                            <React.Fragment>
                                <CreateUser created={()=>setShowModal(false)}/>
                                <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{i18next.t('exit')}</span>
                            </React.Fragment>
                        }
                        open={showModal}
                        size={'lg'}
                        header={t('create')}
                    ></DefaultModal>
                </div>
                <div className="">

                    <Table responsive className="table-borderless table-hover table-sep p-2">
                        <thead className="header-font text-secondary">
                        <tr>
                            <th >
                            </th>
                            <th>
                                {t("Username")}
                            </th>
                            <th>
                                {t("name")}
                            </th>
                            <th>
                                {t("lastName")}
                            </th>
                            <th >
                                {t("phoneNumber")}
                            </th>
                            <th >
                                {t("Status")}
                            </th>
                            <th ></th>
                            <th ></th>
                        </tr>
                        </thead>
                        <tbody className="table-body-font text-secondary">
                        {renderUsers()}
                        </tbody>
                    </Table>
                    <Pagination onChangePage={changePage} count={Math.ceil(count / 25)}/>
                </div>
            </div>

        </React.Fragment>
    )
}
export default withTranslation()(Users);
