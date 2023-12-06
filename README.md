bpmn.js是一个BPMN2.0渲染工具包和web建模器.

它使用JavaScript编写，在不需要后端服务器支持的前提下向现代浏览器内嵌入BPMN2.0流程图.

简单来说, 就是前端来实现画流程图

[Bpmn流程引擎文档整理](https://juejin.cn/post/7221408294236602429)

## 前言

[英文官网](https://bpmn.io/toolkit/bpmn-js/)

[GitHub 官方案例](https://github.com/bpmn-io/bpmn-js-examples)

所有的 API 都在官方的 demo 文档中

## 安装

核心包
`npm i bpmn-js`


# bpmnJS流程设计器 技术分析
[React Code Demo](https://github.com/Lands-1203/bpmn-react-antd) 和本介绍相匹配的demo。

读者在看这篇文档的时候不要专注于阶段性的问题，有疑问往下看。

在自定义属性面板这功能的实现上主要看

## 前言

[bpmnjs英文官网](https://bpmn.io/toolkit/bpmn-js/)

[bpmnjs](https://bpmn.io/toolkit/bpmn-js/) [GitHub官方案例](https://github.com/bpmn-io/bpmn-js-examples)

[bpmn行业规范](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/start-event.html)（bpmnjs是按照该规范进行的）

第五和第六点了解一下当中的API，不要去关心bpmn-js-properties-panel导出的任何东西。

所有的API都在官方的demo文档中：当前官方的包版本和以前的包版本对比有差别，所以很多导出方式可能会变化

     // 当前版本 版本不一样使用方式有出入
     "dependencies": {
        "bpmn-js": "^12.0.0",
        // 下面的按需导入
        "@bpmn-io/properties-panel": "^1.7.0",
        "bpmn-js-properties-panel": "^1.20.3",
        "camunda-bpmn-moddle": "^7.0.1",
        "zeebe-bpmn-moddle": "^0.18.0"
      },

## 安装

核心包

`npm i bpmn-js`

官方提供的属性面板（在真实的开发中不需要用到，因为我们自己需要完全的实现整个属性面板）

`npm install --save bpmn-js-properties-panel @bpmn-io/properties-panel`

## 一、创建一个流程设计器

    import BpmnModeler from "bpmn-js/lib/Modeler";
    // 文字样式
    import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
    // 图样式
    import "bpmn-js/dist/assets/diagram-js.css";
     useEffect(() => {
        console.log("useeffect enter");
       const bpmnModeler = new BpmnModeler({
    container: canvasRef.current as HTMLDivElement,
    });
        // 记录实例
        bpmnModelerRef.current = bpmnModeler;
        return () => {
          console.log("useeffect out");
        // 清除监听事件
    bpmnModeler.clear();
    // 摧毁dom创建
    bpmnModeler.destroy();
        };
      }, []);
      
      return <div className={styles.canvas} ref={canvasRef} />

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/833d429c192e4dc08b07d74cbfe91c19~tplv-k3u1fbpfcp-zoom-1.image)

## 二、导入已有的流程

官方案例：https://github.com/bpmn-io/bpmn-js-examples/tree/master/i18n

    // getMockBpmnData请求xml数据 使用bpmnModeler.importXML(data);导入
    getMockBpmnData()
      .then((data) => {
        return bpmnModeler.importXML(data);
      })
      .then((ImportXMLResult) => {
        console.log(ImportXMLResult, "ImportXMLResult");
      });

Mock data数据展示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3546984808940a6be81d6ae7e1d2f03~tplv-k3u1fbpfcp-zoom-1.image)

## 三、i18n国际化

官方案例：https://github.com/bpmn-io/bpmn-js-examples/tree/master/i18n

translations.js

    /**
     * This is a sample file that should be replaced with the actual translation.
     *
     * Checkout https://github.com/bpmn-io/bpmn-js-i18n for a list of available
     * translations and labels to translate.
     */
     // 简单来说就是在页面上你见到的所有英文都是这儿的KEY ，value就是你想显示的值
    export default {
    "Change element": "改变元素",
    "Activate the create/remove space tool": "启动创建/删除空间工具",
    };

customTranslate.js

    import translations from './translations';

    export default function customTranslate(template, replacements) {
    replacements = replacements || {};

    // Translate
    template = translations[template] || template;

    // Replace
    return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
    });
    } 

index.tsx

    const customTranslateModule = {
      translate: ["value", customTranslate],
    };
    const bpmnModeler = new BpmnModeler({
      container: canvasRef.current as HTMLDivElement,
     additionalModules: [
    customTranslateModule,
    ],
    });

## 四、保存数据（XML和SVG数据）

关键代码在加粗段

```

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
    // 在useeffect中new bpmn的时候保存下来的
    const bpmnModeler = bpmnModelerRef.current;
    if (!bpmnModeler) return "";
    const { xml = "" } = await bpmnModeler.saveXML({ format: true });
    return xml;
  };
  // 获取svg
  const getSVG = async () => {
    const bpmnModeler = bpmnModelerRef.current;
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
  const handleSvaeBpmnFile = async () => {
    const data = await getXML();
    var encodedData = encodeURIComponent(data);
    downloadFile(
      "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
      "diagram.bpmn"
    );
  };
  // 保存svg
  const handleSvaeSvgFile = async () => {
    const svg = await getSVG();
    var encodedData = encodeURIComponent(svg);
    downloadFile(
      "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
      "diagram.svg"
    );
  };
```

## 五、接入属性面板-基础

官方案例：https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel

(实际工作中**不要使用**官方提供的`bpmn-js-properties-panel`包)

`npm install --save bpmn-js-properties-panel @bpmn-io/properties-panel`

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9437ba8e5b484950a153182edadbe72e~tplv-k3u1fbpfcp-zoom-1.image)

    <style>
    .properties-panel {
      width: 400px;
      position: absolute;
      right: 0;
      top: 0;
      height: 100vh;
      border-left: 1px solid #ccc;
      background-color: #fcfcfc;
    }
    </style>

    <div className={styles.canvas} ref={canvasRef} />
    <div
     className={styles["properties-panel"]}
     ref={propertiesPanelRef}
    />

<!---->

    const {
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
    } = require("bpmn-js-properties-panel");
    import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
    const bpmnModeler = new BpmnModeler({
      container: canvasRef.current as HTMLDivElement,
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
      ],
       // @ts-ignore
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
    });

