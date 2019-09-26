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
            selectedBar: this.props.inventory.filter(i => i.type === 'bar')[0],
        }
    }

    selectBar = bar => {
        if (bar !== this.state.selectedBar) {
            this.setState({selectedBar: bar});
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(`Props updated on furnace`);
    }

    render() {
        console.log('Rendering furnace');
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
        type: 'smelt',
        image: item.image,
        count: count,
        product: item.name,
        time: item.time,
    }),
    updateFinishTime: (item, finishTime) => dispatch({
        type: 'updateFinishTime',
        uuid: item.uuid,
        finishTime: finishTime,
    })
});

const mapStateToProps = (state) => {
    const newLocal = {
        inventory: state.inventory,
        level: state.level,
        furnaceCraftingStack: state.furnaceQueue,
    };
    return newLocal;
};

export const FurnacePopup = connect(mapStateToProps, mapFurnaceDispatchToProps)(Popup);

export default connect(mapStateToProps, mapFurnaceDispatchToProps)(Furnace);
