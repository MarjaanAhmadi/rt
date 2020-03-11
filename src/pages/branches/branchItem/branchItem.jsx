import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18next";
import axiosInstance from "../../../config/axios";
import {Table} from "react-bootstrap";
import SingleDestination from "../../destination/singleDestination/singleDestination";

const BranchItem = props => {
    const [branch, setBranch] = useState({});
    const [destinations, setDestinations] = useState({list: []});

    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    //should send api to server

    const getSpecificBranch = async () => {
        dispatch({ loading: true, type: "SHOW_LOADING" });
        try {
            const response = await axiosInstance.get(
                `/cgrates/v1/api/branches/${props.match.params.id}`
            );
            debugger
            setBranch(response.data.data);
            setDestinations({
                ...destinations,
                list: response.data.data.destinations
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
        getSpecificBranch();
    }, []);
    return branch !== undefined ? (
        <React.Fragment>

            <div className='container'>
                <h4>اطلاعات شعبه</h4>
                <Table striped bordered size="lg">
                    <tbody>
                    <tr>
                        <td>
                            <span className='p-3'>
                                {i18next.t('branch_code')}: {branch.branch_code}
                            </span>
                        </td>
                        <td>
                        <span className='p-3'>
                            {i18next.t('branch_name')}: {branch.branch_name}

                        </span>
                        </td>
                    </tr>

                    </tbody>
                </Table>
            </div>
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
export default BranchItem;
