import React, { Component } from "react"
import { connect } from "react-redux"
import moment from "moment"
import "./StackOfStacks.scss"

class StackOfStacks extends Component {
  constructor(props) {
    super(props)
    const { crafting } = this.props;
    this.state = {
      crafting,
    }
  }

  updateCountdown = () => {
    const { queue, addToInventoryAndRemoveFromQueue } = this.props;
    const { crafting } = this.state;
    const newStateCrafting = [...crafting]
    newStateCrafting
      .filter((i) => !i.removeMe)
      .forEach((i) => {
        // eslint-disable-next-line no-param-reassign
        i.remainingTime = i.finishTime
          ? moment(i.finishTime).diff(moment())
          : null
        if (i.remainingTime < 0) {
          addToInventoryAndRemoveFromQueue(i, queue)
          // eslint-disable-next-line no-param-reassign
          i.removeMe = true
        }
      })
    this.setState({
      crafting: newStateCrafting,
    })
  }

  checkAndUpdateStacks = () => {
    const { availableStacks, updateFinishTime } = this.props;
    const { crafting } = this.state;
    const newStateCrafting = [...crafting].filter(
      (i) => i && !i.removeMe
    )
    let currentlyCraftingCount = newStateCrafting.filter(
      (i) => i && i.finishTime && i.remainingTime
    ).length
    if (currentlyCraftingCount < availableStacks) {
      const allRemainingStacks = crafting.filter((i) => !i.removeMe)
      for (let i = 0; i < allRemainingStacks.length; i += 1) {
        const item = allRemainingStacks[i]
        if (
          currentlyCraftingCount < availableStacks &&
          !item.finishTime
        ) {
          item.finishTime = moment()
            .add(item.time[0], item.time[1])
            .toDate()
            .getTime()
          item.remainingTime = item.time[0] * 1000
          updateFinishTime(item, item.finishTime)
          currentlyCraftingCount += 1;
        }
      }
    }
    this.setState({
      crafting: newStateCrafting,
    })
  }

  componentDidMount = () => {
    setInterval(this.updateCountdown, 1000)
    setTimeout(() => setInterval(this.checkAndUpdateStacks, 1000), 500)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps = (props) => {
    this.setState({
      crafting: props.crafting,
    })
  }

  render() {
    const { availableStacks, level, nextStackLevel } = this.props;
    const { crafting } = this.state;
    const craftingStacks = [...crafting].filter(
      (i) => i && !i.removeMe && i.finishTime && i.remainingTime > 0
    )
    return (
      <div className="stacksContainer">
        {craftingStacks.map((i, ind) => {
          return (
              // eslint-disable-next-line react/no-array-index-key
            <div key={`${i.image}-${ind}`} className="stack">
              <img alt={i.image} src={`/images/${i.image}`} />
              <div className="overlay">{`${Math.ceil(
                i.remainingTime / 1000
              )}s`}</div>
            </div>
          )
        })}
        {[
          ...Array(availableStacks - craftingStacks.length).keys(),
        ].map((_i, ind) => (
            // eslint-disable-next-line react/no-array-index-key
          <div key={`emptyStack${ind}`} className="stack" />
        ))}
        {nextStackLevel > level && (
          <div key="nextStack" className="stack">
            <img alt="padlock" src="/images/padlock.png" />
            <div className="overlay">{`Lv ${nextStackLevel}`}</div>
          </div>
        )}
        {crafting.filter((i) => !i.removeMe).length >
          craftingStacks.length && (
          <div key="unstartedStacks" className="stack">
            <div className="overlay2">{`+ ${
              crafting.filter((i) => !i.removeMe).length -
              craftingStacks.length
            }`}</div>
            <div className="overlay">&nbsp;</div>
          </div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToInventoryAndRemoveFromQueue: (item, queue) => {
      dispatch({
        type: "addInventoryAndRemoveFromQueue",
        item,
        queue,
      })
    },
  }
}

export default connect(null, mapDispatchToProps)(StackOfStacks)
