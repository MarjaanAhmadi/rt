import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import SinglePayment from "../../credit/singlePayment/singlePayment";
import {Table} from "react-bootstrap";
import Moment from "react-moment";
import msToTime from "../../../filtering/convertToTime";
import currency from "../../../filtering/currency";
const InvoiceItem = props => {
    const [invoice, setInvoice] = useState({});
    const [payments, setPayments] = useState({list: []})
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    //should send api to server
    const getSpecificInvoice = async () => {
        dispatch({ loading: true, type: "SHOW_LOADING" });
        try {
            const response = await axiosInstance.get(
                `/bill/api/bill/${props.match.params.id}`
            );
            let invoiceSpec = response.data.data;
            if(invoiceSpec.status_code === 'revoke') invoiceSpec.label = "منقضی شده"
            if(invoiceSpec.status_code === 'pending') invoiceSpec.label = "در حال بررسی"
            if(invoiceSpec.status_code === 'failed') invoiceSpec.label = "نا موفق"
            if(invoiceSpec.status_code === 'ready') invoiceSpec.label = "آماده پرداخت"
            if(invoiceSpec.invoice_type_code === 'interim') invoiceSpec.type = "میاندوره"
            if(invoiceSpec.status_code === 'periodic') invoiceSpec.type = "پایان‌دوره"
            setInvoice(invoiceSpec);
        } catch (e) {
            console.log(e);
        }
        dispatch({ loading: false, type: "SHOW_LOADING" });
    };
    const getInvoiceInfo = async () => {
        //get specific item from server, but its static now
        await getSpecificInvoice();
    };
    const setHeader = () => {
        if (token)
            axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
    };

    const getInvoicesPayments = async () => {
        dispatch({
            loading: true,
            type: 'SHOW_LOADING'
        });
        try {
            const response = await axiosInstance.get(`/payment/api/bill/${props.match.params.id}`);
            setPayments({
                ...payments,
                list: response.data.data
            })
        }
        catch (e) {
            console.log(e);
            toast.error(i18next.t('Rejected'));
        }

    };

    const renderPayments = () => {

        if (payments.list.length > 0){
            return (
                payments.list.map((item) => {
                    let status = {
                        label: '',
                        color: ''
                    }
                    switch (item.status_code) {
                        case 'pending':
                            status.label= 'در حال بررسی'
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
                <p className=" text-center text-secondary">{i18next.t('noDataFounded')}</p>
            </div>
        )

    }
    useEffect(() => {
        setHeader();
        getInvoiceInfo();
        getInvoicesPayments();
    }, []);
    return invoice !== undefined ? (
        <React.Fragment>

            <div className='container'>
                <h4>اطلاعات صورت حساب</h4>
                <Table striped bordered size="lg">
                    <tbody>
                    <tr>
                        <td>
                            <span className='p-3'>
                              شماره دوره : { invoice.period_count}
                            </span>
                        </td>
                        <td>
                        <span className='p-3'>
                            از تاریخ :  {invoice.from_date_jalali}
                            </span>
                        </td>
                        <td>
                        <span className='p-3'>
                               تا تاریخ :  { invoice.to_date_jalali}
                            </span>
                        </td>


                    </tr>
                    <tr>
                        <td>
                            <span className='p-3'>
                              نوع قبض : { invoice.type}
                            </span>
                        </td>
                        <td>
                     <span className='p-3'>
                         تاریخ صدور: {invoice.created_at_jalali}
                     </span>

                        </td>
                        <td>
                            <span className='p-3'>وضعیت: {invoice.label}</span>


                        </td>


                    </tr>
                    <tr>
                        <td>
                            <span className='p-3'>شناسه: {invoice.id}</span>

                        </td>
                        <td>
                            <span className='p-3'>کد پیگیری: {invoice.tracking_code} </span>

                        </td>
                        <td>
                            <span className='p-3'>مبلغ قابل پرداخت: {currency(invoice.total_cost)} ریال</span>
                        </td>

                    </tr>
                    </tbody>
                </Table>
                <hr />
                <h4>جزییات صورت حساب</h4>
                <Table striped bordered size="lg">
                    <tbody>
                    <tr>
                        <td>
                            <span className='p-3'> هزینه کل تماس:{currency(invoice.total_usage_cost)} {i18next.t("rial")}</span>

                        </td>
                        <td>
                            <span className='p-3'> زمان کل تماس:{msToTime(invoice.total_usage)} دقیقه</span>

                        </td>
                        <td>
                        <span className='p-3'>
                            مالیات :  {currency(invoice.tax_cost)} ریال
                            </span>
                        </td>
                        <td>
                        <span className='p-3'> درصد مالیات:{ invoice.tax_percent}%
                            </span>
                        </td>


                    </tr>
                    <tr>
                        <td>
                            <span className='p-3'>
                              مصرف تماس ثابت درون شهری: { msToTime(invoice.landlines_local_usage)}  دقیقه
                            </span>
                        </td>
                        <td>
                     <span className='p-3'>
                         هزینه تماس ثابت درون شهری: {currency(invoice.landlines_local_cost)} ریال
                     </span>

                        </td>
                        <td>
                            <span className='p-3'>مصرف تماس موبایل: {msToTime(invoice.mobile_usage)}دقیقه</span>
                        </td>
                        <td>
                            <span className='p-3'>هزینه تماس موبایل: {currency(invoice.mobile_cost)} ریال</span>
                        </td>

                    </tr>
                    <tr>
                        <td>
                            <span className='p-3'>مصرف تماس بین الملل: {msToTime(invoice.international_usage)}دقیقه</span>
                        </td>
                        <td>
                            <span className='p-3'>هزینه تماس بین الملل: {currency(invoice.international_cost)} ریال</span>
                        </td>
                        <td>
                            <span className='p-3'>مصرف کل تماس: {msToTime(invoice.total_usage)}دقیقه</span>
                        </td>
                        <td>
                            <span className='p-3'>اعتبار: {currency(invoice.credit)} ریال</span>

                        </td>


                    </tr>
                    <tr>


                        <td>
                            <span className='p-3'>آبونمان: {currency(invoice.subscription_cost)} ریال</span>

                        </td>
                        <td>
                            <span className='p-3'>بدهی پیشین: {currency(invoice.debt)} ریال</span>
                        </td>
                        <td>
                            <span className='p-3'>
                              مصرف تماس ثابت بین شهری: { msToTime(invoice.landlines_long_distance_usage)}  دقیقه
                            </span>
                        </td>
                        <td>
                     <span className='p-3'>
                         هزینه تماس ثابت بین شهری: {currency(invoice.landlines_long_distance_cost)} ریال
                     </span>

                        </td>
                    </tr>

                    </tbody>
                </Table>
            </div>

            <div className="header-item">
                <h5 className="text-secondary mr-3">{i18next.t("paymentReport")}</h5>
            </div>
            <Table
                responsive
                className="table-borderless table-hover table-sep p-2"
            >
                <thead className="header-font text-secondary">
                <tr>
                    <th>{i18next.t("receiptId")}</th>
                    <th>{i18next.t("CreationDate")}</th>
                    <th>{i18next.t("Price")}</th>
                    <th>{i18next.t("Status")}</th>
                </tr>
                </thead>
                <tbody className="table-body-font text-secondary">
                {renderPayments()}
                </tbody>
            </Table>
        </React.Fragment>
    ) : (
        <p></p>
    );
};
export default InvoiceItem;
