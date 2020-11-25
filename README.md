对 itellyou-editor （https://github.com/itellyou-com/itellyou-editor）进行开发

## Preview

计划任务：

1. [ ] 支持单元格锁定，行锁定，列锁定，表格锁定

2. [x] 表格向右拓展选区异常修复，以及拖拽行的提示修复，删除当前行和向右插入行

3. [x] 支持整个表格无边框处理，上、下、左、右、外边框、以及全 border 加粗

4. [ ] 网络请求去依赖,本地图片粘贴上传

5. [x] 超宽表格显示，始终居中

## 更新记录
日期： 2020-11-06
更新内容：表格border，基本完成,满足基本的操作，对于有单元格合并区域border仍有bug，待解决...

日期：2020-11-24
表格 border-bottom 为纵向合并单元格失效 bug修复，
遗留发现：上面为横向合并单元格时 border-top 异常，会将合并单元宽度的顶部线条添加border 但是 style无样式...

# 适用于 React 的富文本编辑器


### 扩展功能
+ codeblock (代码块，需要额外引用 codemirror 对语言支持)
+ table (表格)
+ emoji (emoji 表情)
+ file (文件上传、预览 需要配合后台api处理上传)
+ label (文本状态)
+ lockedtext (加密文本 ，需要配合后台api加密)
+ mindmap (脑图)
+ diagram (文本绘图，PlantUML、Mermaid、Flowchart、Graphviz 需要后台api调用第三方库生成svg图片)
+ math （数学公式，同diagram 一样需要后台api调用第三方库生成svg图片）
+ mention (提及 @)
+ search (输入关键字可以查询编辑器中的符合条件的文字，并高亮显示，可以替换相应的文字)
+ translate (可以对编辑器中的文档翻译，并且可以替换，需要后台 提供翻译api，一般使用阿里云)
+ video (视频，需要后台上传api)
+ youku (在线视频)
+ image (图片，需要后台上传api)
+ toc (大纲)

### 四种满足使用环境的编辑器模式
+ MultiPageEditor (分页模式)
+ FullEditor (正常完整模式，适合专业文档撰写)
+ MiniEditor (迷你模式，评论、问答等简单撰写)
+ LineEditor (行模式 适合文字评论、表情评论、图片评论)
+ MobileEditor (手机模式，适合手机h5简单撰写)
```
import { MultiPageEditor, FullEditor , MiniEditor , LineEditor ,MobileEditor } from '@hicooper/doc-editor'
```
### 依赖
```
// 引擎
https://github.com/hicooper/doc-engine.git
```

