import React, { Component } from 'react';
import AliceCarousel from "react-alice-carousel";
import * as PropTypes from "prop-types";
import MakeProductView from './MakeProductView';

class SwipeableProductView extends Component {
    selectedItem;

    constructor(props) {
        super(props);

        this.selectedItem = this.props.products[0];
    }

    render() {
        let updatedSelectedItem = this.props.products.find(p => p.name === this.selectedItem.name);
        console.log('Rendering Swipaeable: ', updatedSelectedItem, this.props.products.indexOf(updatedSelectedItem));
        return <div
            className='swiperContainer'>
            <AliceCarousel
                key={JSON.stringify(this.props.products)}
                mouseDragEnabled
                onSlideChanged={({item}) => {
                    console.log('1: ', this.selectedItem);
                    this.selectedItem = this.props.products[item];
                    this.props.onSlideChanged({item});
                    console.log('2: ', this.selectedItem);
                }}
                items={this.props.products.length}
                startIndex={this.props.products.indexOf(this.selectedItem)}>
                {this.props.products.map((bar, ind) => <MakeProductView
                    key={bar.name}
                    product={bar}
                    index={ind}
                    {...this.props}/>)}
            </AliceCarousel>
        </div>;
    }
}

SwipeableProductView.propTypes = {
    onSlideChanged: PropTypes.func,
    products: PropTypes.any,
};

export default SwipeableProductView;
