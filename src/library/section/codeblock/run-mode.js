import CodeMirror from 'codemirror'

/**
 * 代码来自 runmode addon
 * 支持行号需要考虑复制粘贴问题
 *
 * runmode 本身不支持行号，见 https://github.com/codemirror/CodeMirror/issues/3364
 * 可参考的解法  https://stackoverflow.com/questions/14237361/use-codemirror-for-standalone-syntax-highlighting-with-line-numbers
 *
 * ref:
 * - https://codemirror.net/doc/manual.html#addons
 * - https://codemirror.net/addon/runmode/runmode.js
 */
export default (string, modespec, callback, options) => {
  const mode = CodeMirror.getMode(CodeMirror.defaults, modespec)
  const ie = /MSIE \d/.test(navigator.userAgent)
  const ie_lt9 = ie && (document.documentMode == null || document.documentMode < 9)

  if (callback.appendChild) {
    const tabSize = (options && options.tabSize) || CodeMirror.defaults.tabSize
    const node = callback
    let col = 0
    node.innerHTML = ''

    callback = (text, style) => {
      if (text === '\n') {
        // Emitting LF or CRLF on IE8 or earlier results in an incorrect display.
        // Emitting a carriage return makes everything ok.
        node.appendChild(document.createTextNode(ie_lt9 ? '\r' : text))
        col = 0
        return
      }

      let content = ''
      // replace tabs

      for (let pos = 0; ;) {
        const idx = text.indexOf('\t', pos)

        if (idx === -1) {
          content += text.slice(pos)
          col += text.length - pos
          break
        } else {
          col += idx - pos
          content += text.slice(pos, idx)
          const size = tabSize - col % tabSize
          col += size

          for (let i = 0; i < size; ++i) {
            content += ' '
          }

          pos = idx + 1
        }
      }

      if (style) {
        const sp = node.appendChild(document.createElement('span'))
        sp.className = `cm-${style.replace(/ +/g, ' cm-')}`
        sp.appendChild(document.createTextNode(content))
      } else {
        node.appendChild(document.createTextNode(content))
      }
    }
  }

  const lines = CodeMirror.splitLines(string)
  const state = (options && options.state) || CodeMirror.startState(mode)

  for (let i = 0, e = lines.length; i < e; ++i) {
    if (i) callback('\n')
    const stream = new CodeMirror.StringStream(lines[i])
    if (!stream.string && mode.blankLine) mode.blankLine(state)

    while (!stream.eol()) {
      const style = mode.token(stream, state)
      callback(stream.current(), style, i, stream.start, state)
      stream.start = stream.pos
    }
  }
}
