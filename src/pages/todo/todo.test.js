import React from "react";
import { shallow, mount } from "../../test/enzyme";
import Todo from "./todo";

it("adds a new item", () => {
    const wrapper = mount(<Todo />);
    wrapper.find("input").simulate('change', {target: {name: 'username', value: 'krishankantsinghal'}});
    expect(wrapper.find('input').prop('value')).toEqual('krishankantsinghal');

});
