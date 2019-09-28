import React, { Component } from 'react';
import ActionPage from "../ActionPage/ActionPage";


class MakeProductView extends Component {
    render() {
        return <div className='swiperItem'>
            <ActionPage
                name={this.props.product.name}
                image={this.props.product.image}
                count={this.props.product.count}
                description={this.props.product.description}
                redacted={this.props.level < this.props.product.level}/>
        </div>
    }
}

export default MakeProductView;
