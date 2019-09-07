import React, { Component } from 'react';
import { connect } from 'react-redux';
import "react-alice-carousel/lib/alice-carousel.css";

import ConstructionMenuThreePart from '../shared/ConstructionMenu/ConstructionMenuThreePart';
import './Furnace.css';
import { setPopup } from '../shared/actions';
import IngredientsTable from '../shared/IngredientsTable/IngredientsTable';
import SwipeableProductView from '../shared/SwipeableProductView/SwipeableProductView';

class Furnace extends Component {
    render() {
        return (<div className={'furnaceArea'} onClick={this.props.showFurnacePopup}>

        </div>)
    }
}

class Popup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedBar: this.props.bars[0],
        }
    }

    selectBar = bar => {
        console.log('Select Bar: ', bar);
        if (bar !== this.state.selectedBar) {
            this.setState({selectedBar: bar});
        }
    }

    render() {
        return <ConstructionMenuThreePart
                    topChildren={<div className='title'>Furnace</div>}
                    middleChildren={
                        <SwipeableProductView onSlideChanged={({item}) => this.selectBar(this.props.bars[item])}
                                              products={this.props.bars} {...this.props}/>
                    }
                    bottomChildren={
                        this.state.selectedBar && <IngredientsTable product={this.state.selectedBar} actionName={'Smelt'} action={(size) => {
                            console.log('Smelt: ', size);
                        }
                        } {...this.props}/>
                    }
                    close={this.props.close} />
    }
}

const mapFurnaceDispatchToProps = (dispatch) => ({
    showFurnacePopup: () => dispatch(setPopup('furnace')),
});

const mapStateToProps = (state) => {
    console.log(state)
    const newLocal = {
        bars: state.root.inventory.filter(i => i.type === 'bar'),
        level: state.root.level,
    };
    console.log('Furnace state: ', newLocal)
    return newLocal;
};

export const FurnacePopup = connect(mapStateToProps)(Popup);

export default connect(null, mapFurnaceDispatchToProps)(Furnace);
