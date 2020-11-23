// 模板数据
const Templates = {}
Templates.puml = {
  sequence: {
    id: 'sequence',
    name: '时序图 (Sequence)',
    text: '@startuml\n\nautonumber\n\nactor "\u7528\u6237" as User\nparticipant "\u6D4F\u89C8\u5668" as Browser\nparticipant "\u670D\u52A1\u7AEF" as Server #orange\n\nactivate User\n\nUser -> Browser: \u8F93\u5165 URL\nactivate Browser\n\nBrowser -> Server: \u8BF7\u6C42\u670D\u52A1\u5668\nactivate Server\n\nServer -> Server: \u6A21\u677F\u6E32\u67D3\nnote right of Server: \u8FD9\u662F\u4E00\u4E2A\u6CE8\u91CA\n\nServer -> Browser: \u8FD4\u56DE HTML\ndeactivate Server\n\nBrowser --> User\n\n@enduml',
    src: '',
  },
  'use-case': {
    id: 'use-case',
    name: '用例图 (Use Case)',
    text: '@startuml\n\nactor A\nactor B\n\nA -up-> (up)\nA -right-> (center)\nA -down-> (down)\nA -left-> (left)\n\nB -up-> (up)\nB -left-> (center)\nB -right-> (right)\nB -down-> (down)\n\n@enduml',
    src: '',
  },
  class: {
    id: 'class',
    name: '类图 (Class)',
    text: '@startuml\n\nclass Car {\n  color\n  model\n  +start()\n  #run()\n  #stop()\n}\n\nCar <|- Bus\nCar *-down- Tire\nCar *-down- Engine\nBus o-down- Driver\n\n@enduml',
    src: '',
  },
  flowchart: {
    id: 'flowchart',
    name: '流程图 (Sequence)',
    text: '@startuml\n\nstart\n\n:step 1;\n\nif (try) then (true)\n  :step 2;\n  :step 3;\nelse (false)\n  :error;\n  end\nendif\n\nstop\n\n@enduml',
    src: '',
  },
  activity: {
    id: 'activity',
    name: '活动图 (Sequence)',
    text: '@startuml\n\n|A Section|\nstart\n:step1;\n|#AntiqueWhite|B Section|\n:step2;\n:step3;\n|A Section|\n:step4;\n|B Section|\n:step5;\nstop\n\n@enduml',
    src: '',
  },
  component: {
    id: 'component',
    name: '组件图 (Component)',
    text: '@startuml\n\nDataAccess - [First Component]\n[First Component] ..> HTTP : use\n\n@enduml',
    src: '',
  },
  state: {
    id: 'state',
    name: '状态图 (State)',
    text: '@startuml\n\n[*] --> State1\nState1 --> [*]\nState1 : this is a string\nState1 : this is another string\n\nState1 -> State2\nState2 --> [*]\n\n@enduml',
    src: '',
  },
  object: {
    id: 'object',
    name: '类图 (State)',
    text: '@startuml\n\nobject Car\nobject Bus\nobject Tire\nobject Engine\nobject Driver\n\nCar <|- Bus\nCar *-down- Tire\nCar *-down- Engine\nBus o-down- Driver\n\n@enduml',
    src: '',
  },
}
const Template = {
  /**
   * 获取某种图支持的模板
   *
   * @param {string} diagramType 图类别
   * @return {object|null}
   */
  getTemplates(diagramType) {
    return Templates[diagramType] || null
  },
}
export default Template
