import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Col, Form, Row} from "react-bootstrap";
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import { Multiselect } from 'multiselect-react-dropdown';
import {forEach} from "react-bootstrap/cjs/utils/ElementChildren";
import './operatorActions.css';
const OperatorActions = (props) => {
    const dispatch = useDispatch();
    const destinations = useSelector(state => state.destinations);
    const users = useSelector(state => state.users);
    const [form, setForm] = useState({
        operator_code: '',
        inbound_rate: 0,
        outbound_rate: 0,
        divide_on_percent:80,
        rate_time_type: 'seconds',
        rate_time: 60,
        destination_names: ''
    });

    const [error, setError] = useState({
        operatorCode: false,
        inboundRate: false,
        outboundRate: false,
        divideOnPercent: false,
        rateTimeType: false,
        rateTime: false,
        destination_names: false
    });


    const [selectedValue, setSelectedValue] = useState({list: []});
    const [currentSelectedValue, setCurrentSelectedValue] = useState({list: []});

    const onSelect = (event) => {
        let array = event;
        if(selectedValue.list.length > 0){
            forEach((dest) => {
                array.push(dest);
            });
        }
        let reformattedArray = array.map(obj =>{
            return obj.name;
        });
        setCurrentSelectedValue({
            ...currentSelectedValue,
            list: reformattedArray
        });
    };
    const onRemove = (optionList, removedItem) => {
        let data = currentSelectedValue.list.filter(i => i !== removedItem.name);

        setCurrentSelectedValue({
            ...currentSelectedValue,
            list: data
        })
    };
    const checkValidations = () => {
        let hasError = false;
        if(form.inbound_rate === 0 || form.inbound_rate === '') {
            hasError = true;
            setError({
                ...error,
                inboundRate: true
            })
        }
        if(form.operator_code === '') {
            hasError = true;
            setError({
                ...error,
                operator_code: true
            })
        }
        if(form.outbound_rate === 0 || form.outbound_rate === '') {
            hasError = true;
            setError({
                ...error,
                outboundRate: true
            })
        }
        // if(form.divide_on_percent <= '0' || form.divide_on_percent > '100') {
        //     hasError = true;
        //     setError({
        //         ...error,
        //         divideOnPercent: true
        //     })
        // }
        if(form.rate_time_type === 0) {
            hasError = true;
            setError({
                ...error,
                rateTimeType: true
            })
        }
        if(form.rate_time === 0 || form.rate_time === '') {
            hasError = true;
            setError({
                ...error,
                rateTimeType: true
            })
        }
        if (hasError) return false;
        else return true;
    };


    const editOperator = async () => {
debugger
        if(checkValidations()){
            try {
                const data = {
                    operator_code: form.operator_code,
                    inbound_rate: form.inbound_rate,
                    outbound_rate: form.outbound_rate,
                    divide_on_percent: form.divide_on_percent,
                    rate_time_type: form.rate_time_type,
                    rate_time: form.rate_time,
                    destination_names: currentSelectedValue.list
                };
                const response = await axiosInstance.patch(`/cgrates/v1/api/operators/${props.operator.id}/`, data);
                props.getOperators();
                props.closeModal();
                toast.success(i18next.t('Edited'));
            }
            catch (e) {
                console.log(e);
            }
        }
        else{
            toast.error('لطفا تمامی فیلدها را بادقت پرکنید')

        }

    };
    const createOperator = async () => {
        debugger
        if(checkValidations()){

            try {
                const data = {
                    operator_code: form.operator_code,
                    inbound_rate: form.inbound_rate,
                    outbound_rate: form.outbound_rate,
                    divide_on_percent: form.divide_on_percent,
                    rate_time_type: form.rate_time_type,
                    rate_time: form.rate_time,
                    destination_names: currentSelectedValue.list
                };
                const response = await axiosInstance.post(`/cgrates/v1/api/operators/`, data);
                props.getOperators();
                props.created();
                toast.success(i18next.t('Created'));
            }
            catch (e) {
                console.log(e);
            }
        }
        else{
            toast.error('لطفا تمامی فیلدها را بادقت پرکنید')
        }

    };


    useEffect(() => {

        if(props.operator)
        {
            const destination_names = destinations.filter( i => i.name === props.operator.destination.name)[0];
            setForm({
                ...form,
                operator_code: props.operator.operator_code,
                inbound_rate: props.operator.inbound_rate,
                outbound_rate: props.operator.outbound_rate,
                divide_on_percent:props.operator.divide_on_percent,
                rate_time_type:props.operator.rate_time_type,
                rate_time: props.operator.rate_time,
                destination_names: props.operator.destination

            });

            setSelectedValue({
                ...selectedValue,
                list: props.operator.destination
            });
            let array = props.operator.destination;
            let reformattedArray = array.map(obj =>{
                return obj.name;
            });
            setCurrentSelectedValue({
                ...currentSelectedValue,
                list: reformattedArray
            });
        }
    },[]);
    return(
        <React.Fragment>
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('operator_code')}</Form.Label>
                        <Form.Control
                            readOnly={!props.edit ? false : true}
                            value={form.operator_code}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    operator_code: event.target.value
                                })
                            }}
                        />
                        {error.inbound_rate ? (
                            <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                        ) : (
                            ""
                        )}
                        {error.duplicateMac ? (
                            <span className="text-danger error">
                              {i18next.t("duplicateMac")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('inbound_rate')}</Form.Label>
                        <Form.Control
                            value={form.inbound_rate}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    inbound_rate: event.target.value
                                })
                            }}
                        />
                        {error.inboundRate ? (
                            <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('outbound_rate')}</Form.Label>
                        <Form.Control
                            value={form.outbound_rate}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    outbound_rate: event.target.value
                                })
                            }}
                        />
                        {error.outboundRate ? (
                            <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('divide_on_percent')}</Form.Label>
                        <Form.Control
                            value={form.divide_on_percent}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    divide_on_percent: event.target.value
                                })
                            }}
                        />
                        {error.divideOnPercent ? (
                            <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>

                </Form.Row>
                <Row>
                    <Col md='6'>
                        <Form.Label>{i18next.t('destinations')}</Form.Label>
                        <Multiselect
                            placeholder=''
                            emptyRecordMsg='موردی وجود ندارد.'
                            options={destinations} // Options to display in the dropdown
                            selectedValues={props.operator ? props.operator.destination : []} // Preselected value to persist in dropdown
                            onSelect={(event) => {onSelect(event)}} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />
                    </Col>
                    <Col md='6'>
                        <Form.Group>
                            <Form.Label>{i18next.t('rate_time')}</Form.Label>
                            <Form.Control
                                value={form.rate_time}
                                onChange={(event) => {
                                    setForm({
                                        ...form,
                                        rate_time: event.target.value
                                    })
                                }}
                            />
                            {error.rateTime ? (
                                <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                            ) : (
                                ""
                            )}
                        </Form.Group>
                    </Col>

                </Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('rate_time_type')}</Form.Label>
                        <Form.Control
                            as='select'
                            value={form.rate_time_type}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    rate_time_type: event.target.value
                                })
                            }}
                        >
                            <option value='seconds'>{i18next.t('seconds')}</option>
                            <option value='minutes'>{i18next.t('minutes')}</option>
                        </Form.Control>
                        {error.rateTimeType ? (
                            <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>

                </Form.Row>
            </Form>
            <span className='btn-custom pointer' onClick={props.edit ? editOperator : createOperator}>{props.edit ? i18next.t('edit') : i18next.t('create')}</span>

        </React.Fragment>
    )
}
export default OperatorActions;
