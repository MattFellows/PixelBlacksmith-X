import React from 'react';
import {connect} from "react-redux";
import './PlayerInfo.css';

class PlayerInfo extends React.Component {
    render() {
        return (
            <div className={'playerInfoContainer'}>Level {this.props.level} ({this.props.xp})</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        level: state.level,
        xp: state.xp,
    }
};

export default connect(mapStateToProps)(PlayerInfo);
