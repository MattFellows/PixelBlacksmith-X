import React, { Component } from 'react';
import { connect } from 'react-redux';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import wallpaper from './Wallpaper.png';
import { setPopup } from './components/shared/actions';
import Furnace, { FurnacePopup } from './components/Furnace/Furnace';
import PlayerInfo from "./components/PlayerInfo/PlayerInfor";
import Anvil, {AnvilPopup} from "./components/Anvil/Anvil";
import Table, {TablePopup} from "./components/Table/Table";
import Inventory, {InventoryPopup} from "./components/Inventory/Inventory";
import Market, {MarketPopup, TraderPopup} from "./components/Market/Market";
import DebugButton from "./components/DebugButton/DebugButton";
import Visitors, {VisitorPopup} from "./components/Visitors/Visitors";


class App extends Component  {

    constructor(props) {
        super(props);
        setInterval(this.props.clearup, 1000);
    }

    componentDidMount = () => {
        //setTimeout(() => this.props.setPopupVisible('furnace'), 1000);
        //setTimeout(this.props.setPopupHidden, 15000);
    }

    renderPopup = (popupType)  => {
        switch(popupType) {
            case 'furnace': {
                return <FurnacePopup close={this.props.setPopupHidden}/>;
            }
            case 'anvil': {
                return <AnvilPopup close={this.props.setPopupHidden}/>;
            }
            case 'table': {
                return <TablePopup close={this.props.setPopupHidden}/>;
            }
            case 'inventory': {
                return <InventoryPopup close={this.props.setPopupHidden}/>;
            }
            case 'market': {
                return <MarketPopup close={this.props.setPopupHidden}/>;
            }
            case 'trader': {
                return <TraderPopup />;
            }
            case 'visitor': {
                return <VisitorPopup close={this.props.setPopupHidden} />;
            }
            default: {
                return null;
            }
        }
    }

    render() {
        let popup = this.renderPopup(this.props.popup);
        if (this.props.popup) {
            //this.popupRef = React.forwardRef(popup);
            disableBodyScroll();
        } else {
            enableBodyScroll();
        }
        return (
            <div className="App">
                <img className='wallpaper' alt='wallpaper' src={wallpaper}/>
                <PlayerInfo />
                <Furnace />
                <Anvil />
                <Table />
                <Inventory />
                <Market />
                <DebugButton />
                <Visitors />
                {popup}
                <ToastContainer autoClose={5000} position={toast.POSITION.BOTTOM_CENTER}/>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        popup: store.popup
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPopupVisible: (popupType) => dispatch(setPopup(popupType)),
        setPopupHidden: () => dispatch(setPopup(null)),
        clearup: () => {
            dispatch({type:'removeDeleted',queue:'anvil'});
            dispatch({type:'removeDeleted',queue:'furnace'});
            dispatch({type:'checkAndAddTraders'});
            dispatch({type:'removeSoldOutTraders'});
            if (new Date().getSeconds() % 60 === 0) {
                dispatch({type:'resetStock'});
            }
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