## 六、自定义扩展属性面板（基于bpmn-js-properties-panel 工作中不要使用）

就是给某一个流程节点添加表单项

官方案例：https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel-extension

效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6446250215564be682e25aeffe002aa4~tplv-k3u1fbpfcp-zoom-1.image)

自定义扩展属性面板包含了以下几个步骤：

1.  **创建一个名为** **`Magic`** **的组：** `provider/MagicPropertiesProvider.ts`

<!---->

    import {
      TextFieldEntry,
      isTextFieldEntryEdited,
    } from "@bpmn-io/properties-panel";
    import { useService } from "bpmn-js-properties-panel";
    import { is } from "bpmn-js/lib/util/ModelUtil";
    const LOW_PRIORITY = 500;
    export default function PropertiesProvider(propertiesPanel, translate) {
      // 注册自己的自定义属性提供程序。
      // 使用较低的优先级LOW_PRIORITY确保它在基本BPMN属性之后加载。
      propertiesPanel.registerProvider(LOW_PRIORITY, {
        getGroups: (element: React.ReactDOM) => {
          return function (groups: Array<any>) {
            // 判断当前选中节点是不是bpmn:StartEvent开始节点
            if (is(element, "bpmn:StartEvent")) {
              // 添加一个分组 magic
              groups.push({
                id: "magic",
                label: translate("Magic properties"),
                // 在当前分组添加多个表单项 
                entries: [
                  {
                    id: "spell",
                    element,
                    component: Spell,
                    isEdited: isTextFieldEntryEdited,
                  },
                ],
              });
            }
            return groups;
          };
        },
      });
    }
    // 创建输入组件
    function Spell({ element, id }) {
      // 当前节点的操作对象，内部包含各种方法
      const modeling = useService("modeling");
      const translate = useService("translate");
      const debounce = useService("debounceInput");

      const getValue = () => {
        return element.businessObject.spell || "";
      };
      const setValue = (value) => {
        modeling.updateProperties(element, {
          spell: value,
        });
      };
      // bpmn-js-properties-panel提供的表单组件 
      return TextFieldEntry({
        id,
        element,
        debounce,
        description: translate("Apply a black magic spell"),
        label: translate("Spell"),
        getValue,
        setValue,
      });
    }

