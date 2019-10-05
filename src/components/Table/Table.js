import React from 'react';
import StackOfStacks from "../shared/StackOfStacks/StackOfStacks";
import {connect} from "react-redux";
import {setPopup} from "../shared/actions";
import './Table.scss';
import ConstructionMenuThreePart from "../shared/ConstructionMenu/ConstructionMenuThreePart";
import SwipeableProductView from "../shared/SwipeableProductView/SwipeableProductView";
import IngredientsTable from "../shared/IngredientsTable/IngredientsTable";
import {ITEM_STATE} from "../shared/inventory";

class Table extends React.Component {
    getAvailableTableStacks = () => {
        const premium = this.props.premium;
        let l = this.props.level;
        if (l < 5) {
            return premium + 1;
        }
        if (l < 10) {
            return premium + 2;
        }
        if (l < 15) {
            return premium + 3;
        }
        if (l < 27) {
            return premium + 4;
        }
        if (l < 39) {
            return premium + 5;
        }
        if (l < 50) {
            return premium + 6;
        }
        return premium + 7;
    };

    getNextStackLevel() {
        let l = this.props.level;
        if (l < 5) {
            return 5;
        }
        if (l < 10) {
            return 10;
        }
        if (l < 15) {
            return 15;
        }
        if (l < 27) {
            return 27;
        }
        if (l < 39) {
            return 39;
        }
        if (l < 50) {
            return 50;
        }
    }

    render() {
        return (
            <div className={'tableArea'} onClick={this.props.showTablePopup}>
                <StackOfStacks
                    availableStacks={this.getAvailableTableStacks()}
                    nextStackLevel={this.getNextStackLevel()}
                    crafting={this.props.tableCraftingStack}
                    queue={'table'}
                    {...this.props}/>
            </div>
        )
    }
}

class Popup extends React.Component {
    constructor(props) {
        super(props)

        this.types = ['dagger','sword', 'longSword', 'bow', 'halfShield', 'fullShield'];
        const selectedBar = Array.isArray(this.props.inventory) ? this.getProducts(0)[0] : {};
        this.tiers = 6;
        this.state = {
            selectedProduct: selectedBar,
            selectedTier: 0,
            products:  this.getProducts(0),
        }
    }

    selectProduct = product => {
        if (product !== this.state.selectedProduct) {
            this.setState({selectedProduct: product});
        }
    };

    incrementTier = () => {
        let newSelectedTier = ((this.state.selectedTier + 1) % this.tiers);
        let selectedProduct = this.getProducts(newSelectedTier).find(p => p.type === this.state.selectedProduct.type);
        this.setState({
            selectedTier: newSelectedTier,
            products: this.getProducts(newSelectedTier),
            selectedProduct: selectedProduct,
        });
    };

    decrementTier = () => {
        let newSelectedTier = ((this.state.selectedTier - 1) % this.tiers);
        if (newSelectedTier === -1) {
            newSelectedTier = this.tiers;
        }
        let selectedProduct = this.getProducts(newSelectedTier).find(p => p.type === this.state.selectedProduct.type);
        this.setState({
            selectedTier: newSelectedTier,
            products: this.getProducts(newSelectedTier),
            selectedProduct: selectedProduct,
        });
    };

    getProducts = (newSelectedTier) => {
        return this.props.inventory
            .filter(i => this.types.indexOf(i.type) >= 0)
            .filter(i => i.tier === newSelectedTier + 1)
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
            topChildren={<div className='title'>Table</div>}
            middleChildren={
                <div className={'tierSelectorContainer'}>
                <div className={'tierSelector'}><div className={'up'} onClick={this.incrementTier}/><div className={'down'} onClick={this.decrementTier} /></div>
                <SwipeableProductView onSlideChanged={({item}) => this.selectProduct(this.state.products[item])}
                                      products={this.state.products} selectedProduct={this.state.selectedProduct} itemState={ITEM_STATE.NORMAL} {...this.props}/>
                </div>
            }
            bottomChildren={
                this.state.selectedProduct && <IngredientsTable product={this.state.selectedProduct} actionName={'Craft'} action={(size) => {
                    this.props.addItems(this.state.selectedProduct, size);
                }
                } ingredientState={ITEM_STATE.NORMAL} {...this.props}/>
            }
            close={this.props.close} />
    }
}

const mapDispatchToProps = (dispatch) => ({
    showTablePopup: () => dispatch(setPopup('table')),
    addItems: (item, count) => {
        return dispatch({
            type: 'craft',
            queue: 'table',
            itemState: ITEM_STATE.NORMAL,
            count: count,
            item: item,
        })
    },
    updateFinishTime: (item, finishTime) => dispatch({
        type: 'updateFinishTime',
        queue: 'table',
        uuid: item.uuid,
        finishTime: finishTime,
    })
});

const mapStateToProps = (state) => {
    const newLocal = {
        inventory: state.inventory,
        level: state.level,
        tableCraftingStack: state.tableQueue,
        premium: state.premium,
    };
    return newLocal;
};

export const TablePopup = connect(mapStateToProps, mapDispatchToProps)(Popup);
export default connect(mapStateToProps, mapDispatchToProps)(Table);
