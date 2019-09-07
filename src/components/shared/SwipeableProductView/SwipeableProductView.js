import React, { Component } from 'react';
import AliceCarousel from "react-alice-carousel";
import * as PropTypes from "prop-types";
import MakeProductView from './MakeProductView';

class SwipeableProductView extends Component {
    render() {
        return <div
            className='swiperContainer'>
            <AliceCarousel mouseDragEnabled onSlideChanged={this.props.onSlideChanged}>
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
