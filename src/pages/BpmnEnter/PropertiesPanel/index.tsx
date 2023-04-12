import { translations } from "@/utils";
import { ProCard } from "@ant-design/pro-components";
import { Tabs } from "antd";
import { useContext } from "react";
import { GlobalContext } from "..";
import AdvancedSettings from "./AdvancedSettings";
import BasicSetting from "./BasicSetting";
import styles from "./styles.less";
export default () => {
  const { bpmnInstance } = useContext(GlobalContext);
  const { currentElement, modeling } = bpmnInstance || {};

  return (
    <ProCard
      title={translations(currentElement?.type)}
      bordered
      headerBordered
      direction="column"
      gutter={[0, 16]}
      className={styles.container}
    >
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={[
          { label: "基础设置", key: "tab1", children: <BasicSetting /> },
          { label: "高级设置", key: "tab2", children: <AdvancedSettings /> },
        ]}
      />
    </ProCard>
  );
};
