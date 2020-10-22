/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from "react";
import { CompositeFeature, EnumFeature, GenericExposedFeature, GenericOrCompositeFeature } from "../../../types";
import { scale } from "../../../utils";
import { isBinaryFeature, isCoverFeature, isEnumFeature, isLightFeature, isLockFeature, isNumericFeature, isSwitchFeature } from "../../device-page/type-guards";

import Numeric from "../numeric/numeric";

import { BaseFeatureProps } from "../base";
import Binary from "../binary/binary";
import Enum from "../enum/enum";
import { ValueWithLabelOrPrimitive } from "../../enum-editor/enum-editor";
import Light from "../light/light";
import Switch from "../switch/switch";
import Cover from "../cover/cover";
import Lock from "../lock/lock";

type CompositeType = "device" | "light" | "switch" | "cover" | "lock";

interface CompositeProps extends BaseFeatureProps<CompositeFeature> {
  type: CompositeType;
}


const stepsConfiguration = {
  light: {
    brightness: [0, 25, 50, 75, 100].map<ValueWithLabelOrPrimitive>(item => ({ value: scale(item, [0, 100], [0, 255]), title: item + '%' })),
    color_temp: [1000, 2000, 3000, 4000, 5000, 6500].map<ValueWithLabelOrPrimitive>(kelvin => ({ value: 1000000.0 / kelvin, title: kelvin + 'K' }))
  },
  cover: {
    position: [0, 25, 50, 75, 100].map<ValueWithLabelOrPrimitive>(item => ({ value: item, title: item + '' })),
    tilt: [0, 25, 50, 75, 100].map<ValueWithLabelOrPrimitive>(item => ({ value: item, title: item + '' }))
  }
};


export default class Composite extends Component<CompositeProps, {}> {
  render() {
    const { type, deviceState, device, feature: { features }, onChange } = this.props;
    const steps = stepsConfiguration[type] ?? {};
    return features?.map(feature => {
      if (isBinaryFeature(feature)) {
        return <div className="row mb-3" key={JSON.stringify(feature)}>
          <label className="col-3 col-form-label">{feature.name}</label>
          <div className="col-9">
            <Binary
              feature={feature}
              device={device}
              deviceState={deviceState}
              onChange={onChange}
            />
          </div>
        </div>
      } else if (isNumericFeature(feature)) {
        return <div className="row mb-3" key={JSON.stringify(feature)}>
          <label className="col-3 col-form-label">{feature.name}</label>
          <div className="col-9">
            <Numeric
              feature={feature}
              device={device}
              deviceState={deviceState}
              onChange={onChange}
              steps={steps[feature.name]}
            />
          </div>
        </div>
      } else if (isEnumFeature(feature)) {
        return <div className="row mb-3" key={JSON.stringify(feature)}>
          <label className="col-3 col-form-label">{feature.name}</label>
          <div className="col-9">
            <Enum
              feature={feature as EnumFeature}
              device={device}
              deviceState={deviceState}
              onChange={onChange}

            />
          </div>
        </div>
      } else if (isLightFeature(feature)) {
        return (
          <div className="card" key={JSON.stringify(feature)}>
            <div className="card-body">
              <h5 className="card-title">Light</h5>
              <Light
                feature={feature}
                device={device}
                deviceState={deviceState}
                onChange={onChange}
              />
            </div>
          </div>
        )
      } else if (isSwitchFeature(feature)) {
        return (
          <div className="card" key={JSON.stringify(feature)}>
            <div className="card-body">
              <h5 className="card-title">Switch</h5>
              <Switch
                feature={feature}
                device={device}
                deviceState={deviceState}
                onChange={onChange}
              />
            </div>
          </div>
        )
      }
      else if (isCoverFeature(feature)) {
        return (
          <div className="card" key={JSON.stringify(feature)}>
            <div className="card-body">
              <h5 className="card-title">Cover</h5>
              <Cover
                feature={feature}
                device={device}
                deviceState={deviceState}
                onChange={onChange}
              />
            </div>
          </div>
        )
      }
      else if (isLockFeature(feature)) {
        return (
          <div className="card" key={JSON.stringify(feature)}>
            <div className="card-body">
              <h5 className="card-title">Lock</h5>
              <Lock
                feature={feature}
                device={device}
                deviceState={deviceState}
                onChange={onChange}
              />
            </div>
          </div>
        )
      }
      else {
        return (<div className="row mb-3" key={JSON.stringify(feature)}>
          <label className="col-3 col-form-label">Unknown feature {feature.type}({feature.name})</label>
          <div className="col-9">{JSON.stringify(feature)}{JSON.stringify(deviceState)}</div>
        </div>);
      }
      // switch (feature.type) {
      //   // case "color_xy":
      //   // case "color_hs":
      //   //   {
      //   //     const { color, brightness } = deviceState;
      //   //     return <div className="row mb-3" key={feature}>
      //   //       <label className="col-3 col-form-label">Color ({feature})</label>
      //   //       <div className="col-9">
      //   //         <Color
      //   //           key={feature}
      //   //           onChange={this.onFeatureChange}
      //   //           name="color"
      //   //           value={color}
      //   //           brightness={brightness}
      //   //           format={feature}
      //   //         />
      //   //       </div>
      //   //     </div>
      //   //   }


      //   default:
      //     return (<div className="row mb-3" key={JSON.stringify(feature)}>
      //       <label className="col-3 col-form-label">Unknown feature {feature.type}({feature.name})</label>
      //       <div className="col-9">{JSON.stringify(feature)}{JSON.stringify(deviceState)}</div>
      //     </div>);

      // }
    })

  }
}
