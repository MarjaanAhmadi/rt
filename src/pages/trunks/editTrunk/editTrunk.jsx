import React, {useEffect, useState} from 'react';
import {Form, Col} from "react-bootstrap";
import axiosInstance from "../../../config/axios";
import {useSelector} from "react-redux";
import i18next from "i18next";
import {toast} from "react-toastify";
import './editTrunk.css';

const EditTrunk = (props) => {

    const token = useSelector(state => state.token);
    const weeks = useSelector(state => state.weeks);
    const conditionalList = useSelector(state => state.conditionalList);

    const [timeoutRoutes] = useState([
        {
            text: 'پایان تماس',
            value: 'end'
        },
        {
            text: 'اتصال به شماره داخلی',
            value: 'extension',
            label: 'داخلی پاسخگوی خودکار را وارد کنید'
        }
    ]);
    const [formEdit, setFormEdit] = useState({
        destination_type: 'end',
        destination_number: 0,
        conditional_list: 0,
        destination_type_in_list: '',
        destination_number_in_list: 0,
        destination_type_off: '',
        destination_number_off:0,
        business_week: 0,
    });

    const setHeader = () => (
        axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`
    );




    const renderTimeoutRoutes = () => {
        return(
                timeoutRoutes.map((timeoutRoute, index) => {
                return <option value={timeoutRoute.value}>{timeoutRoute.text}</option>
            })
        )
    };

    const editTrunk = async () => {
        try {
            await axiosInstance.put(`/gateway/api/gateway/${props.trunk.id}/`, formEdit)
            toast.success(i18next.t('Edited'));
            props.closeModal();
        }
        catch (e) {
            console.log(e)

            // toast.error(i18next.t('Rejected'))
        }
    };
    const getTrunk = () => {
        setFormEdit(props.trunk);
    };
    useEffect(() => {
        getTrunk();
        setHeader();
    },[]);
    return(
        <React.Fragment>
            <Form>
                {/*<Form.Row>*/}
                {/*    <Form.Group as={Col}>*/}
                {/*        <Form.Label>*/}
                {/*            {i18next.t('business_week')}*/}
                {/*        </Form.Label>*/}
                {/*        <Form.Control as="select"*/}
                {/*                      onChange={(event) => {*/}
                {/*                          setFormEdit({*/}
                {/*                              ...formEdit,*/}
                {/*                              business_week: event.target.value*/}
                {/*                          })*/}
                {/*                      }}*/}
                {/*                      value={formEdit.business_week}*/}
                {/*        >*/}
                {/*            <option value={0}>{i18next.t('Choose')} </option>*/}

                {/*            {renderBusinessWeeks()}*/}

                {/*        </Form.Control>*/}
                {/*    </Form.Group>*/}
                {/*</Form.Row>*/}
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            اتصال به
                        </Form.Label>
                        <Form.Control as="select"
                                      onChange={(event) => {
                                                    setFormEdit({
                                                        ...formEdit,
                                                        destination_type: event.target.value
                                                    })
                                                }}
                                      value={formEdit.destination_type}
                                      className="custom-select">
                            {renderTimeoutRoutes()}
                        </Form.Control>
                    </Form.Group>

                    {
                        formEdit.destination_type !== 'end'  && formEdit.destination_type !== '' ?
                            <Form.Group as={Col}>
                                <Form.Label>
                                    {i18next.t("destination_number")}
                                </Form.Label>
                                <Form.Control
                                              value={formEdit.destination_number}
                                              onChange={(event) => {
                                                  setFormEdit({
                                                      ...formEdit,
                                                      destination_number: event.target.value
                                                  })
                                              }}>
                                </Form.Control>
                            </Form.Group>
                            : null
                    }
                </Form.Row>
            {/*    <hr />*/}
            {/*    <span className='title'>*/}
            {/*        {i18next.t('List functionality')}*/}
            {/*    </span>*/}
            {/*    <Form.Row>*/}
            {/*    <Form.Group as={Col}>*/}
            {/*        <Form.Label>*/}
            {/*            {i18next.t('Choose list')}*/}
            {/*        </Form.Label>*/}
            {/*        <Form.Control as='select'*/}
            {/*                      onChange={(event) => {*/}
            {/*                          setFormEdit({*/}
            {/*                              ...formEdit,*/}
            {/*                              conditional_list: event.target.value*/}
            {/*                          })*/}
            {/*                      }} value={formEdit.conditional_list} >*/}
            {/*            <option value=''>{i18next.t('Choose')}</option>*/}
            {/*            {renderConditionalList()}*/}

            {/*        </Form.Control>*/}
            {/*    </Form.Group>*/}
            {/*</Form.Row>*/}
            {/*    <Form.Row>*/}
            {/*    <Form.Group as={Col}>*/}
            {/*        <Form.Label>*/}
            {/*            {i18next.t('Call to destination number')}*/}
            {/*        </Form.Label>*/}
            {/*        <Form.Control*/}
            {/*            as='select'*/}
            {/*            onChange={(event) => {*/}
            {/*                setFormEdit({*/}
            {/*                    ...formEdit,*/}
            {/*                    destination_type_in_list: event.target.value*/}
            {/*                })*/}
            {/*            }}*/}
            {/*            value={formEdit.destination_type_in_list}>*/}
            {/*            {renderTimeoutRoutes()}*/}

            {/*        </Form.Control>*/}
            {/*    </Form.Group>*/}
            {/*    {*/}
            {/*        formEdit.destination_type_in_list && formEdit.destination_type_in_list !== 'end' && formEdit.destination_type_in_list !== '' ?*/}
            {/*            <Form.Group as={Col}>*/}
            {/*                <Form.Label>*/}
            {/*                    {i18next.t('Call to destination number')}*/}
            {/*                </Form.Label>*/}
            {/*                <Form.Control*/}
            {/*                    value={formEdit.destination_number_in_list}*/}
            {/*                    onChange={(event) => {*/}
            {/*                        setFormEdit({*/}
            {/*                            ...formEdit,*/}
            {/*                            destination_number_in_list: event.target.value*/}
            {/*                        })*/}
            {/*                    }}>*/}
            {/*                </Form.Control>*/}
            {/*            </Form.Group>*/}
            {/*            : null*/}
            {/*    }*/}


            {/*</Form.Row>*/}
            {/*    <hr/>*/}
            {/*    <span className='title'>*/}
            {/*        {i18next.t('Off houres')}*/}
            {/*    </span>*/}
            {/*    <Form.Row>*/}
            {/*    <Form.Group as={Col}>*/}
            {/*        <Form.Label>*/}
            {/*            {i18next.t('Call to destination number')}*/}
            {/*        </Form.Label>*/}
            {/*        <Form.Control*/}
            {/*            as='select'*/}
            {/*            onChange={(event) => {*/}
            {/*                setFormEdit({*/}
            {/*                    ...formEdit,*/}
            {/*                    destination_type_off: event.target.value*/}
            {/*                })*/}
            {/*            }} value={formEdit.destination_type_off}>*/}
            {/*            {renderTimeoutRoutes()}*/}

            {/*        </Form.Control>*/}
            {/*    </Form.Group>*/}
            {/*    {*/}
            {/*        formEdit.destination_type_off !== 'end' && formEdit.destination_type_off !== '' ?*/}
            {/*            <Form.Group as={Col}>*/}
            {/*                <Form.Label>*/}
            {/*                    {i18next.t('destination_number')}*/}
            {/*                </Form.Label>*/}
            {/*                <Form.Control*/}
            {/*                    value={formEdit.destination_number_off}*/}
            {/*                    onChange={(event) => {*/}
            {/*                    setFormEdit({*/}
            {/*                        ...formEdit,*/}
            {/*                        destination_number_off: event.target.value*/}
            {/*                    })*/}
            {/*                }}>*/}
            {/*                </Form.Control>*/}
            {/*            </Form.Group>*/}
            {/*            :null*/}
            {/*    }*/}



            {/*</Form.Row>*/}
            </Form>
            <span onClick={editTrunk} className='btn-custom'>{i18next.t('edit')}</span>
        </React.Fragment>
    )
}
export default EditTrunk;
