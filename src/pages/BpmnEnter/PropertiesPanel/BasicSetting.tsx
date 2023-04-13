import {
  BetaSchemaForm,
  ProFormColumnsType,
  ProFormInstance,
} from "@ant-design/pro-components";
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "..";
export default () => {
  const { bpmnInstance } = useContext(GlobalContext);
  const { currentElement, modeling, modeler } = bpmnInstance || {};
  const { type: currentElementType } = currentElement || {};
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (!currentElement) return;
    formRef.current?.resetFields();
    console.log(currentElement?.businessObject);
    const data = currentElement?.businessObject.$attrs;
    formRef.current?.setFieldsValue({
      id: currentElement?.id,
      ...data,
    });
    synchronousXMLData();
  }, [currentElement]);
  const columns: ProFormColumnsType<BpmnAPI.record>[] = [
    {
      title: "ID",
      dataIndex: "id",
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
      initialValue: currentElementType,
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
      initialValue: "open",
      dataIndex: "status",
      valueEnum: {
        open: { text: "开启" },
        close: { text: "关闭" },
      },
    },
    {
      title: "开始节点",
      initialValue: "我是开始节点",
      dataIndex: "startElemen",
      hideInForm: currentElementType !== "bpmn:StartEvent",
    },
  ];

  const synchronousXMLData = () => {
    const formData = formRef.current?.getFieldsValue();
    modeling?.updateProperties(currentElement, formData);
  };
  return (
    <BetaSchemaForm<BpmnAPI.record>
      formRef={formRef}
      onFieldsChange={() => {
        synchronousXMLData();
      }}
      columns={columns}
    />
  );
};
