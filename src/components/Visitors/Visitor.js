import React from 'react';
import './Visitor.scss';
import {setPopup} from "../shared/actions";
import {connect} from "react-redux";

const Visitor = ({visitor, showVisitorPopup}) => {
    return (
        <div onClick={() => showVisitorPopup(visitor)} className={'visitor'}><img alt={visitor.visitorType.name} src={'/images/visitors/visitor' + visitor.visitorType.visitorID + '.png'} /></div>
    )
};

const mapDispatchToProps = (dispatch) => ({
    showVisitorPopup: (visitor) => dispatch(setPopup({popupType:'visitor', visitor})),
});

export default connect(null, mapDispatchToProps)(Visitor);
