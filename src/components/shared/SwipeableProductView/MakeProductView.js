import React, { Component } from "react"
import ActionPage from "../ActionPage/ActionPage"
import { ITEM_STATE } from "../inventory"

class MakeProductView extends Component {
  render() {
    return (
      <div className="swiperItem">
        <ActionPage
          name={
            (this.props.itemState === ITEM_STATE.UNFINISHED ? "(unf) " : "") +
            this.props.product.name
          }
          image={this.props.product.image}
          count={this.props.product.count[this.props.itemState]}
          description={this.props.product.description}
          redacted={this.props.level < this.props.product.level}
        />
      </div>
    )
  }
}

export default MakeProductView
