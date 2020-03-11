import React, {useEffect, useState} from 'react';
import C3Chart from 'react-c3js';
import {useDispatch, useSelector} from "react-redux";
import axiosInstance from "../../config/axios";
import './chart.css';
const Chart = (props) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const [data, setData] = useState({
        columns: [],
        type : 'pie',
        colors: {
            'اعتبار پایه فعلی': '#818181',
            'اعتبار پایه مصرفی' : '#6610f2'
        },
        tooltip: { format: { value: function (value, ratio, id) { return (value).formatSomehow(); } } }
    });

    const setHeader = () => {
        if (token)
            axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
    };
    const getBaseBalanceInfo = async () => {
        dispatch({loading:true, type: 'SHOW_LOADING'})

        try {
            //request to get list
            const response = await axiosInstance.get('/gateway/api/gateway/',
                {
                    params:
                        {main_number: props.mainNumber}
                });
            //change main numbers state
            setData({
                ...data,
                columns: [
                    ['اعتبار پایه فعلی', response.data.data[0].current_balance],
                    ['اعتبار پایه مصرفی', response.data.data[0].used_balance]
                ]
            })
        }
        catch (e) {
            console.log(e)
        }
        dispatch({loading:false, type: 'SHOW_LOADING'})


    };
    useEffect(() => {
        setHeader();
        getBaseBalanceInfo();
    },[])
    return(

        <C3Chart pie={true} data={data} />
    )
}
export default Chart;
