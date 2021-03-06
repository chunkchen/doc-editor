import Engine from '@hicooper/doc-engine'

import SectionMath from '../section/math'
import SectionSelect from '../section/sectionselect'
import SectionImage from '../section/image'
import SectionFile from '../section/file'
import SectionMindMap from '../section/mindmap'
import TextDiagram from '../section/text-diagram'
import CodeBlock from '../section/codeblock'
import SectionTable from '../section/table'
import SectionVideo from '../section/video'
import SectionLabel from '../section/label'
import SectionYouku from '../section/youku'
import SectionMention from '../section/mention'
import SectionOnlineDoc from '../section/online-doc'
import SectionLockedText from '../section/locked-text'
import SectionLocalDoc from '../section/local-doc'
import SectionMXGraph from '../section/mxgraph'

import math from '../plugins/math'
import save from '../plugins/save'
import search from '../plugins/search'
import sectionselect from '../plugins/sectionselect'
import image from '../plugins/image'
import file from '../plugins/file'
import toc from '../plugins/toc'
import moremark from '../plugins/moremark'
import mindmap from '../plugins/mindmap'
import diagram from '../plugins/diagram'
import codeblock from '../plugins/codeblock'
import table from '../plugins/table'
import video from '../plugins/video'
import youku from '../plugins/youku'
import mention from '../plugins/mention'
import translate from '../plugins/translate'
import onlinedoc from '../plugins/online-doc'
import localdoc from '../plugins/local-doc'
import lockedtext from '../plugins/lockedtext'
import label from '../plugins/label'
import mxgraph from '../plugins/mxgraph'
import link from '../plugins/link'
import markdown from '../plugins/markdown'
import Scrollbar from '../scrollbar'

Engine.Scrollbar = Scrollbar
Engine.section.add('sectionselect', SectionSelect)
Engine.section.add('mention', SectionMention)
Engine.section.add('image', SectionImage)
Engine.section.add('file', SectionFile)
Engine.section.add('codeblock', CodeBlock)
Engine.section.add('math', SectionMath)
Engine.section.add('table', SectionTable)
Engine.section.add('mindmap', SectionMindMap)
Engine.section.add('youku', SectionYouku)
Engine.section.add('video', SectionVideo)
Engine.section.add('label', SectionLabel)
Engine.section.add('puml', TextDiagram)
Engine.section.add('mermaid', TextDiagram)
Engine.section.add('flowchart', TextDiagram)
Engine.section.add('graphviz', TextDiagram)
Engine.section.add('diagram', TextDiagram)
Engine.section.add('onlinedoc', SectionOnlineDoc)
Engine.section.add('lockedtext', SectionLockedText)
Engine.section.add('localdoc', SectionLocalDoc)
Engine.section.add('mxgraph', SectionMXGraph)

Engine.plugin.add('translate', translate)
Engine.plugin.add('search', search)
Engine.plugin.add('save', save)
Engine.plugin.add('sectionselect', sectionselect)
Engine.plugin.add('mention', mention)
Engine.plugin.add('image', image)
Engine.plugin.add('file', file)
Engine.plugin.add('codeblock', codeblock)
Engine.plugin.add('math', math)
Engine.plugin.add('table', table)
Engine.plugin.add('youku', youku)
Engine.plugin.add('video', video)
Engine.plugin.add('diagram', diagram)
Engine.plugin.add('toc', toc)
Engine.plugin.add('moremark', moremark)
Engine.plugin.add('mindmap', mindmap)
Engine.plugin.add('onlinedoc', onlinedoc)
Engine.plugin.add('localdoc', localdoc)
Engine.plugin.add('lockedtext', lockedtext)
Engine.plugin.add('label', label)
Engine.plugin.add('mxgraph', mxgraph)
Engine.plugin.add('link', link)
Engine.plugin.add('markdown', markdown)

export default Engine
