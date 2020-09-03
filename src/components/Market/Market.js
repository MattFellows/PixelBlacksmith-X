import React from 'react';
import StackOfStacks from "../shared/StackOfStacks/StackOfStacks";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import {setPopup} from "../shared/actions";
import './Market.scss';
import ConstructionMenuTwoPart from "../shared/ConstructionMenu/ConstructionMenuTwoPart";
import characters from '../shared/characters';

class Market extends React.Component {

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
        const traderStock = this.props.traderstock.filter(s => s.trader === tr.id).sort((s1, s2) => s1.requiredPurchases - s2.requiredPurchases === 0 ? s1.baseValue - s2.baseValue : s1.requiredPurchases - s2.requiredPurchases);
        return <div key={tr.name} className={'traderContainer'}>
            <div className={'traderInfo'}>
                <div className={'traderName'}>{tr.name}</div>
                <div className={'traderBlurb'}>{tr.blurb}</div>
                <div className={'traderStockRow'}>{traderStock.map(ts => {
                    const itemObj = this.props.inventory.find(i => i.id === ts.item);
                    return <img alt={itemObj.name} key={itemObj.image + ts.requiredPurchases} src={'/images/'+itemObj.image} className={ts.requiredPurchases > tradeCount ? 'redacted' : ''}/>
                })}</div>
            </div>
            <div className={'traderButton'} onClick={() => this.props.showTraderPopup(tr)}>&nbsp;</div>
        </div>
    };

    render() {
        console.log('Traders: ', this.props.traders);
        return <ConstructionMenuTwoPart
            topChildren={<div className='title'>Market</div>}
            bottomChildren={
                <div className={'traders'}>
                {
                    (Array.isArray(this.props.traders.fixed) &&
                    this.props.traders.fixed.length &&
                        <div class={'header'}>Fixed</div>
                    ) || undefined
                }
                {
                    (Array.isArray(this.props.traders.fixed) &&
                        this.props.traders.fixed.length &&
                        this.props.traders.fixed.map(tr => {
                            return this.renderTrader(tr);
                        })) || undefined
                }
                {
                    (Array.isArray(this.props.traders.fixed) &&
                        this.props.traders.fixed.length &&
                        <div class={'header ptm'}>Normal</div>
                    ) || undefined
                }
                {
                    (Array.isArray(this.props.traders.regular) &&
                    this.props.traders.regular.length &&
                    this.props.traders.regular.map(tr => {
                        return this.renderTrader(tr)
                    })) || undefined
                }
                </div>
            }
            close={this.props.close} />
    }
}

class TPopup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            locked: false,
        }
    }
    componentDidUpdate(prevProps, prevState) {
        Object.entries(this.props).forEach(([key, val]) =>
            prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        if (this.state) {
            Object.entries(this.state).forEach(([key, val]) =>
                prevState[key] !== val && console.log(`State '${key}' changed`)
            );
        }
    }

    render() {
        const character = characters.find(c => c.name === this.props.trader.character);
        console.log('Trades: ', this.props.trades[this.props.trader.id]);
        const locked = Array.isArray(this.props.traders.fixed) && this.props.traders.fixed.length && this.props.traders.fixed.find(tr => tr.id === this.props.trader.id);
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
                                this.props.traderstock.filter(s => s.trader === this.props.trader.id && s.requiredPurchases <= (this.props.trades[this.props.trader.id] || 0)).map(s => {
                                    const itemObj = this.props.inventory.find(i => i.id === s.item);
                                    return <div key={itemObj.image + ':' + s.requiredPurchases} className={'stockRow'}>
                                        <img alt={itemObj.name} src={'/images/' + itemObj.image} />
                                        <div className={'nameAndCount'}>
                                            <div>{itemObj.name}</div>
                                            <div>{s.stock} / {s.maxStock}</div>
                                        </div>
                                        <div className={'buy'} onClick={() => {
                                            if (s.stock > 0 && this.props.gold > itemObj.baseValue) {
                                                this.props.buyItems(s, itemObj, 1, this.props.trader.id);
                                            } else if (s.stock > 0) {
                                                toast.error("You don't have enough gold.");
                                            } else {
                                                toast.error("The trader doesn't have enough stock");
                                            }
                                        }}>Buy</div>
                                    </div>
                                })
                            }
                        </div>
                        <div className={'buttonContainer'}>
                            <div className={'lockTraderButton'} onClick={() => this.props.lockTrader(this.props.trader)}><img alt='sell1' src='/images/button_narrow.png' /><div>lock<div className={'tickOrCross ' + (locked ? 'tick' : 'cross')} /></div></div>
                            <div className={'restockButton'} onClick={() => this.props.restockTrader(this.props.trader)}><img alt='buyAll' src='/images/button_wide.png' /><div>Restock</div></div>
                            <div className={'buyAll'} onClick={() => this.props.buyAll(this.props.trader)}><img alt='buyAll' src='/images/button_wide.png' /><div>Buy All</div></div>
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
    lockTrader: (trader) => dispatch({
        type: 'lock',
        trader: trader,
    }),
    restockTrader: (trader) => dispatch({
        type: 'restockTrader',
        trader: trader,
    }),
    buyAll: (trader) => dispatch({
        type: 'buyAll',
        trader: trader,
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

const mapStateToPropsTPopup = (store) => {
    const newLocal = {
        inventory: store.inventory,
        trades: store.trades,
        trader: store.trader,
        traders: store.traders,
        traderstock: store.traderstock,
        gold: store.gold,
    };
    return newLocal;
};

export const MarketPopup = connect(mapStateToProps, mapDispatchToProps)(MPopup);
export const TraderPopup = connect(mapStateToPropsTPopup, mapDispatchToProps)(TPopup);
export default connect(mapStateToProps, mapDispatchToProps)(Market);
