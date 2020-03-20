/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { TreeData } from "../../typing";

import file from "./tree-icons/file.png";
import closedFolder from "./tree-icons/closed-folder.png";
import openedFolder from "./tree-icons/opened-folder.png";

interface Props {
  data: TreeData;
  onCollapse: any;
  onCheck: any;
  setFromNode: any;
  onMove: any;
}

class TreeNode extends React.Component<Props> {
  treeNodeRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.treeNodeRef = React.createRef();
  }
  dragstart = (event: DragEvent) => {
    this.props.setFromNode(this.props.data);
    event.stopPropagation();
  };
  dragenter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  dragover = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  drop = (event: DragEvent) => {
    event.preventDefault();
    this.props.onMove(this.props.data);
    event.stopPropagation();
  };
  componentDidMount() {
    this.treeNodeRef.current.addEventListener("dragstart", this.dragstart, false);
    this.treeNodeRef.current.addEventListener("dragenter", this.dragenter, false);
    this.treeNodeRef.current.addEventListener("dragover", this.dragover, false);
    this.treeNodeRef.current.addEventListener("drop", this.drop, false);
  }

  componentWillUnmount() {
    this.treeNodeRef.current.removeEventListener("dragstart", this.dragstart, false);
    this.treeNodeRef.current.removeEventListener("dragenter", this.dragenter, false);
    this.treeNodeRef.current.removeEventListener("dragover", this.dragover, false);
    this.treeNodeRef.current.removeEventListener("drop", this.drop, false);
  }
  render() {
    let {
      data: { name, children, collapsed = false, key, checked = false }
    } = this.props;
    let caret, icon;

    if (children) {
      if (children.length > 0) {
        caret = (
          <span
            className={`collapse ${collapsed ? "caret-right" : "caret-down"}`}
            onClick={() => this.props.onCollapse(key)}
          />
        );
        icon = collapsed ? closedFolder : openedFolder;
      } else {
        caret = null;
        icon = file;
      }
    } else {
      caret = (
        <span
          className={"collapse caret-right"}
          onClick={() => this.props.onCollapse(key)}
        />
      );
      icon = closedFolder;
    }

    return (
      <div className="tree-node" draggable={true} ref={this.treeNodeRef}>
        <div className="inner">
          {caret}
          <span className="content">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => this.props.onCheck(key)}
            />
            <img style={{ width: 20 }} src={icon} />
            {name}
          </span>
        </div>
        {children && children.length > 0 && !collapsed && (
          <div className="children">
            {children.map((item: TreeData) => (
              <TreeNode
                key={item.key}
                data={item}
                onCollapse={this.props.onCollapse}
                onCheck={this.props.onCheck}
                setFromNode={this.props.setFromNode}
                onMove={this.props.onMove}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default TreeNode;
