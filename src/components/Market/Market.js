import React from 'react';
import StackOfStacks from "../shared/StackOfStacks/StackOfStacks";
import {connect} from "react-redux";
import {setPopup} from "../shared/actions";
import './Market.scss';
import ConstructionMenuTwoPart from "../shared/ConstructionMenu/ConstructionMenuTwoPart";
import traders from '../shared/traders';
import characters from '../shared/characters';
import _ from 'lodash';

class Market extends React.Component {
    constructor(props) {
        super(props);

        setInterval(() => {
            if ((this.props.traders.fixed.length + this.props.traders.regular.length) < this.props.traderCount) {
                let randomTrader = this.getRandomTrader();
                if (randomTrader) {
                    this.props.addNewTrader(randomTrader);
                }
            }
            this.props.removeSoldoutTraders();

        }, 1000)
    }

    getStock = (tr) => {
        if (tr) {
            let stock = this.props.traderstock.filter(ts => ts.trader === tr.id);
            stock.forEach(ts => ts.itemObj = this.props.inventory.find(i => i.id === ts.item));
            stock.sort((ts1, ts2) => {
                return ts1.requiredPurchases - ts2.requiredPurchases;
            });
            return stock;
        }
        return [];
    };

    getRandomTrader = () => {
        const random = Math.random() * 100;
        const potentialTraders = traders
            .filter(tr => this.props.traders.fixed.map(t => t.id).indexOf(tr.id))
            .filter(tr => this.props.traders.regular.map(t => t.id).indexOf(tr.id))
            .filter(tr => tr.level <= this.props.level)
            .filter(tr => tr.weighting <= random);
        let randomTrader = _.shuffle(potentialTraders)[0];
        if (randomTrader) {
            randomTrader.stock = this.getStock(randomTrader);
            return randomTrader;
        } else {
            console.log('No Traders for: ', random, this.props.traders);
        }
        return null;
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
        const character = characters.find(c => c.name === this.props.trader.character);
        return <ConstructionMenuTwoPart
            topChildren={<div className='title'>Trader</div>}
            bottomChildren={
                (this.props.trader && (
                    <>
                        <div className={'traderCharacter'}>
                            <div className={'traderCharacterImage'}>
                                <img alt={character.name} src={'/images/characters/character' + character.id + '.png'} />
                                <div className={'countTrades'}>{this.props.trades[this.props.trader.id] || 0} Trades</div>
                            </div>
                            <div className={'traderCharacterText'}>
                                <div className={'traderCharacterName'}>{character.name}</div>
                                <div className={'traderCharacterBlurb'}>{character.blurb}</div>
                            </div>
                        </div>
                        <div className={'traderStock'}>
                            {
                                this.props.trader.stock.filter(s => s.requiredPurchases <= (this.props.trades[this.props.trader.id] || 0)).map(s => {
                                    console.log('Stock: ', s);
                                    return <div key={s.itemObj.image + ':' + s.requiredPurchases} className={'stockRow'}>
                                        <img alt={s.itemObj.name} src={'/images/' + s.itemObj.image} />
                                        <div className={'nameAndCount'}>
                                            <div>{s.itemObj.name}</div>
                                            <div>{s.stock - (s.purchases || 0)} / {s.stock}</div>
                                        </div>
                                        <div className={'buy'} onClick={() => {
                                            if (s.stock - (s.purchases || 0) > 0) {
                                                this.props.buyItems(s, s.itemObj, 1, this.props.trader.id);
                                            }
                                        }}>Buy</div>
                                    </div>
                                })
                            }
                        </div>
                    </>
                )) || undefined
            }
            close={this.props.showMarketPopup} />
    }
}

const mapDispatchToProps = (dispatch) => ({
    showMarketPopup: () => dispatch(setPopup('market')),
    showTraderPopup: (trader) => dispatch(setPopup('trader', trader)),
    buyItems: (stock, item, count, traderId) => {
        return dispatch({
            type: 'buy',
            queue: 'market',
            count: count,
            item: item,
            traderId: traderId,
            stock: stock,
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
    }),
    removeSoldoutTraders: () => dispatch({
        type: 'removeSoldOutTraders',
    }),
});

const mapStateToProps = (store) => {
    const newLocal = {
        inventory: store.inventory,
        level: store.level,
        marketCraftingStack: store.marketQueue,
        premium: store.premium,
        traders: store.traders,
        traderCount: store.traderCount,
        trades: store.trades,
        trader: store.trader,
        traderstock: store.traderstock,
    };
    return newLocal;
};

export const MarketPopup = connect(mapStateToProps, mapDispatchToProps)(MPopup);
export const TraderPopup = connect(mapStateToProps, mapDispatchToProps)(TPopup);
export default connect(mapStateToProps, mapDispatchToProps)(Market);
