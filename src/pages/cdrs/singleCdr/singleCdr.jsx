import React, {useState} from 'react';
import moment from "jalali-moment";
import i18next from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faEdit, faDownload} from "@fortawesome/free-solid-svg-icons";
library.add(
    faEdit,
    faDownload
);
const SinglePhone = (props) => {
    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className="table-td">
                    {/*<input disabled={props.invoice.status !== 'Pending'} type="checkbox" onChange={chooseItem}/>*/}

                </td>
                <td className="table-td">
                    {props.cdr.caller}
                </td>
                <td className="table-td">
                    {props.cdr.called}
                </td >
                <td className="table-td">
                    {props.cdr.talk_time}
                </td>
                <td className="table-td">
                    {props.cdr.duration}
                </td>
                <td className="table-td">
                    {i18next.t(props.cdr.end_cause)}
                </td>
                <td className="table-td">
                    {moment.unix(props.cdr.call_date).format('jYYYY/jMM/jDD')}
                </td>
                <td className="table-td">
                    {moment.unix(props.cdr.call_date).format('HH:mm:ss')}
                </td>
                {
                    props.cdr.talk_time && props.cdr.recorded_audio &&
                    props.cdr.audio_link ?
                   <React.Fragment>
                       <td className="table-td">
                           <a
                               download={`${props.cdr.id}.pdf`}
                               href={`https://testbed.nexfon.ir${props.cdr.audio_link}`}>
                               <FontAwesomeIcon icon={"download"}/></a>
                       </td>
                       <td className='table-td'>
                           <audio controls>
                               <source src={`https://testbed.nexfon.ir${props.cdr.audio_link}`} />
                           </audio>
                       </td>
                   </React.Fragment>
                        : null
                }

                <td className="table-td">
                        {/*<DefaultModal*/}
                        {/*    viewComponent={<Link><FontAwesomeIcon className="active-icon" icon="edit" onClick={() => setShowModal(true)}/></Link>}*/}
                        {/*    content={*/}
                        {/*        <React.Fragment>*/}
                        {/*            <PhoneActions edit={true} endpoint={props.endPoint} closeModal={() => setShowModal(false)}/>*/}
                        {/*            <span onClick={()=>setShowModal(false)} className='btn-custom pointer ml-2'>{i18next.t('exit')}</span>*/}
                        {/*        </React.Fragment>*/}
                        {/*    }*/}
                        {/*    size={'lg'}*/}
                        {/*    open={showModal}*/}
                        {/*    header={i18next.t('edit')}*/}
                        {/*></DefaultModal>*/}
                </td>

            </tr>
        </React.Fragment>
    );
}
export default SinglePhone;
