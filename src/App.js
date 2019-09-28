import React, { Component } from 'react';
import { connect } from 'react-redux';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import './App.css';
import wallpaper from './Wallpaper.png';
import { setPopup } from './components/shared/actions';
import Furnace, { FurnacePopup } from './components/Furnace/Furnace';
import PlayerInfo from "./components/PlayerInfo/PlayerInfor";
import Anvil, {AnvilPopup} from "./components/Anvil/Anvil";

class App extends Component  {



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
        {popup}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    popup: state.popup
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPopupVisible: (popupType) => dispatch(setPopup(popupType)),
    setPopupHidden: () => dispatch(setPopup(null)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
