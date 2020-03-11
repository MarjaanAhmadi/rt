import React, {useState} from 'react';
import {Form, Row} from 'react-bootstrap';
import DatePicker from "react-modern-calendar-datepicker";
import axiosInstance from "../../../config/axios";
import moment from "jalali-moment";
import {useDispatch, useSelector} from "react-redux";
import i18next from "i18next";
import {toast} from "react-toastify";
const ProfitActions = (props) => {
    const dispatch = useDispatch();
    const operators = useSelector(state => state.operators);
    const [filterData, setFilterData] = useState({
        df: '',
        dt: '',
        operator_id: '0'
    });
    const [selectedDayFrom, setSelectedDayFrom] = useState(null);
    const [selectedDayTo, setSelectedDayTo] = useState(null);


    const pad = (num) => {
        return (num < 10) ? '0' + num.toString() : num.toString();
    };
    const submitFilter = async () => {
        if(filterData.operator_id === '0'){
            toast.error('لطفا اپراتور مورد نظر را وارد نمایید.')
        }
        else{
            let df, dt;
            if(selectedDayFrom){
                df = `${selectedDayFrom.year}/${pad(selectedDayFrom.month)}/${pad(selectedDayFrom.day)}`;
                setFilterData({
                    ...filterData,
                    df: df
                });
            }
            if(selectedDayTo) {
                dt = `${selectedDayTo.year}/${pad(selectedDayTo.month)}/${pad(selectedDayTo.day)}`;
                setFilterData({
                    ...filterData,
                    dt: dt
                });
            }
            try {
                const convertData = convertFilter();
                const data = {
                    from_date: moment(convertData.df).format("X"),
                    to_date: moment(convertData.dt).format("X"),
                    operator_id: filterData.operator_id
                };
                await axiosInstance.post('cgrates/v1/api/profits/', data);
                props.updateProfits();
                props.created();
                toast.success(i18next.t('Created'));
            }
            catch (e) {
                console.log(e)
            }
            dispatch({loading: false, type:'SHOW_LOADING'});
        }
    };

    const convertFilter = () => {
        const data = {};

        Object
            .keys(filterData)
            .forEach(key => {
                if (!filterData[key]) {
                    delete filterData[key]
                } else {
                    data[key] = filterData[key]
                }
            });
        if (filterData.df) data.df = moment(filterData.df, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        if (filterData.dt) data.dt = moment(filterData.dt, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');

        return data
    };

    const renderOperators = () => {
        return(
            operators.map((operator, index) => {
                return(
                    <option key={index} value={operator.id}>{operator.operator_code}</option>
                )
            })
        )
    };


    return(
        <React.Fragment>
            <Row>
                <span className='mb-1 pr-3'>{i18next.t('from_date')}:</span>

                <div className='pr-3'>
                    <DatePicker
                        onChange={(event)=>{
                            const date = `${event.year}/${pad(event.month)}/${pad(event.day)}`;
                            setFilterData({
                                ...filterData,
                                df: date
                            });
                            setSelectedDayFrom(event)
                        }}
                        shouldHighlightWeekends
                        isPersian
                        value={selectedDayFrom}

                    />
                </div>
                <span className='mb-1 pr-3'>{i18next.t('to_date')}:</span>

                <div className='pr-3'>

                    <DatePicker
                        onChange={(event)=>{
                            const date = `${event.year}/${pad(event.month)}/${pad(event.day)}`;
                            setFilterData({
                                ...filterData,
                                dt: date
                            });
                            setSelectedDayTo(event)
                        }}
                        shouldHighlightWeekends
                        isPersian
                        value={selectedDayTo}

                    />
                </div>
            </Row>
            <hr/>

            <Form.Group>
                    <Form.Label>انتخاب اپراتور</Form.Label>
                    <Form.Control
                        as='select'
                        onChange={(event) => {
                            setFilterData({
                                ...filterData,
                                operator_id: event.target.value
                            })
                        }}
                    >
                        <option value='0'>انتخاب کنید</option>
                        {renderOperators()}
                    </Form.Control>
                </Form.Group>
            <span className='btn-custom' onClick={submitFilter}>
                {i18next.t('create')}
            </span>
        </React.Fragment>

    )
};
export default ProfitActions;
