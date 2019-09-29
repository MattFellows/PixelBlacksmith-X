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
                    {...this.props}/>
            </div>
        )
    }
}

class InventoryTable extends React.Component {
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
                        <td className={'name'}>{i.name}</td>
                        <td className={'button narrow'}></td>
                    </tr>))}
                    </tbody>
                </table>
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
    addItems: (item, count) => {
        return dispatch({
            type: 'craft',
            queue: 'inventory',
            itemState: ITEM_STATE.UNFINISHED,
            count: count,
            item: item,
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

const ConnectedInventoryTable = connect(mapStateToProps)(InventoryTable);
export const InventoryPopup = connect(mapStateToProps, mapDispatchToProps)(Popup);
export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
