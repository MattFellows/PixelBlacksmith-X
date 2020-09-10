import React from "react"
import "./VisitorStats.scss"
import { connect } from "react-redux"

const getPreference = (visitorType, type, visitorStats) => {
  const myStats = visitorStats.find(
    (vs) => vs.visitorID === visitorType.visitorID
  )
  return type !== "best" && myStats?.[`${type}Discovered`]
    ? {
        preference: visitorType?.[`${type}Preferred`]?.name,
        preferenceImage: `/images/preferences/${type}${
          visitorType?.[`${type}Preferred`]?.value
        }.png`,
        multiplier: visitorType?.[`${type}Multiplier`],
      }
    : null
}

const VisitorPreference = ({ type, visitorType, visitorStats }) => {
  const preference = getPreference(visitorType, type, visitorStats)
  if (type && visitorType) {
    return (
      <div className="visitorPreferenceContainer">
        <div className="visitorPreference">
          <div className="visitorPreferenceImage">
            {preference && (
              <img
                src={preference?.preferenceImage}
                alt={preference?.preference?.toLowerCase() || "unknown"}
              />
            )}
          </div>
          <div className="visitorPreferenceLabel">
            {preference?.multiplier
              ? `+${Math.ceil((preference?.multiplier - 1) * 100)}%`
              : "? ? ?"}
          </div>
        </div>
        <div>{type}</div>
      </div>
    )
  }
  return null
}

const VisitorStats = ({ visitor, visitorStats, visitorTypes }) => {
  const preferenceProps = {
    visitorType: visitorTypes.find((v) => v.visitorID === visitor.visitorID),
    visitorStats,
  }
  return (
    <div className="visitorCharacter">
      <div className="visitorCharacterImage">
        <img
          alt={visitor.name}
          src={`/images/visitors/visitor${visitor.visitorID}.png`}
        />
        <div className="countVisits">
          Visits: {visitorStats?.[visitor.visitorID]?.visits || 0}
        </div>
      </div>
      <div className="visitorCharacterText">
        <div className="visitorCharacterName">{visitor.name}</div>
        <div className="visitorCharacterBlurb">{visitor.desc}</div>
      </div>
      <div className="visitorPreferences">
        <VisitorPreference type="type" {...preferenceProps} />
        <VisitorPreference type="tier" {...preferenceProps} />
        <VisitorPreference type="state" {...preferenceProps} />
        <VisitorPreference type="best" {...preferenceProps} />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    visitorStats: state.visitorStats,
    visitorTypes: state.visitorTypes,
  }
}

export default connect(mapStateToProps)(VisitorStats)
