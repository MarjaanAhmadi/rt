import React from "react";
import i18next from "i18next";
import { useHistory } from "react-router-dom";
import currency from "../../../filtering/currency";
import "./invoiceInterim.css";
const InvoiceInterim = props => {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className="modal-items">
        <p>
          {i18next.t("tracking_code")}: {props.interim.tracking_code}
        </p>
        <p>
          {i18next.t("total_cost")}: {currency(props.interim.total_cost)} {i18next.t("rial")}

        </p>
        {/*<p>*/}
        {/*  {i18next.t("InvoiceType")}:*/}
        {/*  {props.interim.bill_type === "interim" ? "میان‌دوره" : "پایان‌دوره"}*/}
        {/*</p>*/}

        <p>
          {i18next.t("CreationDate")}:{props.interim.created_at_jalali}
        </p>
        <p>{i18next.t("Status")} :پرداخت نشده </p>
        <p>مهلت پرداخت : {props.interim.to_date_jalali}</p>
        <button
            type="submit"
            onClick={props.closeModal}
            className="btn-custom"
        >
          {i18next.t("exit")}
        </button>
        <div
          className="btn-custom pointer"
          onClick={() => {
            history.push(`/invoice/${props.interim.id}`);
          }}
        >
          {" "}
          مشاهده جزییات قبض میان‌دوره
        </div>

      </div>
    </React.Fragment>
  );
};
export default InvoiceInterim;
