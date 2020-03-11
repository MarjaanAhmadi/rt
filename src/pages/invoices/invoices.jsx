import React, {useState, useEffect, useDebugValue} from "react";
import { withTranslation } from "react-i18next";
import './invoices.css';
import SingleInvoice from "./singleInvoice/singleInvoice";
import {Table, Form, InputGroup} from "react-bootstrap";
import {useHistory} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axios";
import Pagination from "../../mainComponents/pagination/pagination";
import { library } from "@fortawesome/fontawesome-svg-core";
import queryString from 'query-string';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faArrowLeft,
    faArrowUp,
    faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import i18next from "i18next";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";

library.add(faArrowRight, faArrowLeft, faArrowUp, faArrowDown);

const Invoice = (props ) => {
    //define dispatch to set invoices in redux
    const dispatch = useDispatch();

    const history = useHistory();

    //get invoices list from redux
    const invoices = useSelector(state => state.invoices);
    //define params for sending to server, it contains offset and limit and search word
    //default limit is 10 and offset is teh page item that selected
    const [params, setParams] = useState({
        offset: 0,
        limit: 25,
        status_code: "all",
        created_at: {
            order_by: "-created_at",
            status: "arrow-up"
        },
        invoice_type_code: "all",
    });

    const [mainNumber, setMainNumber] = useState('');
    const [tracking_code, setTracking_code] = useState('');

    //define a status to understand pay status and show certain modal
    const [showPayModal, setShowPayModal] = useState(false);

    const [statusPay, setStatusPay] = useState('success');
    const [paymentResult, setPaymentResult] = useState({
        tracking_code: '1234545'
    });

    const [count, setCount] = useState(0);



    const [showModal, setShowModal] = useState(false);
    const [changeUrl, setChangeUrl] = useState({
        prev: "",
        next: ""
    });

    //get token from local storage
    const token = localStorage.getItem("admin-token");



    const filterPress = async (e) => {
        if(e.keyCode === 13) await filterByTrackingCode();
    };

    const filterByTrackingCode = async () => {
        try{
            dispatch({ loading: true, type: "SHOW_LOADING" });
            const response = await axiosInstance.get("/bill/api/bill/", {
                params: {tracking_code: tracking_code}
            });
            setChangeUrl({
                ...changeUrl,
                next: response.data.next,
                prev: response.data.previous
            });
            dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
            dispatch({
                invoiceCount: response.data.count,
                type: "SET_INVOICE_COUNT"
            });
        }
        catch (e) {
            console.log(e);
        }
        dispatch({ loading: false, type: "SHOW_LOADING" });
    };



    //change page
    const getInvoicesByPageNumber = async ({ ...childData }) => {
        const currentOffset = childData.selected * 5;
        setParams({
            ...params,
            offset: currentOffset
        });
    };

    const handleChangePageByUrl = childData => {};

    const sort = () => {
        if (params.created_at.status !== "arrow-up") {
            setParams({
                ...params,
                created_at: {
                    order_by: "-created_at",
                    status: "arrow-up"
                }
            });
        } else {
            setParams({
                ...params,
                created_at: {
                    order_by: "created_at",
                    status: "arrow-down"
                }
            });
        }
    };

    //render payments from server and set status for each payment
    const renderInvoices = () => {
        return invoices !== undefined && invoices.length > 0 ? (
            invoices.length > 0 ? (
                invoices.map(invoice => {
                    let state = {
                        text: "",
                        color: ""
                    };
                    switch (invoice.status_code) {
                        case "ready":
                            state.text = i18next.t("ready");
                            state.color = "text-warning";
                            break;
                        case "pending":
                            state.text = i18next.t("pending");
                            state.color = "text-primary";
                            break;
                        case "success":
                            state.text = i18next.t("success");
                            state.color = "text-success";
                            break;
                        case "revoke":
                            state.text = i18next.t("revoke");
                            state.color = "text-secondary";
                            break;
                        default:
                            state.text = i18next.t("revoke");
                            state.color = "text-danger";
                    }
                    return (
                        <SingleInvoice state={state} key={invoice.id} invoice={invoice} />
                    );
                })
            ) : null
        ) : (
            <NoRowFounded/>
        );
    };

    //if token is exist we should set header for axios instance
    const setHeader = () => {
        if (token)
            axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
    };

    //if invoices list is empty get invoices from server
    const checkInvoices = async () => {
        if (invoices.length === 0) {
            await getAllInvoices();
        }
    };

    const getAllInvoices = async () => {
        try {
            dispatch({ loading: true, type: "SHOW_LOADING" });
            let data = {
                order_by: params.created_at.order_by,
                limit: params.limit,
                offset: params.offset,
                number: mainNumber
            };
            if (params.status_code !== "all")
                data["status_code"] = params.status_code;
            if (params.invoice_type_code !== "all")
                data["invoice_type_code"] = params.invoice_type_code;
            const response = await axiosInstance.get("/bill/api/bill/", {
                params: data
            });
            setChangeUrl({
                ...changeUrl,
                next: response.data.next,
                prev: response.data.previous
            });
            setCount(response.data.count);

            dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
            dispatch({
                invoiceCount: response.data.count,
                type: "SET_INVOICE_COUNT"
            });
        } catch (e) {
            console.log(e);
        }
        dispatch({ loading: false, type: "SHOW_LOADING" });
    };

    const getInvoices = async () => {
        dispatch({ loading: true, type: "SHOW_LOADING" });

        try {
            const data = {
                status_code: params.status_code,
                order_by: params.created_at.order_by,
                limit: params.limit,
                offset: params.offset,
                invoice_type_code: params.invoice_type_code,
                number: mainNumber
            };
            const response = await axiosInstance.get("/bill/api/bill/", {
                params: data
            });
            setCount(response.data.count);


            dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
            dispatch({
                invoiceCount: response.data.count,
                type: "SET_INVOICE_COUNT"
            });

            // if (page) setTimeout(() => this.$set(this.table.pagination, 'page', (page / 50) + 1), 0)
            //dispatch
        } catch (e) {
            //loading false
        }
        dispatch({ loading: false, type: "SHOW_LOADING" });
    };

    const checkPay = async () => {
        if(props.location.search !== "") {

            const values = queryString.parse(props.location.search)
            if(values.invoice_id)
                await getPaymentStatus(values.invoice_id);
        }
    };

    const getPaymentStatus =async (id) => {
        try {
            const response = await axiosInstance.get(`/bill/api/bill/${id}/`);
            setPaymentResult(response.data.data);
            setShowPayModal(true);
            if(response.data.data.status_code === 'success'){
                setStatusPay('success')
            }
            if(response.data.data.status_code === 'ready'){
                setStatusPay('failed')
            }
            if(response.data.data.status_code === 'revoke'){
                setStatusPay('revoke')
            }
        }
        catch (e) {
            history.push('/invoice')
        }
    };

    const checkSearchType = () => {
        params.status_code === "all" || params.invoice_type_code === "all"
            ? getAllInvoices()
            : getInvoices();
    };
    const keyPress = async (e) => {
        if(e.keyCode === 13) await checkSearchType();
    };

    useEffect(() => {
        checkPay();
    },[history]);


    //when component is mount Authorization header should set according to token
    useEffect(() => {
        dispatch({ loading: true, type: "SHOW_LOADING" });
        setHeader();
        checkInvoices();
    }, []);

    useEffect(() => {
        checkSearchType();
    }, [params]);
    return (
        <React.Fragment>

            <div className="p-5">
                <span className="main-title">{i18next.t("Invoices")}</span>

                {/*<div className='row header-item'>*/}
                {/*<div className="col-lg-4">*/}
                {/*    <div className="search-items">*/}
                {/*        <input className="form-control mr-sm-2 custom-input mt-1"*/}
                {/*               type="search"*/}
                {/*               placeholder={`${i18next.t("Search")}...`}*/}
                {/*               value={params.t}*/}
                {/*               onChange={(event) => {*/}
                {/*                   setParams({*/}
                {/*                       ...params,*/}
                {/*                       t: event.target.value*/}
                {/*                   })*/}
                {/*               }}*/}
                {/*        />*/}
                {/*    </div>*/}

                {/*</div>*/}

                {/*</div>*/}
                <div className="row filter-section mt-4">

                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={checkSearchType}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            <Form.Control
                                onKeyDown={keyPress}
                                type="text"
                                placeholder={i18next.t("Enter your main number")}
                                value={mainNumber}
                                onChange={(event) => {
                                    setMainNumber(event.target.value)
                                }}
                            />
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className='col-md-3'>
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={filterByTrackingCode}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onKeyDown={filterPress}
                                    type="text"
                                    placeholder={i18next.t("Enter tour tacking_code")}
                                    value={tracking_code}
                                    onChange={(event) => {
                                        setTracking_code(event.target.value)
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>

                    </div>
                    <div className="col-md-3">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend"></div>
                            <span className="mt-2"> {i18next.t('ChooseStatus')} </span>
                            <select
                                className="mr-2"
                                onChange={event => {
                                    setParams({
                                        ...params,
                                        status_code: event.target.value
                                    });
                                }}
                                value={params.status_code}
                                className="custom-select"
                                id="inputGroupSelect01"
                            >
                                <option selected value="all">
                                    همه
                                </option>
                                <option value="revoke">{i18next.t("revoke")}</option>
                                <option value="pending">{i18next.t("pending")}</option>
                                <option value="success">{i18next.t("success")}</option>
                                <option value="ready">{i18next.t("ready")}</option>

                            </select>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend"></div>
                            <span className="mt-2">{i18next.t("chooseInvoiceType")} </span>
                            <select
                                className="mr-2"
                                onChange={event => {
                                    setParams({
                                        ...params,
                                        invoice_type_code: event.target.value
                                    });
                                }}
                                value={params.invoice_type_code}
                                className="custom-select"
                                id="inputGroupSelect01"
                            >
                                <option selected value="all">
                                    {i18next.t("all")}
                                </option>
                                <option value="interim">{i18next.t("iterim")}</option>
                                <option value="periodic">{i18next.t("periodic")}</option>
                            </select>
                        </div>
                    </div>


                </div>

                <Table
                    responsive
                    className="table-borderless table-hover table-sep p-2"
                >
                    <thead className="header-font text-secondary">
                    <tr>
                        <th></th>
                        <th>{i18next.t('main_number')}</th>
                        <th>{i18next.t("InvoiceId")}</th>
                        <th>{i18next.t("tracking_code")}</th>
                        <th>{i18next.t("InvoiceType")}</th>
                        <th className="pointer" onClick={sort}>
                            {i18next.t("CreationDate")}{" "}
                            <FontAwesomeIcon icon={params.created_at.status} />
                        </th>
                        <th>{i18next.t("Price")}</th>
                        <th>{i18next.t("Status")}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody className="table-body-font text-secondary">
                    {renderInvoices()}
                    </tbody>
                </Table>
                <Pagination
                    changePageByUrl={handleChangePageByUrl}
                    onChangePage={getInvoicesByPageNumber}
                    count={Math.ceil(count / 25)}
                />
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Invoice);
