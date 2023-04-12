import {
  BetaSchemaForm,
  ProForm,
  ProFormColumnsType,
} from "@ant-design/pro-components";
import { Collapse, Form } from "antd";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "..";
const { Panel } = Collapse;
export default () => {
  const { bpmnInstance } = useContext(GlobalContext);
  const [type, setType] = useState("Process");
  const { currentElement } = bpmnInstance || {};
  const [form] = Form.useForm();
  useEffect(() => {
    if (currentElement?.businessObject) {
      setType(currentElement.businessObject.$type.slice(5));
    }
  }, []);
 
  const columns: ProFormColumnsType<BpmnAPI.record>[] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "标题",
      dataIndex: "title",
    },
  ];
  return (
    <ProForm
      labelCol={{ span: 3 }}
      layout="horizontal"
      form={form}
      submitter={{
        render: (props, doms) => {
          return [];
        },
      }}
    >
      <BetaSchemaForm<BpmnAPI.record> layoutType="Embed" columns={columns} />
    </ProForm>
  );
};
