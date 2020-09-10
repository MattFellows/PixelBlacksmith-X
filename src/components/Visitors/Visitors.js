import React, { Component } from "react"
import { connect } from "react-redux"

import "./Visitors.scss"
import Visitor from "./Visitor"
import VisitorStats from "./VisitorStats"
import ConstructionMenuThreePart from "../shared/ConstructionMenu/ConstructionMenuThreePart"
import VisitorDemands from "./VisitorDemands"

const Visitors = ({ visitors }) => {
  return (
    <div className="visitors">
      {visitors.map((v) => (
        <Visitor key={`${v.name}-${v.visitorID}`} visitor={v} />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => ({
  visitors: state.visitors,
})

export default connect(mapStateToProps)(Visitors)

class Popup extends Component {
  render() {
    return (
      <ConstructionMenuThreePart
        topChildren={<div className="title">Visitor</div>}
        middleChildren={
          <VisitorStats visitor={this.props.visitor.visitorType} />
        }
        bottomChildren={<VisitorDemands visitor={this.props.visitor} />}
        close={this.props.close}
        even
      />
    )
  }
}

const mapPopupStateToProps = (state) => ({
  visitor: state.visitor,
})

export const VisitorPopup = connect(mapPopupStateToProps)(Popup)
