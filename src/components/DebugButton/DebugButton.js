import React from "react"
import "./DebugButton.scss"
import { connect } from "react-redux"

const DebugButton = ({ addGold }) => {
  const click = () => {
    addGold()
  }

  return <div className="debugButton" onClick={click} />
}

const mapDispatchToProps = (dispatch) => ({
  addGold: () =>
    dispatch({
      type: "addGold",
    }),
})

export default connect(null, mapDispatchToProps)(DebugButton)
