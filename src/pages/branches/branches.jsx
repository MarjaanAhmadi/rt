import React,{useEffect, useState} from 'react';
import axiosInstance from "../../config/axios";
import {useDispatch, useSelector} from "react-redux";
import {Form, InputGroup, Table} from "react-bootstrap";
import SingleBranch from './singleBranch/singleBranch'
import {withTranslation} from "react-i18next";
import DefaultModal from "../../components/modals/defaultModal";
import BranchActions from "./branchActions/branchActions";
import NoRowFounded from "../../mainComponents/noRowList/noRowList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Branches = ({t}) => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const [showModal, setShowModal] = useState(false);
    const [branchCode , setBranchCode] = useState('');
    const [branchName , setBranchName] = useState('');
    const [branches, setBranches] = useState({list: []})

    const setHeader = () => {
        if(token) axiosInstance.defaults.headers.common['Authorization'] = `JWT ${token}`;
    };

    const getBranches = async  () => {
        try {
            let data = {};
            if(branchCode !== ''){
                data['branch_code'] = branchCode;
            }
            if(branchName !== ''){
                data['branch_name'] = branchName;
            }
            const response = await axiosInstance.get('/cgrates/v1/api/branches/',{params: data});

            setBranches({
                ...branches,
                list: response.data.data
            })
        }
        catch (e) {
            console.log(e);
        }
    };


    const renderBranches = ()=> {
        return(
            branches.list.length > 0 ?
                branches.list.map((branch, index) => {
                    return <SingleBranch  getBranches={getBranches}
                                          branch={branch}
                                          key={index}/>
                })
                : <NoRowFounded/>
        )
    };

    const keyPress = async (e) => {
        if(e.keyCode === 13) await getBranches();
    };


    useEffect(() => {
        setHeader();
        getBranches();
    },[]);
    return(
        <React.Fragment >

            <div className='p-5'>
                <span className="main-title">{t('branches')}</span>
                <div className="row filter-section">
                    <div className="col-md-3">
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={getBranches}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onKeyDown={keyPress}
                                    type="text"
                                    placeholder="کد شعبه خود را وارد نمایید"
                                    value={branchCode}
                                    onChange={(event) => {
                                        setBranchCode(event.target.value)
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className='col-md-3'>
                        <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text onClick={getBranches}>
                                        <FontAwesomeIcon icon='search' />

                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onKeyDown={keyPress}
                                    type="text"
                                    placeholder="نام شعبه خود را وارد نمایید"
                                    value={branchName}
                                    onChange={(event) => {
                                        setBranchName(event.target.value)
                                    }}
                                />
                            </InputGroup>
                        </Form.Group>
                    </div>
                    <div className='col-md-3'>
                        <DefaultModal
                            viewComponent={<span className='btn-custom pointer' onClick={()=>setShowModal(true)}>{t('createBranch')}</span>}
                            content={
                                <React.Fragment>
                                    <BranchActions edit={false} created={()=>setShowModal(false)} getBranches={getBranches}/>
                                    <span className='btn-custom pointer ml-2' onClick={() => setShowModal(false)}>{t('exit')}</span>
                                </React.Fragment>
                            }
                            open={showModal}
                            size={'lg'}
                            header={t('create')}
                        ></DefaultModal>
                    </div>

                </div>


            </div>

            <div className="">
                <Table responsive className="table-borderless table-hover table-sep p-2">
                    <thead className="header-font text-secondary">
                    <tr>
                        <th >
                        </th>
                        <th>
                            {t("branch_code")}
                        </th>
                        <th>
                            {t("branch_name")}
                        </th>
                        <th>
                            {t("created_at")}
                        </th>
                        <th >
                            {t("updated_at")}
                        </th>
                        <th ></th>
                    </tr>
                    </thead>
                    <tbody className="table-body-font text-secondary">
                    {renderBranches()}
                    </tbody>
                </Table>
                {/*<Pagination changePageByUrl={handleChangePageByUrl} onChangePage={getInvoicesByPageNumber} count={Math.ceil(count/5)}/>*/}
            </div>

        </React.Fragment>
    )
}
export default withTranslation()(Branches);
