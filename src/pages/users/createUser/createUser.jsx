import React, {useState} from 'react';
import {Form, Col, InputGroup} from "react-bootstrap";
import axiosInstance from "../../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import i18next from "i18next";
import {toast} from "react-toastify";
import validateEmailFormat from "../../../filtering/validateEmail";
import getUsersList from "../../../mainComponents/getUsersList/getUsersList";
import FormContext from "react-bootstrap/cjs/FormContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faEyeSlash,
    faEye
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faEyeSlash,
    faEye
)

const CreateUser = (props) => {

    const dispatch = useDispatch();
    const [createForm, setCreateForm] = useState({
        is_active: true,
        first_name: '',
        ascii_name: '',
        last_name: '',
        username: '',
        email: '',
        job_title: '',
        address: '',
        mobile_number: '',
        birthday: null,
        gender: 'M',
        image_url: '',
        virtual: false,
        disabled: false
    });
    const [passwords, setPasswords] = useState({
        new_password1: '',
        new_password2: ''
    });

    const [validateFirstName, setFirstNameValidation] = useState({
        first_name: false
    })
    const [validateLastName, setLastNameValidation] = useState({
        last_name: false
    })
    const [validateUsername, setValidateUsername] = useState({
        username: false,
        duplicateUsername: false
    })
    const [validateMobileNumber, setValidateMobileNumber] = useState({
        mobileNumber: false,
        mobileNumberFormat: false
    })
    const [validateAsciName, setValidateAsciName] = useState({
        ascii_name: false
    })
    const [validateEmail, setValidateEmail] = useState({
        email: false
    })
    const [validatePassword, setValidatePassword] = useState({
        password: false
    })
    const [validateRepeatPassword, setValidateRepeatPassword] = useState({
        repeatPassword: false
    })
    //if pass type or repeat pass type is true it means user can see her/his password
    const [passType, setPassType] = useState(false);
    const [repeatPassType, setRepeatPassType] = useState(false);

    const checkRequiredFields = () => {
        let error = false;
        if(createForm.first_name === ''){
            setFirstNameValidation({...validateFirstName, first_name: true});
            error=true;
        }
        if(createForm.last_name === '') {
            setLastNameValidation({...validateLastName, last_name: true});
            error=true;
        }
        if(createForm.username === '') {
            setValidateUsername({...validateUsername, username: true});
            error=true;
        }
        if(createForm.ascii_name === '') {
            setValidateAsciName({...validateAsciName, ascii_name: true});
            error=true;
        }
        if(createForm.mobile_number === '') {
            setValidateMobileNumber({...validateMobileNumber, mobile_number: true});
            error=true;
        }
        if(passwords.new_password1 === '') {
            setValidatePassword({...validatePassword, password: true});
            error=true;
        }
        if(passwords.new_password2 === '') {
            setValidateRepeatPassword({...validateRepeatPassword, repeatPassword: true});
            error=true;
        }
        if(passwords.new_password2 !== passwords.new_password1){
            setValidateRepeatPassword({...validateRepeatPassword, repeatPassword: true});
            error = true;
        }

        if(createForm.email === '' && !validateEmailFormat(createForm.email))
            setValidateEmail({...validateEmail,email: true})
        if(error === true) return true;
        else return false;
    };


    const createNewUser = async () => {
         ;
        if(!checkRequiredFields()) {
            try {
                const response = await axiosInstance.post(`/users/api/user/`, createForm);
                if (passwords.new_password1 !== '' && passwords.new_password2 !== '' && passwords.new_password1 === passwords.new_password2)
                    await axiosInstance.put(`/users/api/user/${response.data.data.id}/set-password/`, passwords);
                props.created();
                toast.success(i18next.t('Created'));
                const users = await getUsersList();
                dispatch({users, type: 'SET_USERS'});

            } catch (e) {
                if(e.response.status === 400){
                   if(e.response.data.error !== null){
                       e.response.data.error.forEach((item,index)=>{
                           if('username' in item){
                               setValidateUsername({
                                   ...validateUsername,
                                   duplicateUsername: true
                               })
                           }if('mobile_number' in item){
                               setValidateMobileNumber({
                                   ...validateMobileNumber,
                                   mobileNumberFormat: true
                               })
                           }
                       })

                   }
                }
            }
        }
    };
    return(
        <React.Fragment>
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('Username')}
                        </Form.Label>
                        <Form.Control value={createForm.username}
                                      onChange={(event) => {
                                          setValidateUsername({
                                              ...validateUsername,
                                              username: false,
                                              duplicateUsername: false
                                          })
                                          setCreateForm({
                                              ...createForm,
                                              username: event.target.value
                                          })
                                      }}
                                      type="text" ></Form.Control>
                        {validateUsername.username ? (
                            <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                        ) : (
                            ""
                        )}
                        {validateUsername.duplicateUsername ? (
                            <span className="text-danger error">
                              {i18next.t("duplicate_username")}
                            </span>
                        ) : (
                            ""
                        )}

                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('ascii_name')}
                        </Form.Label>
                        <Form.Control value={createForm.ascii_name}

                                      onChange={(event) => {
                                          setValidateAsciName({
                                              ...validateAsciName,
                                              ascii_name: false
                                          })
                                          setCreateForm({
                                              ...createForm,
                                              ascii_name: event.target.value
                                          })
                                      }}
                                      type="text" ></Form.Control>
                        {validateAsciName.ascii_name ? (
                            <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>

                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('name')}
                        </Form.Label>
                        <Form.Control
                            value={createForm.first_name}
                            onChange={(event) => {
                                setFirstNameValidation({
                                    ...validateFirstName,
                                    first_name: false
                                })
                                setCreateForm({
                                    ...createForm,
                                    first_name: event.target.value
                                })
                            }}
                            type="text" >

                        </Form.Control>
                        {validateFirstName.first_name ? (
                            <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('lastName')}
                        </Form.Label>
                        <Form.Control
                            value={createForm.last_name}
                            onChange={(event) => {
                                setLastNameValidation({
                                    ...validateLastName,
                                    last_name: false
                                })
                                setCreateForm({
                                    ...createForm,
                                    last_name: event.target.value
                                })
                            }}
                            type="text" >

                        </Form.Control>
                        {validateLastName.last_name ? (
                            <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('Email')}
                        </Form.Label>
                        <Form.Control
                            value={createForm.email}
                            onChange={(event) => {
                                setValidateEmail({
                                    ...validateEmail,
                                    email: false
                                })
                                setCreateForm({
                                    ...createForm,
                                    email: event.target.value
                                })
                            }}
                            type="email" >

                        </Form.Control>
                        {validateEmail.email ? (
                            <span className="text-danger error">
                              {i18next.t("invalid_email")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('gender')}</Form.Label>
                        <Form.Control as='select'
                                      onChange={(event) => {
                                          setCreateForm({
                                              ...createForm,
                                              gender: event.target.value
                                          })
                                      }}>
                            <option value='M'>{i18next.t('male')}</option>
                            <option value='F'>{i18next.t('female')}</option>

                        </Form.Control>
                    </Form.Group>

                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('address')}
                        </Form.Label>
                        <Form.Control
                            value={createForm.address}
                            onChange={(event) => {
                                setCreateForm({
                                    ...createForm,
                                    address: event.target.value
                                })
                            }}
                            type="text" >

                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('phoneNumber')}
                        </Form.Label>
                        <Form.Control
                            value={createForm.mobile_number}
                            onChange={(event) => {
                                setValidateMobileNumber({
                                    ...validateMobileNumber,
                                    mobile_number: false,
                                    mobileNumberFormat: false
                                })
                                setCreateForm({
                                    ...createForm,
                                    mobile_number: event.target.value
                                })
                            }}
                            type="text" >

                        </Form.Control>
                        {validateMobileNumber.mobile_number ? (
                            <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                        ) : (
                            ""
                        )}
                        {validateMobileNumber.mobileNumberFormat ? (
                            <span className="text-danger error">
                              {i18next.t("invalid_mobile_number")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('Password')}
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text onClick={() => {
                                       (passType === true) ? setPassType(false) : setPassType(true)

                                }}>
                                    <FontAwesomeIcon icon={passType ? 'eye-slash' : 'eye'} />

                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                value={passwords.new_password1}
                                onChange={(event) => {
                                    setValidatePassword({
                                        ...validatePassword,
                                        password: false
                                    })
                                    setPasswords({
                                        ...passwords,
                                        new_password1: event.target.value
                                    })
                                }}
                                type={passType ? 'text' : 'password'}
                            >

                            </Form.Control>

                        </InputGroup>

                        {validatePassword.password ? (
                            <span className="text-danger error">
                              {i18next.t("requiredField")}
                            </span>
                        ) : (
                            ""
                        )}

                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('repeatCurrentPass')}
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text onClick={() => {
                                    setRepeatPassType(!repeatPassType);
                                }}>
                                    <FontAwesomeIcon icon={repeatPassType ? 'eye-slash' : 'eye'} />

                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                            value={passwords.new_password2}
                            onChange={(event) => {
                                setValidateRepeatPassword({
                                    ...validateRepeatPassword,
                                    repeatPassword: false
                                })
                                setPasswords({
                                    ...passwords,
                                    new_password2: event.target.value
                                })
                            }}
                            type={repeatPassType ? 'text' : 'password'}
                        >

                        </Form.Control>
                        </InputGroup>
                        {validateRepeatPassword.repeatPassword ? (
                            <span className="text-danger error">
                              {i18next.t("repeatPassError")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                </Form.Row>
                {/*{i18next.t('birthday')}*/}
                {/*<DatePicker*/}
                {/*    onClickSubmitButton={(value) => {*/}
                {/*        createForm({*/}
                {/*            ...createForm,*/}
                {/*            birthday: value*/}
                {/*        })*/}
                {/*    }}*/}
                {/*    timePicker={false} />*/}
            </Form>


            <span onClick={createNewUser} className='btn-custom pointer'>{i18next.t('create')}</span>
        </React.Fragment>
    )
}
export default CreateUser;
