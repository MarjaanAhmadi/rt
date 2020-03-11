import React from "react";
import Moment from "react-moment";
import currency from "../../../filtering/currency";

const SinglePayment = props => {
  return (
    <tr className="tr-shadow table-tr">
        <td className='table-td'>{props.payment.main_number}</td>
      <td className="table-td">{props.payment.id}</td>
      <td className="table-td">
        <Moment format="YYYY/MM/DD" locale="L">
          {props.payment.created_at_jalali}
        </Moment>
      </td>
      <td className="table-td">{currency(props.payment.amount)}</td>
      <td className="table-td">
        <span className={`table-width-item ${props.status.color}`}>
          {props.status.label}
        </span>
      </td>
    </tr>
  );
};
export default SinglePayment;
