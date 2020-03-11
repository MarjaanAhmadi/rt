import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Table, Form} from "react-bootstrap";
import SinglePhone from "./singlePhone/singlePhone";
import {withTranslation} from "react-i18next";
import DefaultModal from "../../components/modals/defaultModal";
import PhoneActions from "./phoneActions/phoneActions";
import getEndpointsList from "../../mainComponents/getEndpointsList/getEndpointsList";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";

const Phones = ({t}) => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const endpoints = useSelector(state => state.endpoints)
    const [showModal, setShowModal] = useState(false);

    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };

    const updateEndpoints = async () => {
        const endpoints = await getEndpointsList();
        dispatch({endpoints, type: 'SET_ENDPOINTS'});
    }

    useEffect(() => {
        setHeader();
    },[]);

    const renderEndpoints = ()=> {
        return(
            endpoints.length > 0 ?
                endpoints.map((endPoint, index) => {
                    return <SinglePhone updatePhoneList={updateEndpoints} endPoint={endPoint} key={index}/>
                })
                : <NoRowFounded/>
        )
    };
    return(
        <React.Fragment >

            <div className='header-item p-5'>
                <span className="main-title">{t('Phones')}</span>

                <DefaultModal
                    viewComponent={<span className='btn-custom pointer' onClick={()=>setShowModal(true)}>{t('createPhone')}</span>}
                    content={
                        <React.Fragment>
                            <PhoneActions edit={false} created={()=>setShowModal(false)}/>
                            <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{t('exit')}</span>
                        </React.Fragment>
                    }
                    open={showModal}
                    size={'sm'}
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
                            {t("brand")}
                        </th>
                        <th>
                            {t("MAC Address")}
                        </th>
                        <th>
                            {t("Username")}
                        </th>
                        <th >
                            {t("Status")}
                        </th>

                        <th ></th>
                    </tr>
                    </thead>
                    <tbody className="table-body-font text-secondary">
                    {renderEndpoints()}
                    </tbody>
                </Table>
                {/*<Pagination changePageByUrl={handleChangePageByUrl} onChangePage={getInvoicesByPageNumber} count={Math.ceil(count/5)}/>*/}
            </div>

        </React.Fragment>
    )
}
export default withTranslation()(Phones);
