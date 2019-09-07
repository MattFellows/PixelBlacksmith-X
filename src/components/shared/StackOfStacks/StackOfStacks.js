import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './StackOfStacks.scss';

class StackOfStacks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            crafting: this.props.crafting
        }
    }

    updateCountdown = () => {
        let newStateCrafting = [...this.state.crafting];
        newStateCrafting.forEach(i => {
            i.remainingTime = i.finishTime ? i.finishTime.diff(moment()) : null;
            if (i.remainingTime < 0) {
                this.props.addToInventory(i.product, i.count);
                i.removeMe = true;
            }
        });
        newStateCrafting = newStateCrafting.filter(i => !i.removeMe);
        this.setState({
            crafting: newStateCrafting
        });
    }

    componentDidMount = () => {
        setInterval(this.updateCountdown, 1000);
    }

    render() {
        const craftingStacks = this.state.crafting.filter(i => i && i.finishTime && i.remainingTime);
        return <div className={'stacksContainer'}>
            {craftingStacks.map((i, ind) =>
                <div key={`${i.image}-${ind}`} className={"stack"}>
                    <img src={`/images/${i.image}`}/>
                    <div className={'overlay'}>{Math.ceil(i.remainingTime / 1000)}</div>
                </div>)}
            {[...Array(this.props.availableStacks - craftingStacks.length).keys()].map((_i, ind) =>
                <div className={'stack'}></div>)}
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addToInventory: (item, count) => dispatch({type: 'addInventory', itemName: item, itemCount: count})
    }
}

export default connect(null, mapDispatchToProps)(StackOfStacks);
