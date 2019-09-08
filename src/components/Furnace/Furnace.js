import React, { Component } from 'react';
import { connect } from 'react-redux';
import "react-alice-carousel/lib/alice-carousel.css";
import moment from 'moment'

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
            craftingQueue: [
                {
                    id: 1,
                    image: 'ironBar.png',
                    count: 1,
                    product: 'Iron bar 1',
                    time: [5, "seconds"],
                },
                {
                    id: 2,
                    image: 'ironBar.png',
                    count: 2,
                    product: 'Iron bar 2',
                    time: [10, "seconds"],
                },
                {
                    id: 3,
                    image: 'ironBar.png',
                    count: 2,
                    product: 'Iron bar 3',
                    time: [10, "seconds"],
                },
                {
                    id: 4,
                    image: 'ironBar.png',
                    count: 5,
                    product: 'Iron bar 4',
                    time: [100, "seconds"],
                },
                {
                    id: 5,
                    image: 'ironBar.png',
                    count: 5,
                    product: 'Iron bar 5',
                    time: [100, "seconds"],
                },
                {
                    id: 6,
                    image: 'ironBar.png',
                    count: 5,
                    product: 'Iron bar 6',
                    time: [100, "seconds"],
                },
                {
                    id: 7,
                    image: 'ironBar.png',
                    count: 5,
                    product: 'Iron bar 7',
                    time: [100, "seconds"],
                },
                {
                    id: 8,
                    image: 'ironBar.png',
                    count: 5,
                    product: 'Iron bar 8',
                    time: [100, "seconds"],
                }
            ]
        }
    }
    getAvailableFurnaceStacks() {
        return 6;
    }

    getNextStackLevel() {
        return 5;
    }

    getCurrentCraftingQueue() {
        return [...this.state.craftingQueue];
    }

    render() {
        return (
            <div className={'furnaceArea'} onClick={this.props.showFurnacePopup}>
                <StackOfStacks
                    availableStacks={this.getAvailableFurnaceStacks()}
                    nextStackLevel={this.getNextStackLevel()}
                    crafting={this.getCurrentCraftingQueue()}
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

export default connect(mapStateToProps, mapFurnaceDispatchToProps)(Furnace);
