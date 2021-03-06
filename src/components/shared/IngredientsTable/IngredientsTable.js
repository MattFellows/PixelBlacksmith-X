import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import "./IngredientsTable.scss"
import { ITEM_STATE } from "../inventory"

class IngredientsTable extends Component {
  render() {
    return (
      <div className="ingredientsContainer">
        <div className="ingredientsTable">
          <table>
            <thead>
              <tr>
                <th />
                <th />
                <th>Need</th>
                <th>Have</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="icon">
                  <img alt="level" src="/images/levels.png" />
                </td>
                <td className="name">Level</td>
                <td className="count centered">{this.props.product.level}</td>
                <td className="count centered">{this.props.level}</td>
              </tr>
              {this.props.product.ingredients
                .filter(
                  (i) => i.itemState === (this.props.ingredientState || 1)
                )
                .map((ing) => {
                  return (
                    <tr key={ing.name}>
                      <td className="icon">
                        {ing.image && (
                          <img alt="ing.name" src={`/images/${ing.image}`} />
                        )}
                      </td>
                      <td className="name">
                        {(ing.ingredientState === ITEM_STATE.UNFINISHED
                          ? "(unf) "
                          : "") + ing.name}
                      </td>
                      <td className="count centered">{ing.count}</td>
                      <td className="count centered">
                        {
                          this.props.inventory.find(
                            (item) => item.name === ing.name
                          ).count[ing.ingredientState]
                        }
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        <div className="buttonContainer">
          <div
            onClick={() => {
              this.props.action(1)
            }}
            className="button"
          >{`${this.props.actionName} 1`}</div>
          <div
            onClick={() => {
              this.props.action(10)
            }}
            className="button narrow"
          >
            10
          </div>
          <div
            onClick={() => {
              this.props.action("max")
            }}
            className="button narrow"
          >
            Max
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  inventory: store.inventory,
})

IngredientsTable.propTypes = {
  ingredientState: PropTypes.number,
}

export default connect(mapStateToProps)(IngredientsTable)
