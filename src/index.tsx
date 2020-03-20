import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Tree from "./components/Tree";

import treeData from "./data/tree-data";
ReactDOM.render(<Tree data={treeData} />, document.getElementById("root"));
