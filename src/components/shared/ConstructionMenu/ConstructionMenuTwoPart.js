import React from "react"
import ConstructionMenu from "./ConstructionMenu"
import "./ConstructionMenu.scss"

class ConstructionMenuTwoPart extends ConstructionMenu {
  render() {
    return (
      <div className="twoPartContainer">
        <div className="twoPartMenu">
          <div className="topContainer">
            <div className="help" />
            {this.props.topChildren}
            <div className="close" onClick={this.close} />
          </div>
          <div className="bottomContainer">{this.props.bottomChildren}</div>
        </div>
      </div>
    )
  }
}

export default ConstructionMenuTwoPart
