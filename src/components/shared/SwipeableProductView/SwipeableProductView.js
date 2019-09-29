import React, { Component } from 'react';
import AliceCarousel from "react-alice-carousel";
import * as PropTypes from "prop-types";
import MakeProductView from './MakeProductView';

class SwipeableProductView extends Component {
    selectedItem;

    constructor(props) {
        super(props);

        this.selectedItem = this.props.selectedProduct || this.props.products[0];
    }

    render() {
        return <div
            className='swiperContainer'>
            <AliceCarousel
                key={JSON.stringify(this.props.products)}
                mouseDragEnabled
                onSlideChanged={({item}) => {
                    this.selectedItem = this.props.products[item];
                    this.props.onSlideChanged({item});
                }}
                items={this.props.products}
                startIndex={this.props.products.indexOf(this.props.selectedProduct)}>
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
