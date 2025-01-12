import React, { Component } from "react";
import { Device, Cluster, Endpoint } from "../../types";
import BindRow from "./bind-row";
import actions from "../../actions/actions";
import { BindApi } from "../../actions/BindApi";
import { connect } from "unistore/react";
import { GlobalState, Group } from "../../store";
import { getEndpoints } from "../../utils";


interface PropsFromStore {
    devices: Record<string, Device>;
    groups: Group[];
}
interface BindProps {
    device: Device;
}

export interface NiceBindingRule {
    id?: number;
    isNew?: number;
    source: {
        ieee_address: string;
        endpoint: Endpoint;
    };
    target: {
        id?: number;
        endpoint?: Endpoint;
        ieee_address?: string;
        type: "endpoint" | "group";
    };
    clusters: Cluster[];
}
const rule2key = (rule: NiceBindingRule): string => `${rule.source.endpoint}-${rule.isNew}${rule.source.ieee_address}-${rule.target.id}-${rule.target.ieee_address}-${rule.clusters.join('-')}`;
const convertBidningsIntoNiceStructure = (device: Device): NiceBindingRule[] => {
    const bindings = {};
    Object.entries(device.endpoints).forEach(([endpoint, description]) => {
        description.bindings
            .forEach(b => {
                let targetId = b.target.id ?? `${b.target.ieee_address}-${b.target.endpoint}`;

                targetId = `${targetId}-${endpoint}`;

                if (bindings[targetId]) {
                    bindings[targetId].clusters.push(b.cluster);
                } else {
                    bindings[targetId] = {
                        source: {
                            ieee_address: device.ieee_address,
                            endpoint
                        },
                        target: b.target,
                        clusters: [b.cluster]
                    }
                }
            });
    });
    return Object.values(bindings);
}
type BindState = {
    bidingRules: NiceBindingRule[];
}
export class Bind extends Component<BindProps & PropsFromStore & BindApi, BindState> {
    state: BindState = {
        bidingRules: []
    }
    static getDerivedStateFromProps(props: Readonly<BindProps & PropsFromStore>): Partial<BindState> {
        const { device } = props;
        const endpoints = getEndpoints(device);
        const bidingRules = convertBidningsIntoNiceStructure(device);
        bidingRules.push({ isNew: Date.now(), target: {}, source: { 'ieee_address': device.ieee_address, endpoint: endpoints[0] }, clusters: [] } as unknown as NiceBindingRule);
        return { bidingRules };
    }
    renderBody() {
        const { device, devices, groups, removeBind, addBind } = this.props;
        const { bidingRules } = this.state;
        return bidingRules
            .map((rule, idx) => <BindRow
                key={rule2key(rule)}
                rule={rule}
                groups={groups}
                onUnBind={removeBind}
                onBind={addBind}
                device={device}
                idx={idx}
                devices={devices} />)
    }
    render() {
        return <div className="container-fluid">
            {this.renderBody()}
        </div>;
    }
}

const mappedProps = ["devices", "groups"];
const ConnectedBindPage = connect<BindProps, {}, GlobalState, PropsFromStore & BindApi>(mappedProps, actions)(Bind);
export default ConnectedBindPage