2.  **导出程序模块：** `provider/index.ts`

<!---->

    import MagicPropertiesProvider from "./MagicPropertiesProvider";

    export const magicPropertiesProviderModule = {
      // 初始化Key
      __init__: ["magicPropertiesProvider1"],
      // 上面对应的key
      magicPropertiesProvider1: ["type", MagicPropertiesProvider],
    };

3.  **创建模组扩展：** **`magic.json`**

它定义了一个名为"Magic"的自定义属性面板插件，其中包含一个类型扩展"BewitchedStartEvent"。该类型扩展继承自"BPMN:StartEvent"，并添加了一个名为"spell"的属性，该属性是一个字符串类型，并使用"isAttr"标志将其标记为属性而不是元素。此外，该插件未指定任何关联或其他类型扩展。

    {
      "name": "Magic",
      "prefix": "magic",
      "uri": "http://magic",
      "xml": {
        "tagAlias": "lowerCase"
      },
      "associations": [],
      "types": [
        {
          "name": "BewitchedStartEvent",
          "extends": [
            "bpmn:StartEvent"
          ],
          "properties": [
            {
              "name": "spell",
              "isAttr": true,
              "type": "String"
            }
          ]
        }
      ]
    }

**问答:**

> Q:"isAttr": true,什么意思？

"isAttr": true 表示将属性标记为 XML 属性，而不是 XML 元素。在 XML 文档中，属性是与元素相关联的名称-值对，而元素是由开始标记、内容和结束标记组成的结构。将属性标记为 XML 属性可以使它们作为元素的属性而不是子元素出现在 XML 文档中。在上面的代码中，"spell" 属性被标记为 XML 属性，这意味着它会作为 "BewitchedStartEvent" 元素的一个属性出现在 XML 文档中，而不是作为子元素嵌套在 "BewitchedStartEvent" 元素中。

> Q:"xml": {"tagAlias": "lowerCase"}?

"xml" 对象定义了用于该扩展的 XML 映射选项。"tagAlias" 是其中的一个选项，它指定 XML 元素名称在生成 XML 时应该使用的别名。在这里，"lowerCase" 是该别名，这意味着所有生成的 XML 元素名称都将以小写字母表示。例如，在上面的代码中，"BewitchedStartEvent" 类型扩展将生成一个 "bewitchedstartevent" 的元素名称，而不是 "BewitchedStartEvent"。这个选项可以使生成的 XML 更加规范化和易于处理。

> Q: "prefix": "magic","uri": "http://magic"?

"prefix" 和 "uri" 属性用于指定 XML 命名空间的前缀和 URI。在 XML 中，命名空间用于标识 XML 元素和属性的来源和所属。在 BPMN 中，命名空间用于将自定义元素和属性与标准 BPMN 元素和属性区分开来。在这里，"magic" 是命名空间的前缀，"http://magic" 是命名空间的 URI。在 XML 中，命名空间前缀通常与命名空间 URI 相关联，以便标识元素和属性所属的命名空间。例如，在上面的代码中，"BewitchedStartEvent" 类型扩展将被认为属于 "http://magic" 命名空间，因为它使用了 "magic" 前缀。这样，可以确保自定义的 BPMN 元素和属性不会与标准的 BPMN 元素和属性冲突，从而实现更好的互操作性和扩展性。

