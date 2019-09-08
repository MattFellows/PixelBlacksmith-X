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
        this.setState({
            crafting: newStateCrafting
        });
    };

    checkAndUpdateStacks = () => {
        let newStateCrafting = [...this.state.crafting].filter(i => i && !i.removeMe);
        console.log(newStateCrafting);
        let currentlyCraftingCount = newStateCrafting.filter(i => i && i.finishTime && i.remainingTime).length;
        if (currentlyCraftingCount < this.props.availableStacks) {
            let allRemainingStacks = this.state.crafting.filter(i => !i.removeMe);
            for (let i = 0; i < allRemainingStacks.length; i++) {
                let item = allRemainingStacks[i];
                if ((currentlyCraftingCount < this.props.availableStacks) && !item.finishTime) {
                    item.finishTime = moment().add(item.time[0], item.time[1]);
                    item.remainingTime = item.time[0] * 1000;
                    currentlyCraftingCount++;
                }
            }
        }
        this.setState({
            crafting: newStateCrafting
        });
    };

    componentDidMount = () => {
        setInterval(this.updateCountdown, 1000);
        setTimeout(() => setInterval(this.checkAndUpdateStacks, 1000), 500);
    }

    render() {
        const craftingStacks = this.state.crafting.filter(i => i && !i.removeMe && i.finishTime && i.remainingTime > 0);
        return (
            <div className={'stacksContainer'}>
                {craftingStacks.map((i, ind) => {
                    return (
                        <div key={`${i.image}-${ind}`} className={"stack"}>
                            <img alt={i.image} src={`/images/${i.image}`}/>
                            <div className={'overlay'}>{`${Math.ceil(i.remainingTime / 1000)}s`}</div>
                        </div>
                    )
                })
                }
                {[...Array(this.props.availableStacks - craftingStacks.length).keys()].map((_i, ind) =>
                    <div key={`emptyStack${ind}`} className={'stack'}></div>)
                }
                {this.props.nextStackLevel > this.props.level &&
                <div key={'nextStack'} className={'stack'}>
                    <img alt={'padlock'} src={`/images/padlock.png`}/>
                    <div className={'overlay'}>{`Lv ${this.props.nextStackLevel}`}</div>
                </div>
                }
                {this.state.crafting.length > craftingStacks.length &&
                <div key={'unstartedStacks'} className={'stack'}>
                    <div className={'overlay2'}>{`+ ${this.state.crafting.filter(i => !i.removeMe).length - craftingStacks.length}`}</div>
                    <div className={'overlay'}>&nbsp;</div>
                </div>
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addToInventory: (item, count) => dispatch({type: 'addInventory', itemName: item, itemCount: count})
    }
}

export default connect(null, mapDispatchToProps)(StackOfStacks);
