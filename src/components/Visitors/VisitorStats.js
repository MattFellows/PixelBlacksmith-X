import React from 'react';
import './VisitorStats.scss';
import {connect} from "react-redux";

const VisitorPreference = ({type}) => {
    return <div className={'visitorPreference'}>
        <div className={'visitorPreferenceImage'}></div>
        <div className={'visitorPreferenceLabel'}>{type}</div>
    </div>;
}

const VisitorStats = ({visitor, visitorStats}) => {
    return (<div className={'visitorCharacter'}>
        <div className={'visitorCharacterImage'}>
            <img alt={visitor.name} src={'/images/visitors/visitor' + visitor.visitorID + '.png'} />
            <div className={'countVisits'}>Visits: {visitorStats?.[visitor.visitorID]?.visits || 0}</div>
        </div>
        <div className={'visitorCharacterText'}>
            <div className={'visitorCharacterName'}>{visitor.name}</div>
            <div className={'visitorCharacterBlurb'}>{visitor.desc}</div>
        </div>
        <div className={'visitorPreferences'}>
            <VisitorPreference type={'type'} />
            <VisitorPreference type={'tier'} />
            <VisitorPreference type={'state'} />
            <VisitorPreference type={'Best'} />
        </div>
    </div>);
}

const mapStateToProps = (state) => {
    return ({
        visitorStats: state.visitorStats,
    });
}

export default connect(mapStateToProps)(VisitorStats);