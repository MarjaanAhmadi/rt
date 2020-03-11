import React from "react";
import ReactPaginate from "react-paginate";
import './pagination.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faArrowRight,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faArrowRight,
    faArrowLeft
)

const Pagination = (props) => {
    const prevLabel = <FontAwesomeIcon icon="arrow-right" />
    const nextLabel = <FontAwesomeIcon icon="arrow-left" />

    return(
        <ReactPaginate
            pageCount={props.count}
            pageRangeDisplayed={25}
            onPageChange={props.onChangePage}
            activeClassName={'active'}
            previousLabel={prevLabel}
            nextLabel={nextLabel}
        />

    )
}
export default Pagination;
