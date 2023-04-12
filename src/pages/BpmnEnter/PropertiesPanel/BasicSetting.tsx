import {
  BetaSchemaForm,
  ProFormColumnsType,
  ProFormInstance,
} from "@ant-design/pro-components";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "..";
export default () => {
  const { bpmnInstance } = useContext(GlobalContext);
  const [type, setType] = useState<BpmnAPI.bpmnElmentType>("bpmn:Process");
  const { currentElement, modeling } = bpmnInstance || {};
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      id: currentElement?.id,
      ...currentElement?.businessObject?.$attrs,
    });
    console.log(currentElement?.businessObject?.$attrs);

    setType(currentElement?.type);
  }, [currentElement]);
  const columns: ProFormColumnsType<BpmnAPI.record>[] = [
    {
      title: "ID",
      dataIndex: "id",
      initialValue: `${new Date().getTime()}${
        Math.floor(Math.random() * 90000) + 10000
      }`,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      initialValue: "open",
      valueEnum: {
        open: { text: "开启" },
        close: { text: "关闭" },
      },
    },
    {
      title: "开始节点",
      dataIndex: "startElemen",
      initialValue: "只有开始节点才能看见我",
      hideInForm: type !== "bpmn:StartEvent",
    },
  ];
  return (
    <BetaSchemaForm<BpmnAPI.record>
      formRef={formRef}
      onFieldsChange={() => {
        modeling?.updateProperties(currentElement, {
          ...formRef.current?.getFieldsValue(),
        });
      }}
      columns={columns}
    />
  );
};