### Class Component
```
import React from 'react'
import { FullEditor } from '@itellyou/itellyou-editor'

class Editor extends React.Component {

    state = {
        content:"<p>Hello Editor</p>"
    }

    onLoad = editor => {
        console.log("编辑器加载好了，",editor)
    }

    onChange = content => {
        this.setState({
            content
        })
    }

    onSave = () => {
        console.log("我请求保存")
    }

    render(){
        const { content } = this.state
        /**
         * 
         * {
                lang,// 语言 en , zh-cn
                defaultValue, // 默认编辑器内容
                onChange, // 编辑器内容改变调用
                onLoad, //编辑器加载成功时调用
                header, // 编辑器扩展header信息，可以是 React 组件
                onSave, // 保存插件执行保存的时候调用
                onBeforeRenderImage,// 在读取图片前调用，可以在函数里面修改 图片地址
                // 表情包
                emoji: {
                    action: 'https://cdn-object.itellyou.com/emoji/',
                },
                // 加密文本插件配置,selection/locakedtext
                lockedtext: {
                    action: '/api/crypto',
                    // 参数
                    {
                        action:encrypt 加密 text 文本 ，pwd 密码，返回加密后的密文
                        action:decrypt 解密 text 加密密文 ， pwd 密码，返回解密后的文本
                    }
                },
                // 图片插件配置
                image: {
                    action: '/api/upload/image',//上传地址，粘贴图片的时候传的 图片url地址，
                    //返回参数
                    {
                        result:true,
                        data:{
                            url,// 图片地址,必须
                            preview, // 预览地址
                            download,// 下载地址
                            size , // 图片大小
                            width , // 真实宽度
                            height // 真实高度
                        }
                    }
                    display: 'block',// 默认显示模式 inline 同文本一行，block ，单独占一行
                    align: 'center',// 默认位置：left 居左，center 居中，right 居右
                },
                // 文件插件配置
                file: {
                    action: '/api/upload/file',
                    //返回参数
                    {
                        result:true,
                        data:{
                            url,// 文件地址,必须
                            preview, // 预览地址，文档预览可以配合阿里云 “智能媒体管理” - “文档转换” 使用
                            download,// 下载地址
                            size , // 文件大小
                        }
                    }
                },
                // 阿里云视频上传请求，需要阿里云sdk支持 https://cdn-object.itellyou.com/ali-sdk/aliyun-oss-sdk-5.3.1.min.js ， https://cdn-object.itellyou.com/ali-sdk/aliyun-upload-sdk-1.5.0.min.js，具体可查看阿里云视频点播服务
                video: {
                    action: {
                        create: '/api/upload/video',// 请求创建上传视频请求，
                        //请求参数
                        {
                            filename,//文件名
                            filesize,//文件大小
                        }
                        //后端调用 CreateUploadVideoRequest ，并返回 
                        {
                            result:true,
                            data:...
                        }

                        save: '/api/upload/video/save',// 保存上传后的信息，可根据需要保存
                        
                        query: '/api/upload/video/query',// 查询播放链接
                        //请求参数
                        {
                            video_id//视频编号
                        }
                        //后端使用 GetPlayInfoResponse 获取播放信息
                        GetPlayInfoResponse response = vodService.getPlayInfo(videoId);
                        if(response == null) return new ResultModel(0,"获取视频播放信息失败");
                        Map<String,Object> data = new HashMap<>();
                        GetPlayInfoResponse.VideoBase videoBase = response.getVideoBase();
                        data.put("video_id",videoBase.getVideoId());
                        data.put("cover_url",videoBase.getCoverURL());
                        data.put("title",videoBase.getTitle());
                        List<Map<String,Object>> playList = new ArrayList<>();
                        for (GetPlayInfoResponse.PlayInfo playInfo : response.getPlayInfoList()){
                            Map<String,Object> playData = new HashMap<>();
                            playData.put("url",playInfo.getPlayURL());
                            playData.put("format",playInfo.getFormat());
                            playData.put("width",playInfo.getWidth());
                            playData.put("height",playInfo.getHeight());
                            playData.put("size",playInfo.getSize());
                            playList.add(playData);
                        }
                        data.put("play_list",playList);
                        并返回数据
                        return {
                            result:true,
                            data:...
                        }
                    },
                },
                // 阿里云翻译请求
                translate: {
                    action: '/api/translate',
                },
                // @ 插件
                mention: {
                    action: '/api/user/search',
                    paramName: 'q',"q" // 查询参数
                    default: [],//默认可以 @ 的会员
                },
                // markdown 支持命令
                markdown: {
                    action: '/api/document/convert',// 粘贴时，识别到markdown代码，转行为编辑器数据格式请求。不提供则不检测
                    items: [
                        'codeblcok',
                        'code',
                        'mark',
                        'bold',
                        'strikethrough',
                        'italic',
                        'sup',
                        'sub',
                        'orderedlist',
                        'unorderedlist',
                        'tasklist',
                        'checkedtasklist',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'quote',
                        'link',
                    ],
                },
                // 是否启用协同编辑，需要后端做好api配合
                ot: false,
            }
         */
        return (
            <Editor 
            defaultValue={content} 
            onLoad={this.onLoad}
            onChange={this.onChange}
            onSave={this.onSave}
            />
        )
    }
}
export default Editor
```

### Hook
```
export default EditorTest = () => {
    const [ content , setContent ] = useState("<p>Hello</p>")

    const onChange = value => setContent(value)

    const onLoad = editor = => {
        console.log("编辑器加载了，实例：",editor)
    }

    return <Editor defaultValue={content} onLoad={onLoad} onChange={onChange} />
}
```

### 实例方法

```
// 获取编辑器内容
getContent()

// 获取不包含光标信息的内容
getPureContent()

// 获取不包含光标信息的html
getPureHtml()

```
### 协同编辑
使用 ShareDB 基于 JSON 文档的操作转换 
https://github.com/share/sharedb

需要配合 itellyou-editor-server 是一个nodejs项目，作为 协同 服务端

demo:

```
yarn start
```
打开两个浏览器，自定义一个 账户 ，然后选择一个文档编辑。数据交互是基于 mock 作为演示

### 扩展插件
section 块
```
import SectionBase from '@itellyou/itellyou-editor/library/section/base'
import { Engine } from '@itellyou/itellyou-editor';

class PaidSection extends SectionBase {
    constructor(engine, contentView){
        super()
        this.section = Engine.section
        this.engine = engine
        this.contentView = contentView
    }

    render(container, value) {
        value = value || {};
        // 初始化 section 节点
        container.append(Engine.$("<div style='color:#fff;background:blue'>This is Section Plugin</div>"));
    }
}
// 块的类型 block、inline
PaidSection.type = 'block';
export default PaidSection
```
插件

```
const PLUGIN_NAME = "paid"
export default {
    initialize: function () {
        // 创建命令
        this.command.add(PLUGIN_NAME, {
            execute: () => {
                // 插入Section块，名称为 paid
                this.change.insertSection(PLUGIN_NAME)
            }
        }) 
        // 设置快捷键
        const options = this.options[PLUGIN_NAME] || {
            hotkey:'mod+shift+m'
        }
        
        if(!!options.hotkey){
            this.hotkey.set(options.hotkey, PLUGIN_NAME)
        }
    }
}
```
添加到引擎
```
import { FullEditor , Engine } from '@itellyou/itellyou-editor';
Engine.section.add('paid', PaidSection)
Engine.plugin.add('paid', PaidPlugin)
```
最后使用快捷键 mod+shift+m 出来插件效果，或者添加toolbar按钮执行插件



