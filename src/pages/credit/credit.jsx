import React,{useState,useEffect} from 'react';
import {withTranslation} from "react-i18next";
import axiosInstance from "../../config/axios";
import moment from "jalali-moment";
import SinglePayment from "./singlePayment/singlePayment";
import './credit.css';
import {useDispatch} from "react-redux";
import {Form, InputGroup, Table} from "react-bootstrap";
import './credit.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DatePicker from "react-modern-calendar-datepicker";


const Credit = ({t}) => {

    const dispatch = useDispatch();
    //get token from local storage
    const token = localStorage.getItem('admin-token');
    //define payment list state
    const [payments, setPayments] = useState({list: []})

    //define main numbers list state
    const [mainNumbers, setMainNumbers] = useState({list: []})

    //define credit form state for paying credits
    const [creditForm,setCreditForm] = useState({
        amount: 0,
        payment_gateway: 'mis',
        gateway: null,
        description: '',
        files_id: [],
        //sub_id: mainnumberid
    });
    const [params, setParams] = useState({
        status_code: '',
        created_at_from: '',
        created_at_to: ''
    });

    //define selected main number state-when user selects a main number the base balance will change accroding to selected main number id
    const selectedMainNumber = useState({
        id: ''
    });

    //define base balance state and set after selecting main number
    const [baseBalance, setBaseBalance] = useState({
        baseBalanceAmount: 0,
        usedBalanceAmount: 0
    });

    //show modal for paying details and confirm
    const [showModal, setShowModal] = useState(false)

    //show modal info
    const showPayInfo = () => {
        setShowModal(true)
    };
    const [selectedDayFrom, setSelectedDayFrom] = useState(null);
    const [selectedDayTo, setSelectedDayTo] = useState(null);

    const [mainNumber, setMainNumber] = useState('');

    const pad = (num) => {
        return (num < 10) ? '0' + num.toString() : num.toString();
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
        if(params.status_code) {
            data['status_code'] = params.status_code;
        }if(selectedDayFrom){
            data['created_at_from'] = df;
        }
        if(selectedDayTo){
            data['created_at_to'] = dt;
        }

        const response = await axiosInstance.get('/payment/api/payment/',{params: data});
        setPayments({
            ...payments,
            list: response.data.data
        })
    };

    const clearFilter = () => {
          setParams({
              ...params,
              status_code: '',
              created_at_from: '',
              created_at_to: ''
          });
            setMainNumber('');
            setSelectedDayFrom('');
            setSelectedDayTo('');

    };

    //get user's main numbers list  according to token(set on header when components is mounted)
    const getMainNumbers = async () => {
        dispatch({loading:true, type: 'SHOW_LOADING'})

        try {
            //request to get list
            const response = await axiosInstance.get('/gateway/api/gateway/')
            //change main numbers state
            setMainNumbers({
                ...mainNumbers,
                list: response.data.data
            })
        }
        catch (e) {
            console.log(e)
        }
        dispatch({loading:false, type: 'SHOW_LOADING'})


    }

    //get user's payments from server according to token(set on header when components is mounted)
    const getPaymentHistory = async ()=>{
        dispatch({loading:true, type: 'SHOW_LOADING'});
        let data={};
        if(params.status_code !== ''){
            data['status_code'] = params.status_code;
        }
        data['number'] = mainNumber;

        try {
            //request to get payments
            const response = await axiosInstance.get('/payment/api/payment/',{params: data})
            //change payment list state
            setPayments({
                ...payments,
                list: response.data.data
            })
        }
        catch (e) {
            console.log(e)
        }
        dispatch({loading:false, type: 'SHOW_LOADING'})

    }

    //render payments list according to payments list and set status
    //if payments list is null then show a message
    //else render single payment component
    const renderPayments = () => {

        if (payments.list.length!==0){
            return (
                payments.list.map((item) => {
                    let status = {
                        label: '',
                        color: ''
                    }
                    switch (item.status_code) {
                        case 'pending':
                            status.label= 'در انتظار پرداخت'
                            status.color= 'text-primary text--accent-3'

                            break;
                        case 'success':
                            status.label= 'پرداخت شده'
                            status.color= 'text-success'
                            break;

                        case 'failed':
                            status.label= 'نا‌موفق'
                            status.color= 'text-danger text--darken-1'
                            break;
                        default:
                            status.label = 'نامشخص'
                            status.color = 'text-warning'
                    }
                    return <SinglePayment key={item.id} payment = {item} status={status}/>
                })
            )
        }
        else return(
            <div className="shadow-lg p-3 mb-3 bg-white rounded">
                <p className=" text-center text-secondary">{t('noDataFounded')}</p>
            </div>
        )

    };

    //check if token is exist then set header authorization using token
    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`
    }

    //load when main number will change and find selected main number id in main numbers list and change base balance state according to selected main number id
    const getBaseBalance = () => {

        if(selectedMainNumber.id)
        {
            const item = mainNumbers.list.filter(i => i.id == selectedMainNumber.id)[0]
            setBaseBalance({
                ...baseBalance,
                baseBalanceAmount: item.base_balance,
                usedBalanceAmount: item.used_balance
            })
        }

    };

    const keyPress = async (e) => {
        if(e.keyCode === 13) await getPaymentHistory();
    };


    //when component is mounted we should set header/get main numbers list and get payments history
    useEffect(()=> {
        setHeader();
        getMainNumbers();
        getPaymentHistory();

    },[]);
    //when main number will select and change base balance will change
    useEffect(() => {
        getBaseBalance()
    }, [selectedMainNumber]);

    useEffect(() => {
        if(!params.created_at_from && !params.created_at_to)
            getPaymentHistory()
        else convertToTimeStamp()
    },[params]);

    return (
        <React.Fragment>

            <div className="p-5">
                {/*{selectedMainNumber.id !== "" ? (*/}
                {/*  <div className="row shadow-lg p-3 mb-3 bg-white rounded header-item table-item animated fadeInRightBig faster">*/}
                {/*    <div className="col-md-3">*/}
                {/*      {t("baseBalance")}: {currency(baseBalance.baseBalanceAmount)}{" "}*/}
                {/*      {t("rial")}*/}
                {/*    </div>*/}
                {/*    <div className="col-md-3">*/}
                {/*      {t("usedBalance")}: {currency(baseBalance.usedBalanceAmount)}{" "}*/}
                {/*      {t("rial")}*/}
                {/*    </div>*/}
                {/*    <div className="col-md-6">*/}
                {/*      <div className="form-group">*/}
                {/*        <div className="search-items">*/}
                {/*          <span className="mt-2">{`${t("amount")}:`}</span>*/}
                {/*          <input*/}
                {/*            className="form-control mr-sm-2 custom-input amount-input mt-1"*/}
                {/*            type="number"*/}
                {/*            value={creditForm.amount}*/}
                {/*            onChange={event => {*/}
                {/*              setCreditForm({*/}
                {/*                ...creditForm,*/}
                {/*                amount: event.target.value*/}
                {/*              });*/}
                {/*            }}*/}
                {/*          />*/}
                {/*          <span className="pt-2">{t("rial")}</span>*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*) : (*/}
                {/*  ""*/}
                {/*)}*/}
                <div className="main-title">
                    {t("paymentReport")}
                </div>
                <div className='row'>

                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={getPaymentHistory}>
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
                    <div className='col-md-3'>
                        <span>انتخاب وضعیت: </span>
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
                            <option selected value="">
                                همه
                            </option>
                            <option value="failed">پرداخت نشده</option>
                            <option value="pending">در انتظار تایید</option>
                            <option value="success">پرداخت شده</option>

                        </select>
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
                        <th>{t("main_number")}</th>

                        <th>{t("receiptId")}</th>
                        <th>{t("CreationDate")}</th>
                        <th>{t("Price")}</th>
                        <th>{t("Status")}</th>
                    </tr>
                    </thead>
                    <tbody className="table-body-font text-secondary">
                    {renderPayments()}
                    </tbody>
                </Table>
            </div>
        </React.Fragment>
    );
}
export default withTranslation() (Credit)