4.  **注册bpmn的时候添加该模块**

<!---->

    import magicModdleDescriptor from "./descriptors/magic.json";
    import { magicPropertiesProviderModule } from "./provider/index";
    const bpmnModeler = new BpmnModeler({
      container: canvasRef.current as HTMLDivElement,
      // @ts-ignore
      propertiesPanel: {
        parent: propertiesPanelRef.current,
      },
      additionalModules: [
        customTranslateModule,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
    +   magicPropertiesProviderModule,
      ],
    + moddleExtensions: {
    +   magic: magicModdleDescriptor,
    + },
    });

上述方式是官方实现方式，并不是理想的实现方式。接入三方组件实现往下看

## 七、三方组件实现属性面板-原理

在写这一点的时候，本来打算是按照官方的案例依次写下来的，但是看了网上各作者的实现方式，豁然开朗。

在1-6的文档说明中，我们使用了部分API，其中，包括：创建流程设计器、导入、保存、设置字段值、自定义扩展等。

由于参考了官方实现和三方开发者的开源贡献，得出以下结论：

在流程设计器中最复杂最繁琐的莫非是属性面板和操作栏的自定义，属性面板设置的值是直接挂载在该元素DOM对应的XML标签上，那就可以理解为XML数据和前端的DOM不是强关联，我们只需要告诉bpmn该dom包含哪些字段和使用 `modeling.updateProperties` API给XML属性赋值，以至于前端的DOM怎么实现就完全脱离了束缚。

在6-2和6-3中，我们导出了一个UI实现和JSON，在实现的过程中我也有一个疑问：

**Q:** 为什么导出了官方的UI的实现，为什么还要导出一个JSON？UI组件的实现过程中已经告诉了bpmn字段名，为什么JSON还要告诉一遍？使用三方的UI是否还需要描述文件？

**A：使用官方的UI实现是需要JSON描述文件的，但自己实现熟悉面板是不需要描述文件的，因为** **UI** **的实现bpmn是不感知的，字段与字段之间的关系是由““6-3.创建模组扩展””的** **json** **告诉bpmn的，可以选择不告诉它，只要保证不使用官方的UI实现。也就是说UI的实现是完全自由的，只需要在UI实现的过程中使用** **`updateProperties`** \*\*\*\***API** **设置对应的键值对，而当中的键是必须要在json定义的。**

这么讲可能有点干，画个图：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb4f77f40dfe4a2d89c8fdcff5de7290~tplv-k3u1fbpfcp-watermark.image?)
结论：属性面板的实现可以完全独立于bpmn，其中的业务逻辑按照我们熟悉的UI库写。只要在关键的节点上调用API设置表单的值和bpmnXML文件的值。

## 八、三方组件实现属性面板-实现

具体实现见[Demo](https://github.com/Lands-1203/bpmn-react-antd) ，提供基本的API：

1.  modeling?.updateProperties 更新属性
2.  modeler.on("selection.changed",function) 元素变化时触发

实现效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d10d5eedce804dbe9159afc38a37b38a~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acc3e422878e4c7f86bb9c53c8d24545~tplv-k3u1fbpfcp-zoom-1.image)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f758a490c18c41ea8bb230f671ed66aa~tplv-k3u1fbpfcp-watermark.image?)

