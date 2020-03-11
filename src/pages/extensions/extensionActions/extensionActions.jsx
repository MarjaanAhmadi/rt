import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Row, Col, Form} from "react-bootstrap";
import { Multiselect } from 'multiselect-react-dropdown';
import users from "../../users/users";
import './extensionActions.css';
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import currency from "../../../filtering/currency";

const ExtensionActions = (props) => {
    const dispatch = useDispatch();
    const conditionalList = useSelector(state => state.conditionalList);
    const calenders = useSelector(state => state.calenders);
    const greetings = useSelector(state => state.generalResources);
    const endpoints = useSelector(state => state.endpoints);
    const gateways = useSelector(state => state.gateways);
    const businessWeeks = useSelector(state => state.weeks);
    const users = useSelector(state => state.users);

    // if(props.extension.inbox_enabled)
    //     li.push(
    //         {
    //             text: 'صندوق پیام',
    //             value: 'inbox_enabled'
    //         }
    //     );
    // if(props.extension.record_all)
    //     li.push(
    //         {
    //             text: 'تماس‌‌ها ضبط شوند؟',
    //             value: 'record_all'
    //         }
    //     );
    // if(props.extension.show_contacts)
    //     li.push(
    //         {
    //             text: 'مشاهده مخاطبین',
    //             value: 'show_contacts'
    //         }
    //     )

    const [showModal, setShowModal] = useState(false);
    const [settingValuesAdd, setSettingValuesAdd] = useState({list: []});


    const [createForm, setCreateForm] = useState({
            user: '0',
            business_week: '',
            gateway: '',
            endpoint: '',
            password: '',
            callerid: '',
            ring_seconds: 90,
            extension_number: '',
            enabled: true,
            record_all: false,
            web_enabled: true,
            show_contacts: false,
            inbox_enabled: false,
            conditional_list: '',
            external_call_enable: false,
            destination_type_off: 'end',
            destination_type_in_list: 'end',
            destination_type_no_answer: 'end',
            destination_number_off: '',
            destination_number_in_list: '',
            destination_number_no_answer: '',
            status: ''
    });

    const [callToOut, setCallToOut] = useState(false);
    const [inbox, setInbox] = useState({
            pin_enabled: true,
            be_callerid_played: false,
            be_datetime_played: false,
            greeting_file: '',
            on_message_notification: 'no',
            pin: ''
    });
    const [settings, setSettings] = useState({
       list: [
           {
               text: 'صندوق پیام',
               value: 'inbox_enabled'
           },
           {
               text: 'تماس‌‌ها ضبط شوند؟',
               value: 'record_all'
           },
           {
               text: 'مشاهده مخاطبین',
               value: 'show_contacts'
           }
       ]
    });

    const [destinationTypeItems, setDestinationTypeItems] = useState({list: [
            {
                value: 'end',
                text: 'پایان تماس'
            },
            {
                value: 'extension',
                text: 'اتصال به داخلی'
            },
            {
                value: 'ringgroup',
                text: 'اتصال به گروه تماس'
            },
            {
                value: 'queue',
                text: 'اتصال به صف تماس'
            },
            {
                value: 'ivr',
                text: 'اتصال به پاسخگوی خودکار'
            },
            {
                value: 'inbox',
                text: 'انتقال به صندوق پیام',
                isDisabled: true
            },
            {
                value: 'out',
                text: 'انتقال به شماره خارجی'
            }
        ]});
    const [routes, setRouteTypes] = useState({
        off: [],
        inList: [],
        noAnswer: []
    });

    const closeModal = () => {
        setShowModal(false)
    }

    const [error, setError] = useState({
        user: false,
        extensionNumber: false,
        callerId: false,
        ringTime: false,
        callToOut: false
    });
    const addToSettingsList = (optionsList, selectedItem) => {
        switch(selectedItem.value){
            case 'inbox_enabled' : setCreateForm({
                                        ...createForm,
                                        inbox_enabled: true
                                    });
                break;
            case 'record_all' : setCreateForm({
                                        ...createForm,
                                        record_all: true
                                    });
                break;
            case 'show_contacts' : setCreateForm({
                                            ...createForm,
                                            show_contacts: true
                                        });
                break;
        }

    };


    const removeFromSettingsList = (optionsList, selectedItem) => {
        switch(selectedItem.value){
            case 'inbox_enabled' : setCreateForm({
                ...createForm,
                inbox_enabled: false
            });
                break;
            case 'record_all' : setCreateForm({
                ...createForm,
                record_all: false
            });
                break;
            case 'show_contacts' : setCreateForm({
                ...createForm,
                show_contacts: false
            });
                break;
        }
    };
    const renderItems = (type) => {
        switch (type) {
            case 'users':
                return(
                    users.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {`${item.first_name} ${item.last_name}`}
                            </option>
                        )
                    })
                );
                break;
            case 'endpoints':
                return(
                    endpoints.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.mac_address}
                            </option>
                        )
                    })
                );
                break;
            case 'weeks':
                return(
                    businessWeeks.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        )
                    })
                );
                break;
            case 'settings':
                return(
                    settings.map((item, index) => {
                        return(
                            <option key={index} value={item.value}>
                                {item.text}
                            </option>
                        )
                    })
                );
                break;
            case 'gateways':
                return(
                    gateways.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.main_number}
                            </option>
                        )
                    })
                );
                break;
            case 'conditionalList' :
                return(
                    conditionalList.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        )
                    })
                );
                break;
            case 'destinationTypeItems':
                return(
                    destinationTypeItems.list.map((item, index) => {
                        return(
                            <option key={index} value={item.value}>
                                {item.text}
                            </option>
                        )
                    })
                );
                break;
            case 'routing':
                return(

                    routes.inList.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.number}
                            </option>
                        )
                    })
                );
                break;
            case 'routingOff':
                return(

                    routes.off.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.number}
                            </option>
                        )
                    })
                );
                break;
            case 'noAnswer':

                return(

                    routes.noAnswer.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.number}
                            </option>
                        )
                    })
                );
                break;
            case 'greetings':
                return(

                    greetings.map((item, index) => {
                        return(
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        )
                    })
                );
                break;

        }
    };
    const fetchRouteNumbers = async (item, val) => {
        switch(item){
            case null :
            {
                const response = await axiosInstance.get(`/extension/api/route_numbers`, {params: {route_type: val}});
                setRouteTypes({
                    ...routes,
                    inList: response.data.data
                });
                break;
            }
            case 'off':
            {
                const response = await axiosInstance.get(`/extension/api/route_numbers`, {params: {route_type: val}});
                setRouteTypes({
                    ...routes,
                    off: response.data.data
                });
                break;
            }
            case 'noAnswer':
            {
                const response = await axiosInstance.get(`/extension/api/route_numbers`, {params: {route_type: val}});
                setRouteTypes({
                    ...routes,
                    noAnswer: response.data.data
                });
                break;
            }
        }
    };
    const sendInbox = async (id) => {
        try {
            let data = inbox;
            Object.assign({ extension: id }, data);
            await axiosInstance.post('/extension/api/inbox', {data});
        }
        catch(e){
            console.log(e);
        }
    };
    const sendProvisionEndpoint = async () => {
        const response = await axiosInstance.get(`/endpoint/api/endpoint/${createForm.endpoint}/provision/`)
    };
    const editExtension = async () => {
       try {
           await axiosInstance.put(`/extension/api/${props.extension.id}`, createForm);
           toast.success('created');
           if(createForm.inbox_enabled ) {
               let inboxStatus = inbox.hasOwnProperty('id')

               if (inboxStatus) {
                   await sendInbox(inbox.id)
               } else {
                   await sendInbox(createForm.id)
               }
           }
           props.updateExtensionList();
           setShowModal(false);
           if(createForm.endpoint){
               await sendProvisionEndpoint()
           }
       }

        catch (e) {
            if(e.response.data.status == 400 && e.response.data.error.length !== 0){
                toast.error(i18next.t('duplicate_extension_number'))
            }
        }
    };
    const checkValidations = () => {
        let hasError = false;
        if(createForm.user === '')
            setError({
                ...error,
                user: true
            });
        if(createForm.extension_number === '')
            setError({
                ...error,
                extensionNumber: true
            });
        if(createForm.callerid === '')
            setError({
                ...error,
                callerId: true
            });
        if(createForm.ring_seconds === '')
            setError({
                ...error,
                ringTime: true
            });
        if(createForm.gateway === '')
            setError({
                ...error,
                callToOut: true
            });
    };

    const createExtension = async() => {
        checkValidations();
        try {
                const response = await axiosInstance.post('/extension/api/', createForm);
                toast.success('created');
                let extensionId = response.data.data.id;
                if(createForm.inbox_enabled ) {
                    await sendInbox(extensionId);
                }
                props.updateExtensionList();
                setShowModal(false);

            if(createForm.endpoint){
                   await sendProvisionEndpoint()
                }
        }
        catch (e) {

                console.log(e)
            if(e.response.data.status === 400 && e.response.data.error.length !== 0){
                toast.error(i18next.t('duplicate_extension_number'))
            }
        }
    };

    const generatePassword = () => {
        const password = Math.random().toString(36).slice(-13)
        setCreateForm({
            ...createForm,
            password: password.replace('.', '')
        })

    };
    const getInboxItem =async () => {
        const response = await axiosInstance.get(`/extension/api/inbox/${props.extension.id}/inbox/details/`);
        setInbox({
            ...inbox,
            pin_enabled: response.data.data.pin_enabled,
            be_callerid_played: response.data.data.be_callerid_played,
            be_datetime_played: response.data.data.be_datetime_played,
            greeting_file: response.data.data.greeting_file,
            on_message_notification: response.data.data.on_message_notification,
            pin: response.data.data.pin

        })
    };

    useEffect(() => {

        if(props.extension) {
            if(props.extension.destination_number_no_answer !== null) fetchRouteNumbers('noAnswer', props.extension.destination_type_no_answer) ;
            if(props.extension.destination_number_in_list !== null) fetchRouteNumbers('inList', props.extension.destination_type_in_list) ;
            if(props.extension.destination_number_off !== null) fetchRouteNumbers('off', props.extension.destination_type_off) ;
            setCreateForm({
                ...createForm,
                user: props.extension.user.id,
                business_week: props.extension.business_week,
                gateway: props.extension.gateway,
                endpoint: props.extension.endpoint,
                password: props.extension.password,
                callerid: props.extension.callerid,
                ring_seconds: 90,
                extension_number: props.extension.extension_number,
                enabled: props.extension.enabled,
                record_all: props.extension.record_all,
                web_enabled: props.extension.web_enabled,
                show_contacts: props.extension.show_contacts,
                inbox_enabled: props.extension.inbox_enabled,
                conditional_list: props.extension.conditional_list,
                external_call_enable: props.extension.external_call_enable,
                destination_type_off: props.extension.destination_type_off,
                destination_type_in_list: props.extension.destination_type_in_list,
                destination_type_no_answer: props.extension.destination_type_no_answer,
                destination_number_off: props.extension.destination_number_off,
                destination_number_in_list: props.extension.destination_number_in_list,
                destination_number_no_answer: props.extension.destination_number_no_answer,
                status: props.extension.status
            });
            getInboxItem()

        }
        else {
            generatePassword();
        }
    },[]);
    return(
        <React.Fragment>

            <Form>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>انتخاب کاربر</Form.Label>
                        <Form.Control
                            as='select'
                            value={createForm.user}
                            onChange={(event) => {
                                setCreateForm({
                                    ...createForm,
                                    user: event.target.value
                                })
                            }}
                        >
                            {renderItems('users')}
                            <option selected value={0}>
                                انتخاب کنید...
                            </option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>داخلی را وارد نمایید</Form.Label>
                        <Form.Control
                            value={createForm.extension_number}
                            onChange={(event) => {
                                setCreateForm({
                                    ...createForm,
                                    extension_number: event.target.value
                                })
                            }}
                        />
                    </Form.Group>
                    {/*<Form.Group as={Col}>*/}
                    {/*    <Form.Label>انتخاب تلفن</Form.Label>*/}
                    {/*    <Form.Control*/}
                    {/*        as='select'*/}
                    {/*        value={createForm.endpoint}*/}
                    {/*        onChange={(event) => {*/}
                    {/*            setCreateForm({*/}
                    {/*                ...createForm,*/}
                    {/*                endpoint: event.target.value*/}
                    {/*            })*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        {renderItems('endpoints')}*/}
                    {/*    </Form.Control>*/}
                    {/*</Form.Group>*/}
                    </Row>
                    <Row>


                        <Form.Group as={Col}>
                            <Form.Label>Caller ID</Form.Label>
                            <Form.Control
                                value={createForm.callerid}
                                onChange={(event) => {
                                    setCreateForm({
                                        ...createForm,
                                        callerid: event.target.value
                                    })
                                }}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>
                                تماس بیرون سازمانی
                            </Form.Label>
                            <Form.Control
                                as='select'
                                value={createForm.gateway}
                                onChange={(event) => {
                                    setCreateForm({
                                        ...createForm,
                                        gateway: event.target.value,
                                        external_call_enable: true
                                    })
                                }}
                            >
                                {renderItems('gateways')}
                            </Form.Control>
                        </Form.Group>

                    </Row>
                    <Row>

                        <Form.Group as={Col}>
                            <Form.Label>رمز SIP</Form.Label>
                            <Form.Control
                                value={createForm.password}
                                onChange={(event) => {
                                    setCreateForm({
                                        ...createForm,
                                        password: event.target.value
                                    })
                                }}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>چند ثانیه زنگ بخورد</Form.Label>
                            <Form.Control
                                value={createForm.ring_seconds}
                                onChange={(event) => {
                                    setCreateForm({
                                        ...createForm,
                                        ring_seconds: event.target.value
                                    })
                                }}
                            >
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    {/*<Row>*/}

                {/*        <Form.Group as={Col}>*/}
                {/*            <Form.Label>هفته کاری</Form.Label>*/}
                {/*            <Form.Control*/}
                {/*                as='select'*/}
                {/*                value={createForm.business_week}*/}
                {/*                onChange={(event) => {*/}
                {/*                    setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        business_week: event.target.value*/}
                {/*                    })*/}
                {/*                }}*/}
                {/*            >*/}
                {/*                <option value='0'>ندارد</option>*/}
                {/*                {renderItems('weeks')}*/}
                {/*            </Form.Control>*/}
                {/*        </Form.Group>*/}


                {/*    </Row>*/}
                {/*    <Row>*/}
                {/*        <Col sm={12} lg={6}>*/}
                {/*            <Form.Label>*/}
                {/*                تنظیمات پیشرفته*/}
                {/*            </Form.Label>*/}
                {/*            <Multiselect*/}
                {/*                options={settings.list} // Options to display in the dropdown*/}
                {/*                selectedValues={li} // Preselected value to persist in dropdown*/}
                {/*                placeholder={i18next.t('Choose')}*/}
                {/*                displayValue="text" // Property name to display in the dropdown options*/}
                {/*                onSelect={addToSettingsList}*/}
                {/*                onRemove={removeFromSettingsList}*/}
                {/*            />*/}
                {/*        </Col>*/}
                {/*        <Form.Group as={Col}>*/}
                {/*            <Form.Label>انتخاب لیست</Form.Label>*/}
                {/*            <Form.Control*/}
                {/*                as='select'*/}
                {/*                value={createForm.conditional_list}*/}
                {/*                onChange={(event) =>{*/}
                {/*                    setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        conditional_list: event.target.value*/}
                {/*                    });*/}
                {/*                }}*/}

                {/*            >*/}
                {/*                {renderItems('conditionalList')}*/}
                {/*            </Form.Control>*/}
                {/*        </Form.Group>*/}
                {/*    </Row>*/}
                {/*{*/}
                {/*    createForm.inbox_enabled ?*/}
                {/*            <Row>*/}
                {/*                <Form.Group as={Col}>*/}
                {/*                    <Form.Label>پین را وارد کنید</Form.Label>*/}
                {/*                    <Form.Control*/}
                {/*                        value={inbox.pin}*/}
                {/*                        onChange={(event) =>{*/}
                {/*                            setInbox({*/}
                {/*                                ...inbox,*/}
                {/*                                pin: event.target.value*/}
                {/*                            });*/}
                {/*                        }}*/}

                {/*                    >*/}
                {/*                    </Form.Control>*/}
                {/*                </Form.Group>*/}
                {/*                <Form.Group as={Col}>*/}
                {/*                    <Form.Label>انتخاب پیام پیشواز</Form.Label>*/}
                {/*                    <Form.Control*/}
                {/*                        as='select'*/}
                {/*                        value={inbox.greeting_file}*/}
                {/*                        onChange={(event) =>{*/}
                {/*                            setInbox({*/}
                {/*                                ...inbox,*/}
                {/*                                greeting_file: event.target.value*/}
                {/*                            });*/}
                {/*                        }}*/}

                {/*                    >*/}
                {/*                        {renderItems('greetings')}*/}
                {/*                    </Form.Control>*/}
                {/*                </Form.Group>*/}
                {/*            </Row>*/}
                {/*        : null*/}
                {/*}*/}
                {/*    <Row>*/}
                {/*        <Form.Group as={Col}>*/}
                {/*            <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*            <Form.Control*/}
                {/*                as='select'*/}
                {/*                value={createForm.destination_type_in_list}*/}
                {/*                onChange={(event) =>{*/}
                {/*                    setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        destination_type_in_list: event.target.value*/}
                {/*                    });*/}
                {/*                   fetchRouteNumbers(null,event.target.value)*/}
                {/*                }}*/}

                {/*            >*/}
                {/*                {renderItems('destinationTypeItems')}*/}
                {/*            </Form.Control>*/}
                {/*        </Form.Group>*/}
                {/*        {*/}
                {/*                createForm.destination_type_in_list &&*/}
                {/*                createForm.destination_type_in_list !== '' &&*/}
                {/*                createForm.destination_type_in_list !== 'end' &&*/}
                {/*                createForm.destination_type_in_list !== 'out'*/}
                {/*                    ?*/}
                {/*            <Form.Group as={Col}>*/}
                {/*                <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*                <Form.Control*/}
                {/*                    as='select'*/}
                {/*                    value={createForm.destination_number_in_list}*/}
                {/*                    onChange={(event) =>setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        destination_number_in_list: event.target.value*/}
                {/*                    }) }*/}
                {/*                >*/}
                {/*                    {renderItems('routing')}*/}
                {/*                </Form.Control>*/}
                {/*            </Form.Group>*/}
                {/*                : createForm.destination_type_in_list === 'out' ?*/}
                {/*                    <Form.Group as={Col}>*/}
                {/*                        <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*                        <Form.Control*/}
                {/*                            value={createForm.destination_number_in_list}*/}
                {/*                            onChange={(event) =>setCreateForm({*/}
                {/*                                ...createForm,*/}
                {/*                                destination_number_in_list: event.target.value*/}
                {/*                            }) }*/}
                {/*                        >*/}
                {/*                        </Form.Control>*/}
                {/*                    </Form.Group>*/}
                {/*                    : null*/}
                {/*        }*/}
                {/*    </Row>*/}
                {/*<Row>*/}
                {/*    <Form.Group as={Col}>*/}
                {/*        <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*        <Form.Control*/}
                {/*            as='select'*/}
                {/*            value={createForm.destination_type_off}*/}
                {/*            onChange={(event) =>{*/}
                {/*                setCreateForm({*/}
                {/*                    ...createForm,*/}
                {/*                    destination_type_off: event.target.value*/}
                {/*                });*/}
                {/*                fetchRouteNumbers('off',event.target.value) ;*/}
                {/*            }}*/}

                {/*        >*/}
                {/*            {renderItems('destinationTypeItems')}*/}
                {/*        </Form.Control>*/}
                {/*    </Form.Group>*/}
                {/*    {*/}
                {/*        createForm.destination_type_off &&*/}
                {/*        createForm.destination_type_off !== '' &&*/}
                {/*        createForm.destination_type_off !== 'end' &&*/}
                {/*        createForm.destination_type_off !== 'out'*/}
                {/*            ?*/}

                {/*        <Form.Group as={Col}>*/}
                {/*                <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*                <Form.Control*/}
                {/*                    as='select'*/}
                {/*                    value={createForm.destination_number_off}*/}
                {/*                    onChange={(event) =>setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        destination_number_off: event.target.value*/}
                {/*                    }) }*/}
                {/*                >*/}
                {/*                    {renderItems('routingOff')}*/}
                {/*                </Form.Control>*/}
                {/*            </Form.Group>*/}
                {/*            : createForm.destination_type_off === 'out' ?*/}
                {/*            <Form.Group as={Col}>*/}
                {/*                <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*                <Form.Control*/}
                {/*                    value={createForm.destination_number_off}*/}
                {/*                    onChange={(event) =>setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        destination_number_off: event.target.value*/}
                {/*                    }) }*/}
                {/*                >*/}
                {/*                </Form.Control>*/}
                {/*            </Form.Group>*/}
                {/*            : null*/}
                {/*    }*/}
                {/*</Row>*/}
                {/*<Row>*/}
                {/*    <Form.Group as={Col}>*/}
                {/*        <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*        <Form.Control*/}
                {/*            as='select'*/}
                {/*            value={createForm.destination_type_no_answer}*/}
                {/*            onChange={(event) =>{*/}
                {/*                setCreateForm({*/}
                {/*                    ...createForm,*/}
                {/*                    destination_type_no_answer: event.target.value*/}
                {/*                });*/}
                {/*                fetchRouteNumbers('noAnswer',event.target.value)*/}
                {/*            }}*/}

                {/*        >*/}
                {/*            {renderItems('destinationTypeItems')}*/}
                {/*        </Form.Control>*/}
                {/*    </Form.Group>*/}
                {/*    {*/}
                {/*        createForm.destination_type_no_answer &&*/}
                {/*        createForm.destination_type_no_answer !== '' &&*/}
                {/*        createForm.destination_type_no_answer !== 'end' &&*/}
                {/*        createForm.destination_type_no_answer !== 'inbox'*/}
                {/*            ?*/}
                {/*            <Form.Group as={Col}>*/}
                {/*                <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*                <Form.Control*/}
                {/*                    as='select'*/}
                {/*                    value={createForm.destination_number_no_answer}*/}
                {/*                    onChange={(event) =>setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        destination_number_no_answer: event.target.value*/}
                {/*                    }) }*/}
                {/*                >*/}
                {/*                    {renderItems('noAnswer')}*/}
                {/*                </Form.Control>*/}
                {/*            </Form.Group>*/}
                {/*            : createForm.destination_type_no_answer === 'out' ?*/}
                {/*            <Form.Group as={Col}>*/}
                {/*                <Form.Label>{i18next.t('listFunctionality')}</Form.Label>*/}
                {/*                <Form.Control*/}
                {/*                    value={createForm.destination_number_no_answer}*/}
                {/*                    onChange={(event) =>setCreateForm({*/}
                {/*                        ...createForm,*/}
                {/*                        destination_number_no_answer: event.target.value*/}
                {/*                    }) }*/}
                {/*                >*/}
                {/*                </Form.Control>*/}
                {/*            </Form.Group>*/}
                {/*            : null*/}
                {/*    }*/}
                {/*</Row>*/}
                </Form>
            <span className='btn-custom pointer' onClick={props.edit ? editExtension : createExtension}>{props.edit ? i18next.t('edit') : i18next.t('create')}</span>

        </React.Fragment>
    )
}
export default ExtensionActions;
