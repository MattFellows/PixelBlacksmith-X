import React from "react"
import "./Visitor.scss"
import { connect } from "react-redux"
import { setPopup } from "../shared/actions"

const Visitor = ({ visitor, showVisitorPopup }) => {
  return (
    <div onClick={() => showVisitorPopup(visitor)} className="visitor">
      <img
        alt={visitor.visitorType.name}
        src={`/images/visitors/visitor${visitor.visitorType.visitorID}.png`}
      />
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  showVisitorPopup: (visitor) =>
    dispatch(setPopup({ popupType: "visitor", visitor })),
})

export default connect(null, mapDispatchToProps)(Visitor)
