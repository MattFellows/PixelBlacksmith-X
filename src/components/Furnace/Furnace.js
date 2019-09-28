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

    getAvailableFurnaceStacks = () => {
        const premium = this.props.premium;
        let l = this.props.level;
        if (l < 4) {
            return premium + 1;
        }
        if (l < 8) {
            return premium + 2;
        }
        if (l < 17) {
            return premium + 3;
        }
        if (l < 24) {
            return premium + 4;
        }
        if (l < 30) {
            return premium + 5;
        }
        if (l < 44) {
            return premium + 6;
        }
        return premium + 7;
    };

    getNextStackLevel() {
        let l = this.props.level;
        if (l < 4) {
            return 4;
        }
        if (l < 8) {
            return 8;
        }
        if (l < 17) {
            return 17;
        }
        if (l < 24) {
            return 24;
        }
        if (l < 30) {
            return 30;
        }
        if (l < 44) {
            return 44;
        }
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

        const selectedBar = Array.isArray(this.props.inventory) ? this.props.inventory.filter(i => i.type === 'bar')[0] : {};
        this.state = {
            selectedBar: selectedBar,
        }
    }

    selectBar = bar => {
        if (bar !== this.state.selectedBar) {
            this.setState({selectedBar: bar});
        }
    };

    render() {
        return <ConstructionMenuThreePart
                    topChildren={<div className='title'>Furnace</div>}
                    middleChildren={
                        <SwipeableProductView onSlideChanged={({item}) => this.selectBar(this.props.inventory.filter(i => i.type === 'bar')[item])}
                                              products={this.props.inventory.filter(p => p.type === 'bar')} {...this.props}/>
                    }
                    bottomChildren={
                        this.state.selectedBar && <IngredientsTable product={this.state.selectedBar} actionName={'Smelt'} action={(size) => {
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
        type: 'craft',
        queue: 'furnace',
        itemState: 1,
        count: count,
        item: item,
    }),
    updateFinishTime: (item, finishTime) => dispatch({
        type: 'updateFinishTime',
        queue: 'furnace',
        uuid: item.uuid,
        finishTime: finishTime,
    })
});

const mapStateToProps = (state) => {
    const newLocal = {
        inventory: state.inventory,
        level: state.level,
        furnaceCraftingStack: state.furnaceQueue,
        premium: state.premium,
    };
    return newLocal;
};

export const FurnacePopup = connect(mapStateToProps, mapFurnaceDispatchToProps)(Popup);

export default connect(mapStateToProps, mapFurnaceDispatchToProps)(Furnace);
