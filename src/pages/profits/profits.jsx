import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Table, Form, InputGroup} from "react-bootstrap";
import SingleProfit from "./singleprofit/singleProfit";
import {withTranslation} from "react-i18next";
import DefaultModal from "../../components/modals/defaultModal";
import ProfitActions from "./profitActions/profitActions";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";
import Pagination from "../../mainComponents/pagination/pagination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Profits = ({t}) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const [profits, setProfits] = useState({list: []});
    const [showModal, setShowModal] = useState(false);
    const [params, setParams] = useState({
        limit: 10,
        offset: 0
    });

    const [operatorCode , setOperatorCode] = useState('');

    const [count, setCount] = useState(0);
    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };

    const getProfits = async  () => {
        try {
            let data = {
                limit: params.limit,
                offset: params.offset
            };
            if(operatorCode !== ''){
                data['operator_code'] = operatorCode;
            }
            const response = await axiosInstance.get('/cgrates/v1/api/profits', {params: data});
            setCount(response.data.count);
            setProfits(response.data.data);
        }
        catch (e) {
            console.log(e);
        }
    };

    const updateOperators = async () => {
        try {
            const response = await axiosInstance.get('/cgrates/v1/api/operators/');
            dispatch({operators: response.data.data, type:'SET_OPERATORS'});
        }
        catch(e){
            console.log(e)
        }
    };

    const updateProfits = async () => {
        await getProfits();
        await updateOperators();
    };
    //change page
    const getProfitsByPageNumber = async ({ ...childData }) => {
        const currentOffset = childData.selected * 10;
        setParams({
            ...params,
            offset: currentOffset
        });
    };


    const renderProfits = ()=> {

        return(
            profits.length > 0 ?
                profits.map((profit, index) => {
                    return <SingleProfit  updateProfits={getProfits}  profit={profit} key={index}/>
                })
                : <NoRowFounded/>
        )
    };

    const keyPress = async (e) => {
        if(e.keyCode === 13) await getProfits();
    };

    useEffect(() => {
        setHeader();
    },[]);

    useEffect(() => {
        getProfits()
    },[params])
    return (
        <React.Fragment>

            <div className='p-5'>
                <span className="main-title">{t('profits')}</span>
                <div className="row filter-section">
                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={getProfits}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onKeyDown={keyPress}
                                    type="text"
                                    placeholder="کد اپراتور خود را وارد نمایید"
                                    value={operatorCode}
                                    onChange={(event) => {
                                        setOperatorCode(event.target.value)
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        <DefaultModal
                            viewComponent={<span className='btn-custom pointer'
                                                 onClick={() => setShowModal(true)}>{t('createProfit')}</span>}
                            content={
                                <React.Fragment>
                                    <ProfitActions edit={false} created={() => setShowModal(false)}
                                                   updateProfits={updateProfits}/>
                                    <span className='btn-custom pointer ml-2'
                                          onClick={() => setShowModal(false)}>{t('exit')}</span>
                                </React.Fragment>
                            }
                            open={showModal}
                            size={'lg'}
                            header={t('create')}
                        ></DefaultModal>
                    </div>
                </div>

            </div>

            <div className="">

                <Table responsive className="table-borderless table-hover table-sep p-2">
                    <thead className="header-font text-secondary">
                    <tr>
                        <th>
                        </th>
                        <th>
                            {t("operator_code")}
                        </th>
                        <th>
                            {t("outbound_cost_first_part")}
                        </th>
                        <th>
                            {t("outbound_cost_second_part")}
                        </th>
                        <th>
                            {t("inbound_cost_first_part")}
                        </th>
                        <th>
                            {t("inbound_cost_second_part")}
                        </th>
                        <th>
                            {t("used_percent")}
                        </th>
                        <th>
                            {t("from_date")}
                        </th>
                        <th>
                            {t("to_date")}
                        </th>
                        <th>
                            {t("created_at")}
                        </th>
                        <th>
                            {t("updated_at")}
                        </th>

                        <th></th>
                    </tr>
                    </thead>
                    <tbody className="table-body-font text-secondary">
                    {renderProfits()}
                    </tbody>
                </Table>
                <Pagination
                    onChangePage={getProfitsByPageNumber}
                    count={Math.ceil(count / 10)}
                />
            </div>

        </React.Fragment>
    );
}
export default withTranslation()(Profits);
