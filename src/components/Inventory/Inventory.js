import React from 'react';
import StackOfStacks from "../shared/StackOfStacks/StackOfStacks";
import {connect} from "react-redux";
import {setPopup} from "../shared/actions";
import './Inventory.scss';
import {ITEM_STATE} from "../shared/inventory";
import ConstructionMenuTwoPart from "../shared/ConstructionMenu/ConstructionMenuTwoPart";

class Inventory extends React.Component {
    getAvailableInventoryStacks = () => {
        const premium = this.props.premium;
        let l = this.props.level;
        if (l < 5) {
            return premium + 1;
        }
        if (l < 13) {
            return premium + 2;
        }
        if (l < 20) {
            return premium + 3;
        }
        if (l < 35) {
            return premium + 4;
        }
        return premium + 5;
    };

    getNextStackLevel() {
        let l = this.props.level;
        if (l < 5) {
            return 5;
        }
        if (l < 13) {
            return 13;
        }
        if (l < 20) {
            return 0;
        }
        if (l < 35) {
            return 35;
        }
    }

    render() {
        return (
            <div className={'inventoryArea'} onClick={this.props.showInventoryPopup}>
                <StackOfStacks
                    availableStacks={this.getAvailableInventoryStacks()}
                    nextStackLevel={this.getNextStackLevel()}
                    crafting={this.props.inventoryCraftingStack}
                    queue={'inventory'}
                    {...this.props}/>
            </div>
        )
    }
}

class InventoryTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sellCount: 1
        }
    }

    sell = (item, state) => {
        this.props.sellItems(item, state, this.state.sellCount)
    };

    render() {
        return (
        <div className={'inventoryContainer'}>
            <div className={'inventoryTable'}>
                <table>
                    <thead>
                    <tr>
                        <th>Qty</th>
                        <th></th>
                        <th>Name</th>
                        <th>Sell</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.inventory.filter(i => Object.values(i.count).reduce((accumulator, currentValue) => accumulator + currentValue) > 0).map(i => Object.keys(i.count).filter(j => i.count[j]).map(j => <tr key={i.image + j}>
                        <td className={'count'}>{i.count[j]}</td>
                        <td className={'icon'}>{i.image && <img alt={i.name} src={`/images/${i.image}`}/>}</td>
                        <td className={'name'}>{(parseInt(j, 10) === ITEM_STATE.UNFINISHED ? '(unf) ' : '') + i.name}</td>
                        <td className={'button narrow'} onClick={() => this.sell(i, j)}></td>
                    </tr>))}
                    </tbody>
                </table>
            </div>
            <div className={'buttonContainer'}>
                <div className={'sellCountButton'} onClick={() => this.setState({sellCount: 1})}><img alt='sell1' src='/images/button_narrow.png' /><div>Sell 1<div className={'tickOrCross ' + (this.state.sellCount === 1 ? 'tick' : 'cross')} /></div></div>
                <div className={'sellCountButton'} onClick={() => this.setState({sellCount: 10})}><img alt='sell10' src='/images/button_narrow.png' /><div>Sell 10<div className={'tickOrCross ' + (this.state.sellCount === 10 ? 'tick' : 'cross')} /></div></div>
                <div className={'sellCountButton'} onClick={() => this.setState({sellCount: -1})}><img alt='sellmax' src='/images/button_narrow.png' /><div>Sell Max<div className={'tickOrCross ' + (this.state.sellCount === -1 ? 'tick' : 'cross')} /></div></div>
            </div>
        </div>
        )
    }
}

class Popup extends React.Component {

    render() {
        return <ConstructionMenuTwoPart
            topChildren={<div className='title'>Inventory</div>}
            bottomChildren={
                <ConnectedInventoryTable />
            }
            close={this.props.close} />
    }
}

const mapDispatchToProps = (dispatch) => ({
    showInventoryPopup: () => dispatch(setPopup('inventory')),
    sellItems: (item, itemState, count) => {
        return dispatch({
            type: 'sell',
            queue: 'inventory',
            count: count,
            item: item,
            itemState: itemState,
        })
    },
    updateFinishTime: (item, finishTime) => dispatch({
        type: 'updateFinishTime',
        queue: 'inventory',
        uuid: item.uuid,
        finishTime: finishTime,
    })
});

const mapStateToProps = (state) => {
    const newLocal = {
        inventory: state.inventory,
        level: state.level,
        inventoryCraftingStack: state.inventoryQueue,
        premium: state.premium,
    };
    return newLocal;
};

const ConnectedInventoryTable = connect(mapStateToProps, mapDispatchToProps)(InventoryTable);
export const InventoryPopup = connect(mapStateToProps, mapDispatchToProps)(Popup);
export default connect(mapStateToProps, mapDispatchToProps)(Inventory);