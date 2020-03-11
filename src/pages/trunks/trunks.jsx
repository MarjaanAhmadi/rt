import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Form, InputGroup, Table} from "react-bootstrap";
import SingleTrunk from "./singleTrunk/singleTrunk";
import {withTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Pagination from "../../mainComponents/pagination/pagination";
import {number} from "prop-types";

const Trunks = ({t}) => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.token);
    const [trunks, setTrunks] = useState({list: []});
    const [count, setCount] = useState(0);
    const [params, setParams] = useState({
        offset: 0,
        limit: 25,
        main_number: ''
    });
    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    }
    //request for getting trunk numbers from server
    const getTrunks = async () => {
        try {
            const response = await axiosInstance.get('/gateway/api/gateway/', {params: params});
            setTrunks(response.data.data)
            setCount(response.data.count);
        }
        catch (e) {
            console.log(e);
        }
        dispatch({loading: false, type: 'SHOW_LOADING'});
    }

    const renderTrunks = ()=> {
        return(
            trunks.length > 0 ?
            trunks.map((trunk, index) => {
                if(trunk.destination_type_off === 'end'){
                    trunk['callEvent'] = 'end'
                    trunk['callEvent'] = 'connectToInbound'
                }
                return <SingleTrunk trunk={trunk} key={index}/>
            })
                : null
        )
    };
    const keyPress = async (e) => {
        if(e.keyCode === 13) await getTrunks()
    }

    //change page
    const getInvoicesByPageNumber = async ({ ...childData }) => {
        const currentOffset = childData.selected * 5;
        setParams({
            ...params,
            offset: currentOffset
        });
    };

    useEffect(() => {
        dispatch({loading: true, type: 'SHOW_LOADING'});
        setHeader()
    },[])
    useEffect(() => {
        getTrunks()
    },[params.offset])
    return(
        <React.Fragment >
            <div className='p-5'>
                <span className="main-title">{t('Trunk Numbers')}</span>
                <div className="col-md-3">
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text onClick={getTrunks}>
                                    <FontAwesomeIcon icon='search' />

                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                onKeyDown={keyPress}
                                type="text"
                                placeholder="سرشماره خود را وارد نمایید"
                                value={params.main_number}
                                onChange={(event) => {
                                    setParams({
                                        ...params,
                                        main_number: event.target.value
                                    })
                                }}
                            />
                        </InputGroup>
                    </Form.Group>
                </div>

                <div className="">

                    <Table responsive className="table-borderless table-hover table-sep p-2">
                        <thead className="header-font text-secondary">
                        <tr>
                            <th >
                            </th>
                            <th>
                                {t("MainNumber")}
                            </th>
                            {/*<th>*/}
                            {/*    {t("callEvent")}*/}
                            {/*</th>*/}
                            <th>
                                {t("extension")}
                            </th>
                            <th >
                                {t("financialRate")}
                            </th>
                            <th >
                                {t("base_balance")}
                            </th>
                            <th >
                                {t("current_balance")}
                            </th>
                            <th ></th>
                        </tr>
                        </thead>
                        <tbody className="table-body-font text-secondary">
                        {renderTrunks()}
                        </tbody>
                    </Table>

                    <Pagination
                        onChangePage={getInvoicesByPageNumber}
                        count={Math.ceil(count / 25)}
                    />

                </div>
            </div>

        </React.Fragment>
    )
}
export default withTranslation()(Trunks);
