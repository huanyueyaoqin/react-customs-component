import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { message, Icon } from "antd";
// import Tree from "./components/Tree";
// import treeData from "./data/tree-data";
import Dragger, { UploadFile, DragProps } from "./components/Dragger-Upload";

const props: DragProps = {
  name: "file", //上传服务器的字段名
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76", //上传服务器地址
  // action: "http://localhost:8080/upload",
  onUpload(uploadFile: UploadFile) {
    console.log(uploadFile);
    if (uploadFile.status === "error") {
      message.error(`${uploadFile.file.name} 上传失败!`);
    } else if (uploadFile.status === "done") {
      message.success(`${uploadFile.file.name} 上传成功!`);
    }
  }
};
ReactDOM.render(
  <Dragger {...props}>
    <Icon type="inbox" />
  </Dragger>,
  document.getElementById("root")
);
