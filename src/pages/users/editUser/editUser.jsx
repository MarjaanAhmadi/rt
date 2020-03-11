import React, {useEffect, useState} from 'react';
import {Form, Col, InputGroup} from "react-bootstrap";
import axiosInstance from "../../../config/axios";
import i18next from "i18next";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import getUsersList from "../../../mainComponents/getUsersList/getUsersList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const EditUser = (props) => {
    const dispatch = useDispatch();
    const [userEdit, setUserEdit] = useState({
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
        gender: '',
        image_url: '',
        virtual: false,
        disabled: false
    });
    const [passwords, setPasswords] = useState({
        new_password1: '',
        new_password2: ''
    });

    const [passType, setPassType] = useState(false);
    const [repeatPassType, setRepeatPassType] = useState(false);

    const editUserInfo = async () => {
        dispatch({
            loading:true,
            type: 'SHOW_LOADING'
        });
        if(!checkRequiredFields()) {
            try {
                await axiosInstance.put(`/users/api/user/${props.user.id}/`,userEdit );
                if(passwords.new_password1 !== '' && passwords.new_password2 !== '' && passwords.new_password1 === passwords.new_password2)
                    await axiosInstance.put(`/users/api/user/${props.user.id}/set-password/`, passwords);
                props.closeModal();
                toast.success(i18next.t('Edited'));
                const users = await getUsersList();

                dispatch({users, type: 'SET_USERS'});
            }
            catch (e) {
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
                            }if('email' in item){
                                setValidateEmail({
                                    ...validateEmail,
                                    email: true
                                })
                            }
                        })

                    }
                }
            }
        }

        dispatch({
            loading:false,
            type: 'SHOW_LOADING'
        })

    }

    const setSelectedUser = () => {
        setUserEdit({
            ...userEdit,
            is_active: props.user.is_active,
            first_name: props.user.first_name,
            ascii_name: props.user.ascii_name,
            last_name: props.user.last_name,
            username: props.user.username,
            email: props.user.email,
            job_title: props.user.job_title,
            address: props.user.address,
            mobile_number: props.user.mobile_number,
            birthday: null,
            gender: props.user.gender,
            image_url: props.user.image_url,
            virtual: props.user.virtual,
            disabled: props.user.disabled
        })
    }
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

    const checkRequiredFields = () => {
        let error = false;
        if(userEdit.first_name === ''){
            setFirstNameValidation({...validateFirstName, first_name: true});
            error=true;
        }
        if(userEdit.email === ''){
            setValidateEmail({...validateEmail, email: true});
            error=true;
        }
        if(userEdit.last_name === '') {
            setLastNameValidation({...validateLastName, last_name: true});
            error=true;
        }
        if(userEdit.username === '') {
            setValidateUsername({...validateUsername, username: true});
            error=true;
        }
        if(userEdit.ascii_name === '') {
            setValidateAsciName({...validateAsciName, ascii_name: true});
            error=true;
        }
        if(userEdit.mobile_number === '') {
            setValidateMobileNumber({...validateMobileNumber, mobile_number: true});
            error=true;
        }
        if(passwords.new_password1 !== '' && passwords.new_password1 !== passwords.new_password2){
            setValidateRepeatPassword({...validateRepeatPassword, repeatPassword: true});
            error = true;
        }
        if(error === true) return true;
        else return false;
    }


    useEffect(()=>{
        setSelectedUser();
    },[]);
    return(
        <React.Fragment>
            <Form>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('Username')}
                        </Form.Label>
                        <Form.Control value={userEdit.username}
                                      onChange={(event) => {
                                          setValidateUsername({
                                              ...validateUsername,
                                              username: false,
                                              duplicateUsername: false
                                          })
                                          setUserEdit({
                                              ...userEdit,
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
                        <Form.Control value={userEdit.ascii_name}

                                      onChange={(event) => {
                                          setValidateAsciName({
                                              ...validateAsciName,
                                              ascii_name: false
                                          })
                                          setUserEdit({
                                              ...userEdit,
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
                            value={userEdit.first_name}
                            onChange={(event) => {
                                setFirstNameValidation({
                                    ...validateFirstName,
                                    first_name: false
                                })
                                setUserEdit({
                                    ...userEdit,
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
                            value={userEdit.last_name}
                            onChange={(event) => {
                                setLastNameValidation({
                                    ...validateLastName,
                                    last_name: false
                                })
                                setUserEdit({
                                    ...userEdit,
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
                            value={userEdit.email}
                            onChange={(event) => {
                                setValidateEmail({
                                    ...validateEmail,
                                    email: false
                                })
                                setUserEdit({
                                    ...userEdit,
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
                                          setUserEdit({
                                              ...userEdit,
                                              gender: event.target.value
                                          })
                                      }}>
                            <option selected={userEdit.gender === 'M'} value='M'>{i18next.t('male')}</option>
                            <option selected={userEdit.gender === 'F'} value='F'>{i18next.t('female')}</option>

                        </Form.Control>
                    </Form.Group>



                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>
                            {i18next.t('address')}
                        </Form.Label>
                        <Form.Control
                            value={userEdit.address}
                            onChange={(event) => {
                                setUserEdit({
                                    ...userEdit,
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
                            value={userEdit.mobile_number}
                            onChange={(event) => {
                                setValidateMobileNumber({
                                    ...validateMobileNumber,
                                    mobile_number: false,
                                    mobileNumberFormat: false
                                })
                                setUserEdit({
                                    ...userEdit,
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
                {/*        userEdit({*/}
                {/*            ...userEdit,*/}
                {/*            birthday: value*/}
                {/*        })*/}
                {/*    }}*/}
                {/*    timePicker={false} />*/}
            </Form>


            <span onClick={editUserInfo} className='btn-custom'>{i18next.t('edit')}</span>

        </React.Fragment>
    )
}
export default EditUser;
