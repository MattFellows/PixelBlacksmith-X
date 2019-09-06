import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import wallpaper from './Wallpaper.png';
import { setPopup } from './components/shared/actions';
import Furnace, { FurnacePopup } from './components/Furnace/Furnace';

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
      default: {
        return null;
      }
    }
  }

  render() {
    return (
      <div className="App">
        <img className='wallpaper' alt='wallpaper' src={wallpaper}/>
        <Furnace />
        {this.props.popup && this.renderPopup(this.props.popup)}
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
