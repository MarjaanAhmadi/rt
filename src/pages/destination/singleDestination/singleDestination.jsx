import React from 'react';
import moment from "jalali-moment";
import i18next from "i18next";
const SingleDestination = (props) => {
    console.log(props.destination)

    return(
        <React.Fragment>
            <tr className="tr-shadow table-tr">
                <td className='table-td'></td>

                <td className="table-td">
                    {props.destination.name}
                </td >
                <td className="table-td">
                    {props.destination.prefix}
                </td>
                <td className="table-td">
                    {props.destination.country_code}
                </td>
                <td className="table-td">
                    {i18next.t(props.destination.code)}
                </td>
                <td className="table-td">
                    {moment.unix(props.destination.created_at).format('jYYYY/jMM/jDD')}
                </td>
                <td className="table-td">
                    {moment.unix(props.destination.updated_at).format('jYYYY/jMM/jDD')}
                </td>
            </tr>
        </React.Fragment>
    );
}
export default SingleDestination;
