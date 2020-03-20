import React, { useRef, MutableRefObject, RefObject, useEffect, useState } from "react";
import { Progress, Icon, Card } from "antd";
import "./index.less";
export type DragProps = React.PropsWithChildren<{
  onUpload: any;
  name: string;
  action: string;
}>;
export interface UploadFile {
  file: File;
  percent?: number;
  url?: string;
  status: string; //状态 initial uploading error done
}

function Dragger(props: DragProps): JSX.Element {
  let [uploadFiles, setUploadFiles] = useState<Array<UploadFile>>([]);
  let uploadContainer: MutableRefObject<HTMLDivElement | undefined> = useRef<
    HTMLDivElement
  >();
  const onDragEnter = (event: DragEvent): any => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDragOver = (event: DragEvent): any => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDragLeave = (event: DragEvent): any => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDrop = (event: DragEvent): any => {
    event.preventDefault();
    event.stopPropagation();
    console.log("event:", event);

    let transfer: DataTransfer | null = event.dataTransfer;
    if (transfer && transfer.files) {
      upload(transfer.files);
    }
  };

  function upload(files: DataTransfer["files"]) {
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let formData = new FormData();
      formData.append("filename", file.name);
      formData.append(props.name, file);
      var xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", props.action, true);
      xhr.responseType = "json";

      let uploadFile: UploadFile = {
        file,
        percent: 0,
        status: "uploading",
        url: ""
      };
      uploadFiles.push(uploadFile);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          uploadFile.url = xhr.response.url;
          props.onUpload(uploadFile);
        }
      };
      xhr.onprogress = onUpdateProgress;
      xhr.upload.onprogress = onUpdateProgress;
      function onUpdateProgress(event: ProgressEvent) {
        if (event.lengthComputable) {
          let percent: number = parseInt(
            ((event.loaded / event.total) * 100).toFixed(0)
          );
          uploadFile.percent = percent;
          if (percent >= 100) {
            uploadFile.status = "done";
          }
          setUploadFiles([...uploadFiles]);
        }
      }

      xhr.onerror = function() {
        uploadFile.status = "error";
        setUploadFiles([...uploadFiles]);
      };
      xhr.timeout = 10000;
      xhr.ontimeout = function() {
        uploadFile.status = "error";
        setUploadFiles([...uploadFiles]);
      };
      xhr.send(formData);
    }
  }
  useEffect(() => {
    uploadContainer.current!.addEventListener("dragenter", onDragEnter);
    uploadContainer.current!.addEventListener("dragover", onDragOver);
    uploadContainer.current!.addEventListener("drop", onDrop);
    uploadContainer.current!.addEventListener("dragleave", onDragLeave);
    return () => {
      uploadContainer.current!.removeEventListener("dragenter", onDragEnter);
      uploadContainer.current!.removeEventListener("dragover", onDragOver);
      uploadContainer.current!.removeEventListener("drop", onDrop);
      uploadContainer.current!.removeEventListener("dragleave", onDragLeave);
    };
  }, []);
  return (
    <>
      <div
        className="dragger-container"
        ref={uploadContainer as RefObject<HTMLDivElement> | null | undefined}
      >
        {props.children}
      </div>
      {uploadFiles.map((uploadFile: UploadFile, index: number) => (
        <div key={index}>
          <div>
            {uploadFile.status === "uploading" ? (
              <Icon type="loading" />
            ) : (
              <Icon type="paper-clip" />
            )}

            <span style={{ marginLeft: 10 }}>{uploadFile.file.name}</span>
          </div>
          <Progress
            status={uploadFile.status === "error" ? "exception" : undefined}
            key={index}
            percent={uploadFile.percent}
          />
        </div>
      ))}
      {console.log("uploadFiles:", uploadFiles)}

      {uploadFiles.map((uploadFile: UploadFile, index: number) => {
        return uploadFile.url ? (
          <Card
            key={index}
            hoverable
            style={{ width: 200 }}
            cover={<img alt="" src={uploadFile.url} />}
          >
            <Card.Meta title={uploadFile.file.name} />
          </Card>
        ) : null;
      })}
    </>
  );
}

export default Dragger;
