import React from "react"
import { connect } from "react-redux"
import StackOfStacks from "../shared/StackOfStacks/StackOfStacks"
import { setPopup } from "../shared/actions"
import "./Anvil.scss"

class Anvil extends React.Component {
  getAvailableAnvilStacks = () => {
    const { premium, level: l } = this.props
    if (l < 3) {
      return premium + 1
    }
    if (l < 7) {
      return premium + 2
    }
    if (l < 16) {
      return premium + 3
    }
    if (l < 25) {
      return premium + 4
    }
    if (l < 33) {
      return premium + 5
    }
    if (l < 42) {
      return premium + 6
    }
    return premium + 7
  }

  getNextStackLevel() {
    const { level: l } = this.props;
    if (l < 3) {
      return 3
    }
    if (l < 7) {
      return 7
    }
    if (l < 16) {
      return 16
    }
    if (l < 25) {
      return 25
    }
    if (l < 33) {
      return 33
    }
    return 42
  }

  render() {
    const { anvilCraftingStack, showAnvilPopup, updateFinishTime, level } = this.props;
    return (
      <div className="anvilArea" onClick={showAnvilPopup}>
        <StackOfStacks
          availableStacks={this.getAvailableAnvilStacks()}
          nextStackLevel={this.getNextStackLevel()}
          crafting={anvilCraftingStack}
          queue="anvil"
          updateFinishTime={updateFinishTime}
          level={level}
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  showAnvilPopup: () => dispatch(setPopup({ popupType: "anvil" })),
  updateFinishTime: (item, finishTime) =>
      dispatch({
        type: "updateFinishTime",
        queue: "anvil",
        uuid: item.uuid,
        finishTime,
      }),
})

const mapStateToProps = (store) => ({
  inventory: store.inventory,
  level: store.level,
  anvilCraftingStack: store.anvilQueue,
  premium: store.premium,
})

export default connect(mapStateToProps, mapDispatchToProps)(Anvil)
