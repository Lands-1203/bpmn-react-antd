import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";

import customTranslate from "@/utils/customTranslate";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { createContext, useEffect, useRef, useState } from "react";
import Operation from "./Operation";
import PropertiesPanel from "./PropertiesPanel";
import { getMockBpmnData } from "./bpmnMock";
import customModdleDescriptor from "./descriptors";
import styles from "./style.less";

const customTranslateModule = {
  translate: ["value", customTranslate],
};

export const GlobalContext = createContext<{
  bpmnInstance: BpmnAPI.bpmnInstanceProps;
}>({ bpmnInstance: null });
export default function HomePage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [bpmnInstance, setBpmnInstance] =
    useState<BpmnAPI.bpmnInstanceProps>(null);
  useEffect(() => {
    // 注册bpmn实例
    const bpmnModeler = new BpmnModeler({
      container: canvasRef.current as HTMLDivElement,
      additionalModules: [customTranslateModule],
      moddleExtensions: {
        // 描述文件
        custom: customModdleDescriptor,
      },
    });
    const instance = {
      modeler: bpmnModeler,
      modeling: bpmnModeler.get("modeling"),
      moddle: bpmnModeler.get("moddle"),
      eventBus: bpmnModeler.get("eventBus"),
      bpmnFactory: bpmnModeler.get("bpmnFactory"),
      elementRegistry: bpmnModeler.get("elementRegistry"),
      replace: bpmnModeler.get("replace"),
      selection: bpmnModeler.get("selection"),
    };
    setBpmnInstance(instance as any);
    getActiveElement(instance);
    return () => {
      // 清除监听事件
      bpmnModeler.clear();
      // 清除实例
      bpmnModeler.destroy();
    };
  }, []);
  useEffect(() => {
    getMockBpmnData().then((data) => {
      bpmnInstance?.modeler.importXML(data);
    });
  }, [bpmnInstance?.modeler]);

  // 获取选中元素
  const getActiveElement = (instance) => {
    const { modeler } = instance;
    // 初始第一个选中元素 bpmn:Process
    initFormOnChanged(null, instance);
    modeler.on("import.done", (e) => {
      initFormOnChanged(null, instance);
    });
    // 监听选择事件，修改当前激活的元素以及表单
    modeler.on("selection.changed", ({ newSelection }) => {
      initFormOnChanged(newSelection[0] || null, instance);
    });
  };
  // 初始化数据
  const initFormOnChanged = (element, instance) => {
    const elementRegistry = instance.modeler.get("elementRegistry");
    if (!element) {
      element =
        elementRegistry.find((el) => el.type === "bpmn:Process") ||
        elementRegistry.find((el) => el.type === "bpmn:Collaboration");
    }
    if (!element) return;
    setBpmnInstance({ currentElement: element, ...instance });
  };

  return (
    <GlobalContext.Provider value={{ bpmnInstance }}>
      <div className={styles.canvas} ref={canvasRef} />
      {/* 按钮组 */}
      <Operation />
      {/* 操作栏 */}
      <PropertiesPanel />
    </GlobalContext.Provider>
  );
}
