import React from "react";
import { shallow, mount } from "../../../../test/enzyme";
import Login from "../login";
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store';

it("adds a new item", () => {
    const initialState = {output:10}
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = mount(<Provider store={store}><Login t={(k) => 'translate hardcoded'}/></Provider>)
        .find('input').simulate('change', {target: {name: 'username', value: 'krishankantsinghal'}});
    console.debug(wrapper)

    // .simulate('change', {target: {name: 'username', value: 'krishankantsinghal'}}).dive();
    // expect(wrapper.find('input').prop('value')).toEqual('krishankantsinghal');

});
