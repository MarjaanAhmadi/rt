import React from 'react';
import {mount, render} from '../../../test/enzyme'
import List from "../List";
import { wrap } from 'module';

describe('List tests', () => {


    it('renders list-items', () => {

        const items = ['one', 'two', 'three'];
        const wrapper = render(<List items={items} />);
        wrapper.addClass('foo');
        expect(wrapper.find('.list-items')).toBeDefined();
        expect(wrapper.find('.item')).toHaveLength(items.length);
    });

    it('renders a list item', () => {
        const items = ['Thor', 'Loki','Luke'];
        const wrapper = mount(<List items={items} />);

        // Check if an element in the Component exists
        expect(wrapper.contains(<li key='Thor' className="item">Thor</li >)).toBeTruthy();
    });

    it('renders correct text in item', () => {
        const items = ['John', 'James', 'Luke'];
        const wrapper = mount(<List items={items} />);
        //Expect the child of the first item to be an array
        expect(wrapper.find('.item').get(0).props.children).toEqual('John');
    });
});
