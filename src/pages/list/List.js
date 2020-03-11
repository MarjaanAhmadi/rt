import React from 'react';
import PropTypes from 'prop-types';
import ListItem from "./listItem/listItem";

const List = (props) => {
    const { items } = props;
    if (!items.length) {
        // No Items on the list, render an empty message
        return <span className="empty-message">No items in list</span>;
    }

    return (
        <ul className="list-items">
            {items.map(item => <ListItem key={item} item={item} />)}
        </ul>
    );
}

List.propTypes = {
    items: PropTypes.array,
};

List.defaultProps = {
    items: [],
};

export default List;
