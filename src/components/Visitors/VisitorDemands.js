import React from "react";
import cx from "classnames";
import { connect } from "react-redux";

import { STATES } from "../shared/reducers";
import "./VisitorDemands.scss";
import { sellToVisitor, setPopup } from "../shared/actions";
import ConstructionMenuTwoPart from "../shared/ConstructionMenu/ConstructionMenuTwoPart";
import { ConnectedInventoryTable } from "../Inventory/Inventory";

const titleCase = (str) => {
  let s = str;
  if (s.charAt) {
    s = s.toLowerCase();
    return (
      s.charAt(0).toUpperCase() +
      s
        .slice(1)
        .split("")
        .map((c) => c.toLowerCase())
        .join("")
    );
  }
  return s;
};

const VisitorDemands = ({ visitor, sellFromInventory }) => {
  return (
    <div className="visitorDemands">
      {visitor?.visitorDemands?.map?.((vd) => {
        const qty = `${vd.quantity - vd.quantityProvided}x `;
        const type = `${titleCase(vd.type)}: `;
        const descr =
          vd.type === "state"
            ? titleCase(STATES.find((s) => s.value === vd.value)?.name || "")
            : titleCase(vd.value);
        return (
          <div key={vd.id} className="visitorDemand">
            <div
              className={cx(
                vd.quantityProvided < vd.quantity ? "notMet" : "met",
                "demandState"
              )}
            />
            <div
              className={cx("demand", {
                optional: !vd.required,
                met: vd.quantityProvided >= vd.quantity,
              })}
            >
              {qty + type + descr}
            </div>
            {vd.quantityProvided < vd.quantity && (
              <div
                className="sellFromInventory"
                onClick={() => {
                  sellFromInventory(visitor, vd);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Popup = ({ visitor, visitorDemand, closeSale, sell, inventory }) => {
  const filterByDemand = (inv) => {
    /* if (visitorDemand.type === "state") {
      for (let i = 0; i < Object.entries(inv.count).length; i += 1) {
        const [key] = Object.entries(inv.count)[i];
        if (parseInt(key, 10) !== parseInt(visitorDemand.value, 10)) {
          // eslint-disable-next-line no-param-reassign
          inv.count[key] = 0;
        }
      }
    } */
    return (
      (visitorDemand.type === "type" && inv.type === visitorDemand.value) ||
      (visitorDemand.type === "state" && inv.count[visitorDemand.value] > 0) ||
      (visitorDemand.type === "tier" && inv.tier === visitorDemand.value)
    );
  };
  return (
    <ConstructionMenuTwoPart
      topChildren={<div className="title">Trade</div>}
      bottomChildren={
        <ConnectedInventoryTable
          overrideInventoryFilter={filterByDemand}
          overrideStateFilter={visitorDemand.type === "state" ? visitorDemand.value : undefined}
          overrideSale={(item, state) => {
            sell(sellToVisitor({ visitor, visitorDemand, item, state }));
          }}
        />
      }
      close={() => closeSale(visitor)}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  sellFromInventory: (visitor, visitorDemand) =>
    dispatch(
      setPopup({
        popupType: "visitorSale",
        visitor,
        visitorDemand,
      })
    ),
});

const mapTradePopupStateToProps = (state) => ({
  visitor: state.visitor,
  visitorDemand: state.visitorDemand,
  inventory: state.inventory,
});

const mapTradeDispatchToProps = (dispatch) => ({
  closeSale: (visitor) => {
    dispatch(setPopup({}));
    dispatch(setPopup({ popupType: "visitor", visitor }));
  },
  sell: (action) => dispatch(action),
});

export const TradePopup = connect(
  mapTradePopupStateToProps,
  mapTradeDispatchToProps
)(Popup);
export default connect(null, mapDispatchToProps)(VisitorDemands);
