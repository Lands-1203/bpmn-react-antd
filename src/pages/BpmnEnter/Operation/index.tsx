import { useThrottleFn } from "ahooks";
import { Button, Space, message } from "antd";
import { useContext } from "react";
import { GlobalContext } from "..";

export default () => {
  const { bpmnInstance } = useContext(GlobalContext);
  const downloadFile = (url: string, fileName: string) => {
    // 创建一个隐藏的<a>元素
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // 设置<a>元素的href和download属性，并触发点击事件
    a.href = url;
    a.download = fileName;
    a.click();

    // 删除<a>元素
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  // 获取xml
  const getXML = async () => {
    const bpmnModeler = bpmnInstance?.modeler;
    if (!bpmnModeler) return "";
    const { xml = "" } = await bpmnModeler.saveXML({ format: true });
    return xml;
  };
  // 获取svg
  const getSVG = async () => {
    const bpmnModeler = bpmnInstance?.modeler;
    if (!bpmnModeler) return "";
    const { svg = "" } = await bpmnModeler.saveSVG();
    return svg;
  };
  // 发送请求 保存数据
  const handleSave = async () => {
    const xml = await getXML();
    // todo 业务处理
    message.success("保存成功");
  };
  // 保存xml文件
  const handleSvaeBpmnFile = useThrottleFn(
    async () => {
      const data = await getXML();
      var encodedData = encodeURIComponent(data);
      downloadFile(
        "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
        "diagram.bpmn"
      );
    },
    {
      wait: 1000,
      leading: false,
    }
  );
  // 保存svg
  const handleSvaeSvgFile = useThrottleFn(
    async () => {
      const svg = await getSVG();
      var encodedData = encodeURIComponent(svg);
      downloadFile(
        "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
        "diagram.svg"
      );
    },
    {
      wait: 1000,
      trailing: false,
    }
  );

  return (
    <Space
      style={{
        padding: 20,
        position: "fixed",
        bottom: 0,
        left: 0,
      }}
    >
      <Button.Group>
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
        <Button onClick={handleSvaeBpmnFile.run}>下载XML</Button>
        <Button onClick={handleSvaeSvgFile.run}>下载SVG</Button>
      </Button.Group>
    </Space>
  );
};
