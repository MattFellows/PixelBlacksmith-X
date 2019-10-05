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

const mapStateToProps = (state) => {
    return {
        level: state.level,
        xp: state.xp,
        gold: state.gold,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        resetInventory: () => dispatch({type: 'resetInventory'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerInfo);
