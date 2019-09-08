import React, { Component } from 'react';
import { connect } from 'react-redux';
import "react-alice-carousel/lib/alice-carousel.css";

import ConstructionMenuThreePart from '../shared/ConstructionMenu/ConstructionMenuThreePart';
import './Furnace.css';
import { setPopup } from '../shared/actions';
import IngredientsTable from '../shared/IngredientsTable/IngredientsTable';
import SwipeableProductView from '../shared/SwipeableProductView/SwipeableProductView';
import StackOfStacks from '../shared/StackOfStacks/StackOfStacks';

class Furnace extends Component {
    constructor(props) {
        super(props);

        this.state = {
            craftingQueue: []
        }
    }
    getAvailableFurnaceStacks() {
        return 6;
    }

    getNextStackLevel() {
        return 5;
    }

    render() {
        return (
            <div className={'furnaceArea'} onClick={this.props.showFurnacePopup}>
                <StackOfStacks
                    availableStacks={this.getAvailableFurnaceStacks()}
                    nextStackLevel={this.getNextStackLevel()}
                    crafting={this.props.furnaceCraftingStack}
                    {...this.props}/>
            </div>
        )
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
                            this.props.addItems(this.state.selectedBar, size);
                        }
                        } {...this.props}/>
                    }
                    close={this.props.close} />
    }
}

const mapFurnaceDispatchToProps = (dispatch) => ({
    showFurnacePopup: () => dispatch(setPopup('furnace')),
    addItems: (item, count) => dispatch({
        type: 'smelt',
        image: item.image,
        count: count,
        product: item.name,
        time: item.time,
    })
});

const mapStateToProps = (state) => {
    console.log(state)
    const newLocal = {
        bars: state.root.inventory.filter(i => i.type === 'bar'),
        level: state.root.level,
        furnaceCraftingStack: state.furnace.craftingQueue,
    };
    console.log('Furnace state: ', newLocal)
    return newLocal;
};

export const FurnacePopup = connect(mapStateToProps, mapFurnaceDispatchToProps)(Popup);

export default connect(mapStateToProps, mapFurnaceDispatchToProps)(Furnace);
