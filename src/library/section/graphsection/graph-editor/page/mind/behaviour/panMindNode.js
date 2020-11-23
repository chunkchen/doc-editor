import Page from '../../base'
import Util from '../util'

Page.registerBehaviour('panMindNode', (mind) => {
  const tree = mind.getGraph()
  let dragNodeModel
  let originNth
  let lastHotArea
  tree.behaviourOn('beforeshowdelegation', () => {
    mind.clearSelected()
    mind.clearActived()
  })
  tree.behaviourOn('node:dragstart', (ev) => {
    if (ev.button === 2) {
      return
    }

    const item = ev.item
    dragNodeModel = item.getModel()
    if (!dragNodeModel.parent || ev.shape.isCollapsedButton || ev.shape.isExpandedButton) {
      resetStatus()
      return
    }
    originNth = tree.getNth(item)
    tree.remove(item)
  })
  tree.behaviourOn('itempanning', (ev) => {
    if (ev.shape && ev.shape.isPlaceholder) {
      return
    }
    const hotArea = mind.getHotArea(ev)
    const root = mind.getRoot()

    if (lastHotArea) {
      if (hotArea) {
        if (lastHotArea.id !== hotArea.id) {
          tree.remove(tree.find(lastHotArea.id))
        }
      } else {
        tree.remove(tree.find(lastHotArea.id))
      }
    }
    lastHotArea = hotArea
    if (hotArea) {
      const parent = hotArea.parent

      if (!tree.find(hotArea.id)) {
        // const box = dragItem.getBBox();
        // const shapeObj = dragItem.getShapeObj();
        // const lineWidth = shapeObj.getStyle().lineWidth;
        const addModel = {
          id: hotArea.id,
          parent: parent.id,
          isPlaceholder: true,
          parentModel: parent,
          baseline: lastHotArea.parent.id === root.id ? 'center' : undefined,
          shape: 'mind-placeholder',
          // lineWidth,
          // width: box.width,
          // height: box.height,
          nth: hotArea.nth,
        }

        if (hotArea.side) {
          addModel.side = hotArea.side
        }

        tree.add('node', addModel)
      }
    }
  })
  tree.behaviourOn('drop', () => {
    if (dragNodeModel) {
      if (lastHotArea) {
        const model = Util.clone(dragNodeModel)
        tree.remove(lastHotArea.id)
        mind.executeCommand('moveMindNode', {
          model,
          newParentId: lastHotArea.parent.id,
          newNth: lastHotArea.nth,
          newSide: lastHotArea.side,
          originParentId: dragNodeModel.parent,
          originNth,
          originSide: dragNodeModel.side,
        })
      } else {
        resetDragNode()
      }
    }
    resetStatus()
  })
  tree.behaviourOn('canvas:mouseleave', () => {
    if (dragNodeModel) {
      resetDragNode()
      resetStatus()
    }
  })

  function resetDragNode() {
    dragNodeModel.nth = originNth
    const node = tree.add('node', dragNodeModel)
    mind.setSelected(node, true)

    if (lastHotArea) {
      tree.remove(lastHotArea.id)
    }
  }

  function resetStatus() {
    tree.emit('panitemend')
    dragNodeModel = undefined
    lastHotArea = undefined
    originNth = undefined
  }
}, ['startPanItem', 'processPanItem', 'endPanItem'])
