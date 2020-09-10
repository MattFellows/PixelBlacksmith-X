import React from "react"
import ConstructionMenu from "./ConstructionMenu"
import "./ConstructionMenu.scss"
import cx from "classnames"

class ConstructionMenuThreePart extends ConstructionMenu {
  render() {
    return (
      <div
        className="threePartContainer"
        onScroll={(e) => {
          e.preventDefault()
        }}
      >
        <div className={cx("threePartMenu", { even: this.props.even })}>
          <div className="topContainer">
            <div className="help" />
            {this.props.topChildren}
            <div className="close" onClick={this.close} />
          </div>
          <div className={cx("middleContainer", { even: this.props.even })}>
            {this.props.middleChildren}
          </div>
          <div className={cx("bottomContainer", { even: this.props.even })}>
            {this.props.bottomChildren}
          </div>
        </div>
      </div>
    )
  }
}

export default ConstructionMenuThreePart
