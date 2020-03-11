import React, {useState} from "react";
import {Form, Row} from "react-bootstrap";
import DatePicker from "react-modern-calendar-datepicker";
import './advancedSearch.css';
import {useDispatch} from "react-redux";
import axiosInstance from "../../../config/axios";
import moment from "jalali-moment";
import TimePicker from 'rc-time-picker';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const AdvancedSearch = () => {

    const format = 'h:mm a';

    const now = moment().hour(0).minute(0);

    const dispatch = useDispatch();
    const [selectedDayFrom, setSelectedDayFrom] = useState(null);
    const [selectedDayTo, setSelectedDayTo] = useState(null);
    const [filterData, setFilterData] = useState({
            nf: '',
            nt: '',
            lf: '',
            lt: '',
            df: '',
            dt: '',
            tf: '',
            tt: ''
    });
    const pad = (num) => {
        return (num < 10) ? '0' + num.toString() : num.toString();
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

        moment("1398-08-09").format('YYYY-MM-DD');
        if (filterData.df) data.df = moment(filterData.df, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        if (filterData.dt) data.dt = moment(filterData.dt, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');

        if (filterData.tf) {
            const totalMinutes = parseInt(filterData.tf.slice(0, 2)) * 60 + parseInt(filterData.tf.slice(3, 5));

            if (filterData.tf.slice(0, 2)) data.hf = ~~(totalMinutes / 60)
            if (filterData.tf.slice(3, 5)) data.mf = (totalMinutes % 60)
            delete data.tf
        }

        if (filterData.tt) {
            const totalMinutes = parseInt(filterData.tt.slice(0, 2)) * 60 + parseInt(filterData.tt.slice(3, 5))

            if (filterData.tt.slice(0, 2)) data.ht = ~~(totalMinutes / 60)
            if (filterData.tt.slice(3, 5)) data.mt = (totalMinutes % 60)
            delete data.tt
        }
        return data
    };

    const submitFilter = async () => {
        dispatch({loading: true, type:'SHOW_LOADING'});
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
            const response = await axiosInstance.get('/cdr/api/', {params: convertFilter()});
            dispatch({cdrs: response.data.data, type: 'SET_CDRS'})
        }
        catch (e) {
            console.log(e)
        }
        dispatch({loading: false, type:'SHOW_LOADING'});
    };


    return(
       <React.Fragment>
           <Row>
              < div className='inputs'>
                  <Form.Control
                      placeholder="تماس از"
                      value={filterData.nf}
                      onChange={(event) => {
                          setFilterData({
                              ...filterData,
                              nf: event.target.value
                          })
                      }}
                  />
              </div>
               < div className='inputs'>
                   <Form.Control
                       placeholder="تماس به"
                       value={filterData.nt}
                       onChange={(event) => {
                           setFilterData({
                               ...filterData,
                               nt: event.target.value
                           })
                       }}
                   />
               </div>
               < div className='inputs'>
                   <Form.Control
                       placeholder="طول تماس از"
                       value={filterData.lf}
                       onChange={(event) => {
                           setFilterData({
                               ...filterData,
                               lf: event.target.value
                           })
                       }}
                   />
               </div>
               < div className='inputs'>
                   <Form.Control
                       placeholder="طول تماس تا"
                       value={filterData.lt}
                       onChange={(event) => {
                           setFilterData({
                               ...filterData,
                               lt: event.target.value
                           })
                       }}

                   />
               </div>
               < div className='inputs'>
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

               < div className='inputs'>
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

               < div className='inputs time-picker'>
                   <TimePicker
                       showSecond={false}
                       defaultValue={now}
                       className="xxx"
                       onChange={(value) => {
                           setFilterData({
                               ...filterData,
                               tf: value.format(format)
                           })
                       }}
                       format={format}
                       use12Hours
                       inputReadOnly
                   />
                   {/*<Form.Control*/}
                   {/*    placeholder="از ساعت"*/}
                   {/*    value={filterData.tf}*/}
                   {/*    onChange={(event) => {*/}
                   {/*        setFilterData({*/}
                   {/*            ...filterData,*/}
                   {/*            tf: event.target.value*/}
                   {/*        })*/}
                   {/*    }}*/}

                   {/*/>*/}
               </div>

               < div className='inputs time-picker'>
                   <TimePicker
                       showSecond={false}
                       defaultValue={now}
                       className="xxx"
                       onChange={(value) => {
                           setFilterData({
                               ...filterData,
                               tt: value.format(format)
                           })
                       }}
                       format={format}
                       use12Hours
                       inputReadOnly
                   />
               </div>
               <FontAwesomeIcon className="pointer mt-1 icon-size" icon="search" onClick={submitFilter}/>

               {/*<span onClick={submitFilter} className='btn-custom'>{i18next.t('Search')}</span>*/}
           </Row>

       </React.Fragment>

    )
}
export default AdvancedSearch;