```xml
// 上一张图片的生成结果
<?xml ...>
  <bpmn2:process id="Process_1" isExecutable="false" title="bpmn:Process" status="open">
    <bpmn2:startEvent id="Event_0eceo9i" name="开始" title="bpmn:StartEvent" status="open" startElemen="我是开始节点11111">
      <bpmn2:outgoing>Flow_1e1yd6i</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:sequenceFlow id="Flow_1e1yd6i" sourceRef="Event_0eceo9i" targetRef="Gateway_0gyrpxi" />
    <bpmn2:parallelGateway id="Gateway_0gyrpxi" title="bpmn:ParallelGateway" status="open">
      <bpmn2:incoming>Flow_1e1yd6i</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1s4ahir</bpmn2:outgoing>
      <bpmn2:outgoing>Flow_1prys0p</bpmn2:outgoing>
    </bpmn2:parallelGateway>
    <bpmn2:task id="Activity_1h7dpk5" name="网关1" title="bpmn:Task" status="open">
      <bpmn2:incoming>Flow_1s4ahir</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0w5kua8</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_1s4ahir" sourceRef="Gateway_0gyrpxi" targetRef="Activity_1h7dpk5" />
    <bpmn2:task id="Activity_03zx4qv网关1" name="网关1" title="bpmn:Task" status="open">
      <bpmn2:incoming>Flow_1prys0p</bpmn2:incoming>
      <bpmn2:outgoing>Flow_01j42kt</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_1prys0p" sourceRef="Gateway_0gyrpxi" targetRef="Activity_03zx4qv网关1" />
    <bpmn2:endEvent id="Event_0k0pq9f" name="结束" title="bpmn:EndEvent" status="open">
      <bpmn2:incoming>Flow_0w5kua8</bpmn2:incoming>
      <bpmn2:incoming>Flow_01j42kt</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_0w5kua8" sourceRef="Activity_1h7dpk5" targetRef="Event_0k0pq9f" />
    <bpmn2:sequenceFlow id="Flow_01j42kt" sourceRef="Activity_03zx4qv网关1" targetRef="Event_0k0pq9f" title="bpmn:SequenceFlow" status="open" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
       ...这里是描述位置信息的
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>

```

## 九、属性扩展描述文件规则

### 1.bpmn行业规范

在bpmn中主要分为4类元素节点：事件、活动、网关和流

1.  Events (事件)

    1.  [Start Event](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/start-event.html) （开始事件）
    2.  [Intermediate Event](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/intermediate-event.html)（中间事件）
    3.  [End Event](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/end-event.html)（结束事件）

2.  Activities (活动)

    1.  [Task](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/tasks.html) (任务)
    2.  [Sub Process](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/sub-process.html) (子流程)
    3.  [Call Activity](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/call-activity.html)（调用活动）

3.  [Gateways](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/gateway.html) (网关)

    1.  Exclusive Gateway (排他网关)
    2.  Inclusive Gateway (包容网关)
    3.  Parallel Gateway (并行网关)
    4.  Complex Gateway (复杂网关)
    5.  Event-Based Gateway (基于事件的网关)

4.  Flow

    1.  [Sequence Flow ](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/sequence-flow.html)(顺序流)
    2.  [Message Flow](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/message-flow.html) (消息流)
    3.  [Association ](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/association.html)(关联)
    4.  [Data Association](https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/data-association.html)（数据通讯）

<p align=center><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9983593bb7104085a0212a2afe6c07b0~tplv-k3u1fbpfcp-zoom-1.image" alt=""  /></p>

> 数据来源：https://cloud.trisotech.com/bpmnquickguide/bpmn-quick-guide/bpmn-basics.html

举例：`bpmn:Task`是BPMN规范中的一个任务类型，它代表一个需要被执行的工作或活动。下面是`bpmn:Task`的一些常用属性和行为(数据来源Chat GPT 可能不准确)：

*   属性：

    *   `id`：唯一标识符，用于在流程图中引用任务。
    *   `name`：任务的名称。
    *   `assignee`：指定任务的执行者。
    *   `candidateUsers`：可以候选的任务执行者列表。
    *   `candidateGroups`：可以候选的任务执行者所在的组。
    *   `dueDate`：任务的截止日期。
    *   `priority`：任务的优先级。
    *   `formKey`：任务的表单关键字，用于引用任务的表单定义。

*   行为：

    *   `complete`：完成任务，将任务标记为已完成。
    *   `delegate`：委托任务，将任务交给另一个执行者处理。
    *   `claim`：声明任务，将任务标记为已声明并指定执行者。
    *   `reassign`：重新指定任务的执行者。
    *   `escalate`：升级任务，将任务交给更高级别的执行者处理。

