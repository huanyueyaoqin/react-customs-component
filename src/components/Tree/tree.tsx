import React, { Component } from "react";
import TreeNode from "./tree-node";
import { TreeData } from "typing";

import "./index.less";

interface Props {
  data: TreeData;
}
interface State {
  data: TreeData;
  fromNode?: TreeData;
}
interface KeyToNodeMap {
  [key: string]: TreeData;
}
export default class Tree extends Component<Props, State> {
  data: TreeData;
  keyToNodeMap!: KeyToNodeMap;
  constructor(props: Props) {
    super(props);
    this.data = props.data;
    this.state = { data: this.props.data };
    this.buildKeyMap();
  }

  buildKeyMap = () => {
    let data = this.data;
    this.keyToNodeMap = {};
    this.keyToNodeMap[data.key] = data;
    if (data.children && data.children.length > 0) {
      this.renderKey(data.children, data);
    }
  };
  renderKey = (children: Array<TreeData>, parent: TreeData): void => {
    // eslint-disable-next-line array-callback-return
    children.map((item: TreeData) => {
      item.parent = parent; //为每个节点设置父节点 为了后面全选
      this.keyToNodeMap[item.key] = item;
      if (item.children && item.children.length > 0) {
        this.renderKey(item.children, item);
      }
    });
  };

  onCollapse = (key: string) => {
    let data = this.keyToNodeMap[key];
    if (data) {
      data.collapsed = !data.collapsed;
      data.children = data.children || [];
      this.setState(() => ({ data: this.state.data }));
    }
  };

  onCheck = (key: string) => {
    let data: TreeData = this.keyToNodeMap[key];
    if (data) {
      data.checked = !data.checked;
      let { checked } = data;
      this.setChildrenCheckedStatus(data.children, checked); //将儿子都取消/选中
      if (data.checked) {
        this.checkParentAllCheckAll(data.parent!);
      } else {
        this.setParentUnChecked(data.parent!);
      }
      this.setState(() => ({ data: this.state.data }));
    }
  };

  setChildrenCheckedStatus = (children: Array<TreeData> = [], checked: boolean) => {
    children.forEach((item: TreeData) => {
      item.checked = checked;
      this.setChildrenCheckedStatus(item.children, checked);
    });
  };
  checkParentAllCheckAll = (parent: TreeData) => {
    while (parent) {
      parent.checked = parent.children!.every(item => item.checked);
      parent = parent.parent!;
    }
  };
  setParentUnChecked = (parent: TreeData) => {
    while (parent) {
      parent.checked = false;
      parent = parent.parent!;
    }
  };

  setFromNode = (fromNode: TreeData) => {
    this.setState({ ...this.state, fromNode });
  };
  onMove = (toNode: TreeData) => {
    let fromNode = this.state.fromNode;
    let fromNodeBrother = fromNode.parent.children;
    let fromIndex = fromNodeBrother.findIndex(item => item === fromNode);
    fromNodeBrother.splice(fromIndex, 1);

    let toNodeBrother = toNode.parent ? toNode.parent.children : toNode.children;
    let toIndex = toNodeBrother.findIndex(item => item === toNode);
    toNodeBrother.splice(toIndex + 1, 0, fromNode);

    this.setState({ data: this.state.data });
    this.buildKeyMap(); //重新构建下key对象
  };

  render() {
    return (
      <div className="tree">
        <div className="tree-nodes">
          <TreeNode
            data={this.props.data}
            onCollapse={this.onCollapse}
            onCheck={this.onCheck}
            setFromNode={this.setFromNode}
            onMove={this.onMove}
          />
        </div>
      </div>
    );
  }
}
