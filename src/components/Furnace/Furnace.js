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

        this.types = ['bar'];
        const selectedProduct = Array.isArray(this.props.inventory) ? this.getProducts(0)[0] : {};
        this.state = {
            selectedProduct: selectedProduct,
        }
    }

    selectBar = selectedProduct => {
        if (selectedProduct !== this.state.selectedProduct) {
            this.setState({selectedProduct: selectedProduct});
        }
    };

    getProducts() {
        return this.props.inventory
            .filter(i => this.types.indexOf(i.type) >= 0)
            .sort((i1, i2) => {
                if (i1.tier < i2.tier) {
                    return -1;
                } else if (i1.tier > i2.tier) {
                    return 1;
                } else {
                    return this.types.indexOf[i1.type] - this.types.indexOf[i2.type];
                }
            });
    }

    render() {
        return <ConstructionMenuThreePart
                    topChildren={<div className='title'>Furnace</div>}
                    middleChildren={
                        <SwipeableProductView onSlideChanged={({item}) => this.selectBar(this.getProducts(0)[item])}
                                              products={this.getProducts(0)} selectedProduct={this.state.selectedProduct} {...this.props}/>
                    }
                    bottomChildren={
                        this.state.selectedProduct && <IngredientsTable product={this.state.selectedProduct} actionName={'Smelt'} action={(size) => {
                            this.props.addItems(this.state.selectedProduct, size);
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
