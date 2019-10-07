import React from 'react';
import {connect} from "react-redux";
import './PlayerInfo.css';

class PlayerInfo extends React.Component {
    resetInventory = () => {

    }
    render() {
        return (
            <div onDoubleClick={this.props.resetInventory} className={'playerInfoContainer'}>
                Level: {this.props.level} ({this.props.xp})
                Gold: {this.props.gold}
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    return {
        level: store.level,
        xp: store.xp,
        gold: store.gold,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetInventory: () => dispatch({type: 'resetInventory'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerInfo);