需要注意的是，BPMN规范定义了一组标准的属性和行为，但每个BPMN实现可能会根据自己的需求进行扩展或修改。因此，实际使用中可能会存在一些差异。

### 2.案例

在上述内容中，是bpmn规范中的基础节点，以下会讲述扩展文件的配置，也就是说我们自己添加节点或者属性：

**案例一：**

    {
      "name": "MyBPMN",
      "prefix": "mybpmn",
      "uri": "http://MyBPMN",
      "xml": {
        "tagAlias": "lowerCase"
      },
      "associations": [],
      "types": [
        {
          "name": "CustomServiceTask",
          "extends": ["bpmn:ServiceTask"],
          "properties": [
            {
              "name": "customProperty",
              "type": "String"
            }
          ]
        }
      ]
    }

1.  `prefix` xml前缀
2.  `isAttr` 代表`customProperty` 是以属性的形式存在
3.  `"tagAlias": "lowerCase"`代表xml属性和标签全部使用小写
4.  `"extends": ["bpmn:ServiceTask"]`,代表`bpmn:ServiceTask`可以使用`CustomServiceTask类型`（不注册也可以使用，但是存储位置不同）

> 当属性不具有子元素时，可以将其表示为 XML 属性，而不是 XML 元素

**案例二 superClass**

    {
      "name": "MyBPMN",
      "prefix": "my",
      "uri": "http://MyBPMN",
      "xml": {
        "tagAlias": "lowerCase"
      },
      "associations": [],
      "types": [
        {
          "name": "CustomTask",
          "superClass": ["bpmn:Task"],
          "properties": [
            {
              "name": "customProperty",
              "type": "String",
              "isAttr": true
            }
          ]
        }
      ]
    }

1.  `superClass`：CustomTask继承了`Task`的所有属性

**案例三 列表属性扩展**

    {
      "name": "MyBPMN",
      "prefix": "my",
      "uri": "http://MyBPMN",
      "xml": {
        "tagAlias": "lowerCase"
      },
      "associations": [],
      "types": [
        {
          "name": "Extensions",
          "superClass": [ "Element" ],
          "properties": [
            {
              "name": "extensions",
              "isMany": true,
              "type": "Extension"
            }
          ]
        },
        {
          "name": "Extension",
          "properties": [
            {
              "name": "key",
              "isAttr": true,
              "type": "String",
              "default":"默认值"
            }
          ]
        }
      ]
    }

1.  该描述文件定义了一个`Extension`的类型：`{key:string}`。
2.  又定义了一个`Extensions` 类型：`{"extensions":[{key:string}]}`
3.  `isMany` 是一个数组
4.  `default`：默认值

### 3.重点

在bpmnjs中如果不使用官方提供的UI组件，可以不用注册描述文件，也就是说不用提前在json文件中声明类型和字段

需要注意的是如果不在文件中注册字段，数据保存在`Element?.businessObject.$attrs`，注册了的或者原生节点内置的字段存在于`Element?.businessObject`

### 4.总结和最优解

1.  在实际的开发中，如果不是新的UI节点，只是简单的属性那么就不要在描述文件中注册。
2.  只保证在描述文件中注册新的UI节点，并且也不要注册属性。
3.  初始值的设置和数据同步
4.  也就是说在定义节点属性的时候你不用照着“`2.案例`”写

在节点变化的时候，将节点的值设置进表单。如下：

    useEffect(() => {
        // 节点变化时触发
        if (!currentElement) return;
        formRef.current?.resetFields();
        const data = currentElement?.businessObject.$attrs;
        formRef.current?.setFieldsValue({
          id: currentElement?.id,
          ...data,
        });
        synchronousXMLData();
    }, [currentElement]);
      

    const synchronousXMLData = () => {
        const formData = formRef.current?.getFieldsValue();
        modeling?.updateProperties(currentElement, formData);
    };
     // 伪代码 在表单的字段变化是触发 
    onFieldsChange={() => {
        synchronousXMLData();
    }}

属性面板示例，完整的react代码

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


