import React from 'react';
import './Visitor.scss';
import {setPopup} from "../shared/actions";
import {connect} from "react-redux";

const Visitor = ({visitor, showVisitorPopup}) => {
    console.log('Visitor: ', visitor);
    return (
        <div onClick={() => showVisitorPopup(visitor)} className={'visitor'}><img alt={visitor.name} src={'/images/visitors/visitor' + visitor.visitorID + '.png'} /></div>
    )
};

const mapDispatchToProps = (dispatch) => ({
    showVisitorPopup: (visitor) => dispatch(setPopup('visitor', null, visitor)),
});

export default connect(null, mapDispatchToProps)(Visitor);
