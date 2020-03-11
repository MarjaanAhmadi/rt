import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";
import {Form, InputGroup, Table} from "react-bootstrap";
import SingleProfit from "../../profits/singleprofit/singleProfit";
import SingleDestination from "../../destination/singleDestination/singleDestination";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const OperatorItem = props => {
    const [operator, setOperator] = useState({});
    const [profits, setProfits] = useState({list: []});
    const [destinations, setDestinations] = useState({list: []});
    const [filter, setFilter] = useState({
        prefix: '',
        country_code: '',
        code: '',
        name: ''
    });

    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    //should send api to server

    const getSpecificOperator = async () => {
        dispatch({ loading: true, type: "SHOW_LOADING" });
        try {
            const response = await axiosInstance.get(
                `/cgrates/v1/api/operators/${props.match.params.id}`
            );
            debugger
            setOperator(response.data.data);
            setDestinations({
                ...destinations,
                list: response.data.data.destinations
            });
            const profits = await axiosInstance.get('/cgrates/v1/api/profits',{params: {operator_code: response.data.data.operator_code}})

            setProfits({
                ...profits,
                list: profits.data.data
            });
        } catch (e) {
            console.log(e);
        }
        dispatch({ loading: false, type: "SHOW_LOADING" });
    };
    const setHeader = () => {
        if (token)
            axiosInstance.defaults.headers.common["Authorization"] = `JWT ${token}`;
    };

    const getOperatorProfits = async () => {
        dispatch({
            loading: true,
            type: 'SHOW_LOADING'
        });
        try {

        }
        catch (e) {
            console.log(e);
            toast.error(i18next.t('Rejected'));
        }

    };

    const renderProfits = () => {

        if (profits.list.length > 0) {
            return (
                profits.list.map((profit, index) => {
                    return <SingleProfit key={index} profit={profit}/>
                })
            );
        }

        else return(
            <div className="shadow-lg p-3 mb-3 bg-white rounded">
                <p className=" text-center text-secondary">{i18next.t('noDataFounded')}</p>
            </div>
        )

    };

    const renderDestinations = () => {
        if (destinations.list.length > 0) {
            return (
                destinations.list.map((destination, index) => {
                    return <SingleDestination key={index} destination={destination}/>
                })
            );
        }

        else return(
            <div className="shadow-lg p-3 mb-3 bg-white rounded">
                <p className=" text-center text-secondary">{i18next.t('noDataFounded')}</p>
            </div>
        )
    };


    useEffect(() => {
        setHeader();
        getSpecificOperator();
        getOperatorProfits();
    }, []);
    return operator !== undefined ? (
        <React.Fragment>

            <div className='container'>
                <h4>اطلاعات اپراتور</h4>
                <Table striped bordered size="lg">
                    <tbody>
                    <tr>
                        <td>
                            <span className='p-3'>
                                {i18next.t('outbound_rate')}: {Math.floor(operator.outbound_rate)} {i18next.t('rial')}
                            </span>
                        </td>
                        <td>
                        <span className='p-3'>
                             {`${i18next.t('inbound_rate')}: ${Math.floor(operator.outbound_rate)}`} {i18next.t('rial')}
                        </span>
                        </td>
                        <td>
                        <span className='p-3'>
                             {i18next.t('divide_on_percent')}: {operator.divide_on_percent} %
                        </span>
                        </td>


                    </tr>
                    <tr>
                        <td>
                            <span className='p-3'>

                                {`${i18next.t('operator_code')}: ${operator.operator_code}`}

                            </span>
                        </td>
                        <td>
                     <span className='p-3'>
                         {`${i18next.t('rate_time')}: ${operator.rate_time}`} {i18next.t(operator.rate_time_type)}
                     </span>

                        </td>


                    </tr>

                    </tbody>
                </Table>
            </div>
            <hr/>

            <div className="header-item">
                <h5 className="text-secondary mr-3">{i18next.t("profits")}</h5>
            </div>
            <Table responsive className="table-borderless table-hover table-sep p-2">
                <thead className="header-font text-secondary">
                <tr>
                    <th></th>
                    <th >
                        {i18next.t("operator_code")}
                    </th>
                    <th>
                        {i18next.t("outbound_cost_first_part")}
                    </th>
                    <th>
                        {i18next.t("outbound_cost_second_part")}
                    </th>
                    <th>
                        {i18next.t("inbound_cost_first_part")}
                    </th>
                    <th>
                        {i18next.t("inbound_cost_second_part")}
                    </th>
                    <th>
                        {i18next.t("used_percent")}
                    </th>
                    <th>
                        {i18next.t("from_date")}
                    </th>
                    <th>
                        {i18next.t("to_date")}
                    </th>
                    <th>
                        {i18next.t("created_at")}
                    </th>
                    <th>
                        {i18next.t("updated_at")}
                    </th>

                    <th ></th>
                </tr>
                </thead>
                <tbody className="table-body-font text-secondary">
                {renderProfits()}
                </tbody>
            </Table>
            <hr/>

            <div className="header-item">
                <h5 className="text-secondary mr-3">{i18next.t("destinations")}</h5>
            </div>

            <Table responsive className="table-borderless table-hover table-sep p-2">
                <thead className="header-font text-secondary">
                <tr>
                    <th >
                    </th>
                    <th>
                        {i18next.t("name")}
                    </th>
                    <th>
                        {i18next.t("prefix")}
                    </th>
                    <th>
                        {i18next.t("country_code")}
                    </th>
                    <th >
                        {i18next.t("code")}
                    </th>
                    <th >
                        {i18next.t("CreationDate")}
                    </th>
                    <th >
                        {i18next.t("updated_at")}
                    </th>

                    <th ></th>
                </tr>
                </thead>
                <tbody className="table-body-font text-secondary">
                {renderDestinations()}
                </tbody>
            </Table>
        </React.Fragment>
    ) : (
        <p></p>
    );
};
export default OperatorItem;
