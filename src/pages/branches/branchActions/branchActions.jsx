import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Col, Form, Row} from "react-bootstrap";
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import { Multiselect } from 'multiselect-react-dropdown';
import {forEach} from "react-bootstrap/cjs/utils/ElementChildren";
import './branchActions.css';
const OperatorActions = (props) => {
    const destinations = useSelector(state => state.destinations)
    const [form, setForm] = useState({
        branch_code: '',
        branch_name: '',
        destination_names: []
    });

    const [error, setError] = useState({
        branchCode: false,
        branchName: false,
        destinationNames: []
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

        if(form.branch_code === '') {
            hasError = true;
            setError({
                ...error,
                branchCode: true
            })
        }
        if(form.branch_name === '') {
            hasError = true;
            setError({
                ...error,
                branchName: true
            })
        }
        if (hasError) return false;
        else return true;
    };


    const editBranch = async () => {
        if(checkValidations()){
            try {
                const data = {
                    branch_code: form.branch_code,
                    branch_name: form.branch_name,
                    destination_names: currentSelectedValue.list
                };
                const response = await axiosInstance.patch(`/cgrates/v1/api/branches/${props.branch.id}/`, data);
                props.getBranches();
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
    const createBranch = async () => {
        if(checkValidations()){

            try {
                const data = {
                    branch_code: form.branch_code,
                    branch_name: form.branch_name,
                    destination_names: currentSelectedValue.list
                };
                const response = await axiosInstance.post(`/cgrates/v1/api/branches/`, data);
                props.getBranches();
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

        if(props.branch)
        {
            setForm({
                ...form,
                branch_code: props.branch.branch_code,
                branch_name: props.branch.branch_name,
                destination_names: props.branch.destination

            });

            setSelectedValue({
                ...selectedValue,
                list: props.branch.destination
            });
            let array = props.branch.destination;
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
                        <Form.Label>{i18next.t('branch_code')}</Form.Label>
                        <Form.Control
                            readOnly={!props.edit ? false : true}
                            value={form.branch_code}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    branch_code: event.target.value
                                })
                            }}
                        />
                        {error.branchCode ? (
                            <span className="text-danger error">
                              {i18next.t("")}
                            </span>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>{i18next.t('branch_name')}</Form.Label>
                        <Form.Control
                            value={form.branch_name}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    branch_name: event.target.value
                                })
                            }}
                        />
                        {error.branchName ? (
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
                            selectedValues={props.branch ? props.branch.destination : []} // Preselected value to persist in dropdown
                            onSelect={(event) => {onSelect(event)}} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />
                    </Col>
                </Row>
            </Form>
            <span className='btn-custom pointer' onClick={props.edit ? editBranch : createBranch}>{props.edit ? i18next.t('edit') : i18next.t('create')}</span>

        </React.Fragment>
    )
}
export default OperatorActions;
