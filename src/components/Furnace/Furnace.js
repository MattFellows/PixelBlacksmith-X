import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConstructionMenuThreePart from '../shared/ConstructionMenu/ConstructionMenuThreePart';
import './Furnace.css';
import { setPopup } from '../shared/actions';

class Furnace extends Component {
    render() {
        return (<div className={'furnaceArea'} onClick={this.props.showFurnacePopup}>
            
        </div>)
    }
}

export class FurnacePopup extends Component {
    render() {
        return <ConstructionMenuThreePart topChildren={<div className='title'>Furnace</div>} close={this.props.close} />
    }
}

const mapDispatchToProps = (dispatch) => ({
    showFurnacePopup: () => dispatch(setPopup('furnace')),
});

export default connect(null, mapDispatchToProps)(Furnace);