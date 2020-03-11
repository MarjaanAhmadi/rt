import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Table} from "react-bootstrap";
import SingleCdr from "./singleCdr/singleCdr";
import {withTranslation} from "react-i18next";
import AdvancedSearch from "./advancedSearch/advancedSearch";
import Pagination from "../../mainComponents/pagination/pagination";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";


const Cdrs = ({t}) => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const cdrs = useSelector(state => state.cdrs);

    const [params, setParams] = useState({
        limit: 25,
        offset: 0
    });
    const [count, setCount] = useState(0)

    const changePage = ({...childData}) => {
        const currentOffset = childData.selected * 20;
        setParams({
            ...params,
            offset: currentOffset
        });
    };
    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };
    //request for getting endpoints from server
    const getCdrs = async () => {
        dispatch({
            loading: true,
            type: 'SHOW_LOADING'
        });
        const response = await axiosInstance.get('/cdr/api/',{params: params});
        setCount(response.data.count);
        dispatch({cdrs: response.data.data, type:'SET_CDRS'});
        dispatch({
            loading: false,
            type: 'SHOW_LOADING'
        });
    };
    //change page
    // const getInvoicesByPageNumber = async ({...childData}) => {
    //     const currentOffset = ((childData.selected)*5)
    //     setParams({
    //         ...params,
    //         offset: currentOffset
    //     })
    // };


    useEffect(() => {
        setHeader();
        getCdrs();
    },[]);
    useEffect(() => {
        getCdrs();
    }, [params])

    const renderCrds = ()=> {
        return(
            cdrs.length > 0 ?
                cdrs.map((cdr, index) => {
                    return <SingleCdr updatePhoneList={getCdrs} cdr={cdr} key={index}/>
                })
                : <NoRowFounded/>
        )
    };
    return(
        <React.Fragment >
           <div className='p-5'>
               <span className="main-title">{t('CDRs')}</span>
               <div className='header-item'>
                   <AdvancedSearch/>
                   {/*<DefaultModal*/}
                   {/*    viewComponent={<span className='btn-custom pointer' onClick={()=>setShowModal(true)}>{t('create')}</span>}*/}
                   {/*    content={*/}
                   {/*        <React.Fragment>*/}
                   {/*            <PhoneActions edit={false} created={()=>setShowModal(false)}/>*/}
                   {/*            <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{t('exit')}</span>*/}
                   {/*        </React.Fragment>*/}
                   {/*    }*/}
                   {/*    open={showModal}*/}
                   {/*    size={'sm'}*/}
                   {/*    header={t('create')}*/}
                   {/*></DefaultModal>*/}
               </div>

               <div className="p-5">

                   <Table responsive className="table-borderless table-hover table-sep p-2">
                       <thead className="header-font text-secondary">
                       <tr>
                           <th >
                           </th>
                           <th>
                               {t("start")}
                           </th>
                           <th>
                               {t("destination")}
                           </th>
                           <th>
                               {t("duration")}
                           </th>
                           <th >
                               {t("total_time")}
                           </th>
                           <th >
                               {t("reason")}
                           </th>
                           <th >
                               {t("created_at")}
                           </th>
                           <th >
                               {t("hour")}
                           </th>
                           <th ></th>
                       </tr>
                       </thead>
                       <tbody className="table-body-font text-secondary">
                       {renderCrds()}
                       </tbody>
                   </Table>
                   <Pagination onChangePage={changePage} count={Math.ceil(count/25)}/>
               </div>

           </div>
        </React.Fragment>
    )
}
export default withTranslation()(Cdrs);
