import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Col, Form} from "react-bootstrap";
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import getEndpointsList from "../../../mainComponents/getEndpointsList/getEndpointsList";

const PhoneActions = (props) => {
    const dispatch = useDispatch();
    const [brands, setBrands] = useState({list: []});
    const users = useSelector(state => state.users);

    const [form, setForm] = useState({
        brand: 0,
        mac_address: '',
        user: 0,
        enabled: false
    });

    const [error, setError] = useState({
        macAddress: false,
        duplicateMac: false,
        brand: '',
        user: ''
    });

    const checkValidations = () => {

        let hasError = false;
        if(form.brand === '0') {
            hasError = true;
            setError({
                ...error,
                brand: true
            })
        }
        if(form.mac_address === '') {
            hasError = true;
            setError({
                ...error,
                macAddress: true
            })
        }
        if(form.user === '0') {
            hasError = true;
            setError({
                ...error,
                user: true
            })
        }
        if (hasError) return false;
        else return true;
    };
    const getEndpoints = async () => {
        const endpoints = await getEndpointsList();
        dispatch({endpoints, type: 'SET_ENDPOINTS' });
    };
    const handleErrors = (res) =>{
        if(res.status === 400) {
            if(res.data.error.length > 0){


                res.data.error.forEach((item, index) => {
                    if('mac_address' in item) {
                        setError({
                            ...error,
                            duplicateMac: true
                        })
                    }
                })

            }
        }
    }

    const editPhone = async () => {
        if(checkValidations()){
            try {
                const response = await axiosInstance.put(`/endpoint/api/endpoint/${props.endpoint.id}/`, form);
                await getEndpoints();
                props.closeModal();
                toast.success(i18next.t('Edited'));
            }
            catch (e) {
                console.log(e);
                handleErrors(e.response);
            }
        }

    };
    const createPhone = async () => {
        if(checkValidations()){
            try {
                const response = await axiosInstance.post(`/endpoint/api/endpoint/`, form);
                await getEndpoints();
                props.created();
                toast.success(i18next.t('Created'));
            }
            catch (e) {
                console.log(e);
                handleErrors(e.response);
            }
        }

    };

    // get phone brands from server
    const getBrands = async () => {
        const response = await axiosInstance.get('/endpoint/api/brand/');
        setBrands({
            ...brands,
            list: response.data.data
        });
    };

    useEffect(() => {
        if(props.endpoint)
            setForm({
                ...form,
                brand: props.endpoint.brand.id,
                mac_address: props.endpoint.mac_address,
                user: props.endpoint.user.id,
                enabled: props.endpoint.enabled
            })
        getBrands();
    },[])
    return(
        <React.Fragment>
            <Form>
                <Form.Group as={Col}>
                    <Form.Control as='select'
                                  value={form.brand}
                                  onChange={(event)=> {
                                      setForm({
                                          ...form,
                                          brand: event.target.value
                                      })
                                  }}>
                            <option value='0'>{i18next.t('Choose')}</option>
                            {
                                brands.list.map((item, index)=>{
                                    return <option value={item.id}>{item.name}</option>
                                })
                            }
                    </Form.Control>
                    {error.brand ? (
                        <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                    ) : (
                        ""
                    )}
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>{i18next.t('MAC Address')}</Form.Label>
                    <Form.Control
                        value={form.mac_address}
                        onChange={(event) => {
                            setForm({
                                ...form,
                                mac_address: event.target.value
                            })
                        }}
                    />
                    {error.macAddress ? (
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
                    <Form.Control as='select'
                                  value={form.user}
                                  onChange={(event)=> {
                                      setForm({
                                          ...form,
                                          user: event.target.value
                                      })
                                  }}>
                        <option value='0'>{i18next.t('Choose')}</option>
                        {
                            users.map((item, index)=>{
                                return <option value={item.id}>{`${item.first_name} ${item.last_name}`}</option>
                            })
                        }
                    </Form.Control>
                    {error.user ? (
                        <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                    ) : (
                        ""
                    )}
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        checked={form.enabled}
                        onChange={(event) => {
                            setForm({
                                ...form,
                                enabled: !form.enabled
                            })
                        }}
                        label={form.enabled ? i18next.t('active') : i18next.t('deActive')}
                    />
                </Form.Group>
            </Form>
            <span className='btn-custom pointer' onClick={props.edit ? editPhone : createPhone}>{props.edit ? i18next.t('edit') : i18next.t('create')}</span>

        </React.Fragment>
    )
}
export default PhoneActions;
