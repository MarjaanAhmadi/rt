import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Form, InputGroup, Table} from "react-bootstrap";
import SingleOperator from "./singleOperator/singleOperator";
import {withTranslation} from "react-i18next";
import DefaultModal from "../../components/modals/defaultModal";
import OperatorActions from "./operatorActions/operatorActions";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Operators = ({t}) => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const operators = useSelector(state => state.operators);
    const [showModal, setShowModal] = useState(false);
    const [operatorCode , setOperatorCode] = useState('');


    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };

    const getOperators = async  () => {
        try {
            let data = {};
            if(operatorCode !== ''){
                data['operator_code'] = operatorCode;
            }
            const response = await axiosInstance.get('/cgrates/v1/api/operators/',{params: data});
            dispatch({operators: response.data.data, type: 'SET_OPERATORS'});
        }
        catch (e) {
            console.log(e);
        }
    };


    const renderOperators = ()=> {
        return(
            operators.length > 0 ?
                operators.map((operator, index) => {
                    return <SingleOperator  getOperators={getOperators}  operator={operator} key={index}/>
                })
                : <NoRowFounded/>
        )
    };

    const keyPress = async (e) => {
        if(e.keyCode === 13) await getOperators();
    };


    useEffect(() => {
        setHeader();
        getOperators();
    },[]);
    return(
        <React.Fragment >

            <div className='p-5'>
                <span className="main-title">{t('operators')}</span>
                <div className="row filter-section">
                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={getOperators()}>
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
                    <div className='col-md-3'>
                        <DefaultModal
                            viewComponent={<span className='btn-custom pointer' onClick={()=>setShowModal(true)}>{t('createOperator')}</span>}
                            content={
                                <React.Fragment>
                                    <OperatorActions edit={false} created={()=>setShowModal(false)} getOperators={getOperators}/>
                                    <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{t('exit')}</span>
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
                        <th >
                        </th>
                        <th>
                            {t("operator_code")}
                        </th>
                        <th>
                            {t("outbound_rate")}
                        </th>
                        <th>
                            {t("inbound_rate")}
                        </th>
                        <th >
                            {t("divide_on_percent")}
                        </th>
                        <th >
                            {t("rate_time")}
                        </th>

                        <th ></th>
                    </tr>
                    </thead>
                    <tbody className="table-body-font text-secondary">
                    {renderOperators()}
                    </tbody>
                </Table>
                {/*<Pagination changePageByUrl={handleChangePageByUrl} onChangePage={getInvoicesByPageNumber} count={Math.ceil(count/5)}/>*/}
            </div>

        </React.Fragment>
    )
}
export default withTranslation()(Operators);
