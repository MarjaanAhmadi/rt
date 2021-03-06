import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import './baseBalanceInvoice.css';
import SingleBaseBalanceInvoice from "./singleBaseBalanceInvoice/singleBaseBalanceInvoice";
import {Form, InputGroup, Table} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../config/axios";
import Pagination from "../../mainComponents/pagination/pagination";
import DatePicker from "react-modern-calendar-datepicker";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "jalali-moment";

import {
  faArrowRight,
  faArrowLeft,
  faArrowUp,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import i18next from "i18next";
import queryString from "query-string";
import {useHistory} from 'react-router-dom';

library.add(faArrowRight, faArrowLeft, faArrowUp, faArrowDown);

const BaseBalanceInvoice = (props) => {

  const history = useHistory();
  //define dispatch to set invoices in redux
  const dispatch = useDispatch();
  //create form to increase base balance
  const[createForm, setCreateForm] = useState({
    total_cost: 0,
    description: ''
  });
  const [createFormValidation, setCreateFormValidation] = useState(true);
  const [mainNumber, setMainNumber] = useState('');



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
    total_cost: {
      order_by: "total_cost",
      status: "arrow-down"
    },
    invoice_type_code: "all",
    created_at_from: '',
    created_at_to: ''
  });

  //define a status to understand pay status and show certain modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [count, setCount] = useState(0)

  const [statusPay, setStatusPay] = useState('success');
  const [paymentResult, setPaymentResult] = useState({
    tracking_code: '1234545'
  });



  const [showModal, setShowModal] = useState(false);
  const [changeUrl, setChangeUrl] = useState({
    prev: "",
    next: ""
  });

  const [selectedDayFrom, setSelectedDayFrom] = useState(null);
  const [selectedDayTo, setSelectedDayTo] = useState(null);



  //get token from local storage
  const token = localStorage.getItem("admin-token");

  //request to create new base-balance

  const submitBaseBalanceForm = async () => {
    dispatch({ loading: true, type: "SHOW_LOADING" });
    if(createForm.total_cost > 0)
    {
      try {
        await axiosInstance.post("/bill/api/base-balance-bill/", createForm);
        await getAllInvoices();
        toast.success('آیتم مورد نظر با موفقیت ایجاد شد.');
        setCreateForm({
          ...createForm,
          total_cost: 0,
          description: ''
        });

        setShowModal(false);
      }
      catch (e) {
        toast.error("لطفا مجددا سعی کنید.");
      }

    }
    else{
      setCreateFormValidation(false);
    }
    dispatch({ loading: false, type: "SHOW_LOADING" });

  };

  const clearFilter = () => {
    setParams({
      ...params,
      offset: 0,
      limit: 25,
      status_code: "all",
      created_at: {
        order_by: "-created_at",
        status: "arrow-up"
      },
      total_cost: {
        order_by: "total_cost",
        status: "arrow-down"
      },
      invoice_type_code: "all",
      created_at_from: '',
      created_at_to: ''
    });
    setSelectedDayFrom(null);
    setSelectedDayTo(null);
    setMainNumber('');
  };

  const sortByTotalCost = () => {
    if (params.total_cost.status !== "arrow-up") {
      setParams({
        ...params,
        total_cost: {
          order_by: "-total_cost",
          status: "arrow-up"
        }
      });
    } else {
      setParams({
        ...params,
        total_cost: {
          order_by: "total_cost",
          status: "arrow-down"
        }
      });
    }
  };

  const convertToTimeStamp = async (event) => {

    let dft='', dtt='';
    if(selectedDayFrom){
      let df = `${selectedDayFrom.year}/${pad(selectedDayFrom.month)}/${pad(selectedDayFrom.day)}`;
      const miladi = moment.from(df, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
      dft = moment(miladi).format("X");
    }
    if(selectedDayTo){
      let dt = `${selectedDayTo.year}/${pad(selectedDayTo.month)}/${pad(selectedDayTo.day)}`;
      const miladi = moment.from(dt, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
      dtt = moment(miladi).format("X");
    }
    await filterByDate(dft, dtt)
  };
  const filterByDate = async (df, dt) => {
    let data = {};
    if(params.status_code !== 'all') {
      data['status_code'] = params.status_code;
    }if(selectedDayFrom){
      data['created_at_from'] = df;
    }
    if(selectedDayTo){
      data['created_at_to'] = dt;
    }

    const response = await axiosInstance.get('/bill/api/base-balance-bill/',{params: data});
    dispatch({ invoices: response.data.data, type: "SET_INVOICES" });
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

  const pad = (num) => {
    return (num < 10) ? '0' + num.toString() : num.toString();
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
                  state.text = "آماده پرداخت";
                  state.color = "text-warning";
                  break;
                case "pending":
                  state.text = "در انتظار تایید";
                  state.color = "text-primary";
                  break;
                case "success":
                  state.text = "پرداخت شده";
                  state.color = "text-success";
                  break;
                case "revoke":
                  state.text = "منقضی شده";
                  state.color = "text-secondary";
                  break;
                default:
                  state.text = "پرداخت نشده";
                  state.color = "text-danger";
              }
              return (
                  <SingleBaseBalanceInvoice state={state} key={invoice.id} invoice={invoice} />
              );
            })
        ) : null
    ) : (
        <tr className="tr-shadow table-tr">
          <h6 className="p-4">موردی یافت نشد</h6>
        </tr>
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

  const createBaseBalance = async () => {
    setShowModal(true)
  };

  const getAllInvoices = async () => {
    try {
      dispatch({ loading: true, type: "SHOW_LOADING" });
      let data = {
        order_by: `${params.total_cost.order_by},${params.created_at.order_by}`,
        limit: params.limit,
        offset: params.offset,
        number: mainNumber
      };
      if (params.status_code !== "all")
        data["status_code"] = params.status_code;
      if (params.invoice_type_code !== "all")
        data["invoice_type_code"] = params.invoice_type_code;
      const response = await axiosInstance.get("/bill/api/base-balance-bill/", {
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
        order_by: `${params.total_cost.order_by},${params.created_at.order_by}`,
        limit: params.limit,
        offset: params.offset,
        invoice_type_code: params.invoice_type_code,
        number: mainNumber
      };
      const response = await axiosInstance.get("/bill/api/base-balance-bill/", {
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
      if(values.base_balance_id)
        await getPaymentStatus(values.base_balance_id);
    }
  };

  const getPaymentStatus =async (id) => {
    try {
      const response = await axiosInstance.get(`/bill/api/base-balance-bill/${id}/`);
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
      history.push('/base-balance-invoice')
    }
  };

  const keyPress = (e) => {
    if(e.keyCode === 13) checkSearchType();
  };
  const checkSearchType = () => {
    if(params.status_code === "all" || params.invoice_type_code === "all")
    {
      if(!params.created_at_from && !params.created_at_to)
        getAllInvoices()
      else convertToTimeStamp();
    }
    else {
      if(!params.created_at_from && !params.created_at_to)
        getInvoices();
      else convertToTimeStamp();
    }
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
          <span className="main-title">صورتحساب‌های افزایش اعتبار</span>

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
                      placeholder="سرشماره خود را وارد نمایید"
                      value={mainNumber}
                      onChange={(event) => {
                        setMainNumber(event.target.value)
                      }}
                  />
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <div className="input-group mb-3">
                <div className="input-group-prepend"></div>
                <span className="mt-2"> {i18next.t('chooseStatus')} </span>
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
                  <option value="revoke">{i18next.t('revoke')}</option>
                  <option value="pending">{i18next.t('pending')}</option>
                  <option value="success">{i18next.t('success')}</option>
                  <option value="ready">{i18next.t('ready')}</option>

                </select>
              </div>
            </div>
            <div className='col-md-3'>
                <span>از تاریخ: </span>
                <DatePicker
                    onChange={(event)=>{
                      const date = `${event.year}/${pad(event.month)}/${pad(event.day)}`;
                      setParams({
                        ...params,
                        created_at_from: date
                      });
                      setSelectedDayFrom(event)
                    }}
                    shouldHighlightWeekends
                    isPersian
                    value={selectedDayFrom}
                    locale="fa"
                />
            </div>
            <div className='col-md-3'>
                <span>تا تاریخ: </span>

                <DatePicker
                    onChange={(event)=>{
                      const date = `${event.year}/${pad(event.month)}/${pad(event.day)}`;
                      setParams({
                        ...params,
                        created_at_to: date
                      });
                      setSelectedDayTo(event)
                    }}
                    shouldHighlightWeekends
                    isPersian
                    value={selectedDayTo}
                    locale="fa"
                />
            </div>
            <div className='col-md-2'><span className='btn-custom' onClick={clearFilter}>پاک کردن فیلتر</span></div>
          </div>
          <Table
              responsive
              className="table-borderless table-hover table-sep p-2"
          >
            <thead className="header-font text-secondary">
            <tr>
              <th></th>
              <th>{i18next.t("main_number")}</th>
              <th>{i18next.t("base-balance-id")}</th>
              <th>{i18next.t("tracking_code")}</th>
              <th className="pointer" onClick={sort}>
                {i18next.t("CreationDate")}{" "}
                <FontAwesomeIcon icon={params.created_at.status} />
              </th>
              <th className='pointer' onClick={sortByTotalCost}>
                {i18next.t("Price")}
                <FontAwesomeIcon icon={params.total_cost.status} />
              </th>
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

export default withTranslation()(BaseBalanceInvoice);
