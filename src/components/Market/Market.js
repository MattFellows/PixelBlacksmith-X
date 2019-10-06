import React from 'react';
import StackOfStacks from "../shared/StackOfStacks/StackOfStacks";
import {connect} from "react-redux";
import {setPopup} from "../shared/actions";
import './Market.scss';
import ConstructionMenuTwoPart from "../shared/ConstructionMenu/ConstructionMenuTwoPart";
import traders from '../shared/traders';
import traderstock from '../shared/traderstock';
import _ from 'lodash';

class Market extends React.Component {
    constructor(props) {
        super(props);

        setInterval(() => {
            console.log('Add Traders?', this.props.traders.fixed.length, this.props.traders.regular.length, this.props.traderCount);
            if ((this.props.traders.fixed.length + this.props.traders.regular.length) < this.props.traderCount) {
                console.log('Add Traders!');
                this.props.addNewTrader(this.getRandomTrader());
            }
        }, 1000)
    }

    getStock = (tr) => {
        let stock = traderstock.filter(ts => ts.trader === tr.id);
        stock.forEach(ts => ts.itemObj = this.props.inventory.find(i => i.id === ts.item));
        stock.sort((ts1, ts2) => {
           return ts1.requiredPurchases - ts2.requiredPurchases;
        });
        return stock;
    };

    getRandomTrader = () => {
        const random = Math.random() * 100;
        const potentialTraders = traders
            .filter(tr => this.props.traders.fixed.map(t => t.id).indexOf(tr.id))
            .filter(tr => this.props.traders.regular.map(t => t.id).indexOf(tr.id))
            .filter(tr => tr.level <= this.props.level)
            .filter(tr => tr.weighting <= random);
        let randomTrader = _.shuffle(potentialTraders)[0];
        randomTrader.stock = this.getStock(randomTrader);
        return randomTrader;
    };

    getAvailableMarketStacks = () => {
        const premium = this.props.premium;
        let l = this.props.level;
        if (l < 6) {
            return premium + 1;
        }
        if (l < 10) {
            return premium + 2;
        }
        if (l < 23) {
            return premium + 3;
        }
        if (l < 40) {
            return premium + 4;
        }
        return premium + 5;
    };

    getNextStackLevel() {
        let l = this.props.level;
        if (l < 6) {
            return 6;
        }
        if (l < 10) {
            return 10;
        }
        if (l < 23) {
            return 23;
        }
        if (l < 40) {
            return 40;
        }
    }

    render() {
        return (
            <div className={'marketArea'} onClick={this.props.showMarketPopup}>
                <StackOfStacks
                    availableStacks={this.getAvailableMarketStacks()}
                    nextStackLevel={this.getNextStackLevel()}
                    crafting={this.props.marketCraftingStack}
                    queue={'market'}
                    {...this.props}/>
            </div>
        )
    }
}

class MPopup extends React.Component {
    renderTrader = (tr) => {
        const tradeCount = this.props.trades[tr.id] || 0;
        return <div key={tr.name} className={'traderContainer'}>
            <div className={'traderInfo'}>
                <div className={'traderName'}>{tr.name}</div>
                <div className={'traderBlurb'}>{tr.blurb}</div>
                <div className={'traderStockRow'}>{tr.stock.map(ts => {
                    return <img alt={ts.itemObj.name} key={ts.itemObj.image + ts.requiredPurchases} src={'/images/'+ts.itemObj.image} className={ts.requiredPurchases > tradeCount ? 'redacted' : ''}/>
                })}</div>
            </div>
            <div className={'traderButton'} onClick={() => this.props.showTraderPopup(tr)}></div>
        </div>
    };

    render() {
        return <ConstructionMenuTwoPart
            topChildren={<div className='title'>Market</div>}
            bottomChildren={
                <>
                {
                    (Array.isArray(this.props.traders.fixed) &&
                    this.props.traders.fixed.length &&
                    this.props.traders.fixed.map(tr => {
                        return this.renderTrader(tr);
                    })) || undefined
                }
                {
                    (Array.isArray(this.props.traders.regular) &&
                    this.props.traders.regular.length &&
                    this.props.traders.regular.map(tr => {
                        return this.renderTrader(tr)
                    })) || undefined
                }
                </>
            }
            close={this.props.close} />
    }
}

class TPopup extends React.Component {
    render() {
        console.log(this.props);
        return <ConstructionMenuTwoPart
            topChildren={<div className='title'>Trader</div>}
            bottomChildren={
                <>
                    {(this.props.trader && this.props.trader.name) || undefined}
                </>
            }
            close={this.props.showMarketPopup} />
    }
}

const mapDispatchToProps = (dispatch) => ({
    showMarketPopup: () => dispatch(setPopup('market')),
    showTraderPopup: (trader) => dispatch(setPopup('trader', trader)),
    buyItems: (item, count) => {
        return dispatch({
            type: 'buy',
            queue: 'market',
            count: count,
            item: item,
        })
    },
    updateFinishTime: (item, finishTime) => dispatch({
        type: 'updateFinishTime',
        queue: 'market',
        uuid: item.uuid,
        finishTime: finishTime,
    }),
    addNewTrader: (trader) => dispatch({
        type: 'addTrader',
        trader: trader,
    })
});

const mapStateToProps = (state) => {
    const newLocal = {
        inventory: state.inventory,
        level: state.level,
        marketCraftingStack: state.marketQueue,
        premium: state.premium,
        traders: state.traders,
        traderCount: state.traderCount,
        trades: state.trades,
        trader: state.trader,
    };
    return newLocal;
};

export const MarketPopup = connect(mapStateToProps, mapDispatchToProps)(MPopup);
export const TraderPopup = connect(mapStateToProps, mapDispatchToProps)(TPopup);
export default connect(mapStateToProps, mapDispatchToProps)(Market);
