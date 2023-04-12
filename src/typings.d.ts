namespace BpmnAPI {
  export type updatePropertiesType = (element: any, option: record) => void;

  export interface bpmnModelingType {
    /** 更新BPMN字段方法 */
    updateProperties: updatePropertiesType;
  }

  /** bpmn的elment对象 */
  export interface bpmnElementType extends record {
    type: string;
  }
  export interface BpmnModeler {
    /**
     * The constructor.
     *
     * @param options The options to configure the viewer.
     */
    constructor(options?: BaseViewerOptions);

    /**
     * Parse and render a BPMN 2.0 diagram.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During import the viewer will fire life-cycle events:
     *
     *   * import.parse.start (about to read model from XML)
     *   * import.parse.complete (model read; may have worked or not)
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *   * import.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @throws An error thrown during the import of the XML.
     *
     * @param xml The BPMN 2.0 XML to be imported.
     * @param bpmnDiagram The optional diagram or Id of the BPMN diagram to open.
     *
     * @return A promise resolving with warnings that were produced during the import.
     */
    importXML(
      xml: string,
      bpmnDiagram?: ModdleElement | string
    ): Promise<ImportXMLResult>;

    /**
     * Import parsed definitions and render a BPMN 2.0 diagram.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During import the viewer will fire life-cycle events:
     *
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @throws An error thrown during the import of the definitions.
     *
     * @param definitions The definitions.
     * @param bpmnDiagram The optional diagram or ID of the BPMN diagram to open.
     *
     * @return A promise resolving with warnings that were produced during the import.
     */
    importDefinitions(
      definitions: ModdleElement,
      bpmnDiagram?: ModdleElement | string
    ): Promise<ImportDefinitionsResult>;

    /**
     * Open diagram of previously imported XML.
     *
     * Once finished the viewer reports back the result to the
     * provided callback function with (err, warnings).
     *
     * ## Life-Cycle Events
     *
     * During switch the viewer will fire life-cycle events:
     *
     *   * import.render.start (graphical import start)
     *   * import.render.complete (graphical import finished)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @throws An error thrown during opening.
     *
     * @param bpmnDiagramOrId The diagram or Id of the BPMN diagram to open.
     *
     * @return A promise resolving with warnings that were produced during opening.
     */
    open(bpmnDiagramOrId: ModdleElement | string): Promise<OpenResult>;

    /**
     * Export the currently displayed BPMN 2.0 diagram as
     * a BPMN 2.0 XML document.
     *
     * ## Life-Cycle Events
     *
     * During XML saving the viewer will fire life-cycle events:
     *
     *   * saveXML.start (before serialization)
     *   * saveXML.serialized (after xml generation)
     *   * saveXML.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @throws An error thrown during export.
     *
     * @param options The options.
     *
     * @return A promise resolving with the XML.
     */
    saveXML(options: SaveXMLOptions): Promise<SaveXMLResult>;

    /**
     * Export the currently displayed BPMN 2.0 diagram as
     * an SVG image.
     *
     * ## Life-Cycle Events
     *
     * During SVG saving the viewer will fire life-cycle events:
     *
     *   * saveSVG.start (before serialization)
     *   * saveSVG.done (everything done)
     *
     * You can use these events to hook into the life-cycle.
     *
     * @throws An error thrown during export.
     *
     * @return A promise resolving with the SVG.
     */
    saveSVG(): Promise<SaveSVGResult>;

    /**
     * Return modules to instantiate with.
     *
     * @return The modules.
     */
    getModules(): ModuleDeclaration[];

    /**
     * Remove all drawn elements from the viewer.
     *
     * After calling this method the viewer can still be reused for opening another
     * diagram.
     */
    clear(): void;

    /**
     * Destroy the viewer instance and remove all its remainders from the document
     * tree.
     */
    destroy(): void;

    /**
     * Register an event listener.
     *
     * Remove a previously added listener via {@link BaseViewer#off}.
     *
     * @param events The event(s) to listen to.
     * @param callback The callback.
     * @param that Value of `this` the callback will be called with.
     */
    on<T extends Event>(
      events: string | string[],
      callback: EventCallback<T>,
      that?: any
    ): void;

    /**
     * Register an event listener.
     *
     * Remove a previously added listener via {@link BaseViewer#off}.
     *
     * @param events The event(s) to listen to.
     * @param priority The priority with which to listen.
     * @param callback The callback.
     * @param that Value of `this` the callback will be called with.
     */
    on<T extends Event>(
      events: string | string[],
      priority: number,
      callback: EventCallback<T>,
      that?: any
    ): void;

    /**
     * Remove an event listener.
     *
     * @param events The event(s).
     * @param callback The callback.
     */
    off(events: string | string[], callback?: EventCallback<any>): void;

    /**
     * Attach the viewer to an HTML element.
     *
     * @param parentNode The parent node to attach to.
     */
    attachTo(parentNode: HTMLElement): void;

    /**
     * Get the definitions model element.
     *
     * @returns The definitions model element.
     */
    getDefinitions(): ModdleElement | undefined;

    /**
     * Detach the viewer.
     */
    detach(): void;
  }
  export type bpmnInstanceProps = {
    currentElement?: bpmnElementType;
    modeler: BpmnModeler;
    /** bpmn的操作对象 */
    modeling: bpmnModelingType;
    moddle: any;
    eventBus: any;
    bpmnFactory: any;
    elementRegistry: any;
    replace: any;
    selection: any;
  } | null;
  export type record = Record<string, any>;
  export type bpmnElmentType =
    | "bpmn:StartEvent"
    | "bpmn:Process"
    | "bpmn:EndEvent"
    | string
    | undefined;
}
