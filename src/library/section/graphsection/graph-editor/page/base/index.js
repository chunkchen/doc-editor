/**
 * @fileOverview Page entry file
 */
import G6 from '@antv/g6';
import Page from './page';
import Util from './util';

const baseShape = {
  getActivedStyle() {
  },
  getSelectedStyle() {
  },
};
G6.registerNode('page-base', { ...baseShape });
G6.registerEdge('page-base', { ...baseShape });
G6.registerGroup('page-base', { ...baseShape });
G6.registerGuide('page-base', { ...baseShape });

function getExtendShape(extend, baseExtend, parentConstructorName) {
  let rst = [];

  if (Util.isString(extend)) {
    rst = [baseExtend, extend];
  } else if (Util.isArray(extend)) {
    extend.unshift(baseExtend);
    rst = extend;
  } else {
    rst = [baseExtend];
  }
  parentConstructorName && rst.unshift(`${parentConstructorName}-base`);
  return rst;
}

Page.setRegister = function (Constructor, constructorName, parentConstructorName) {
  Constructor.registerNode = function (name, cfg, extend) {
    G6.registerNode(name, cfg, getExtendShape(extend, `${constructorName}-base`, parentConstructorName));
  };

  Constructor.registerEdge = function (name, cfg, extend) {
    G6.registerEdge(name, cfg, getExtendShape(extend, `${constructorName}-base`, parentConstructorName));
  };

  Constructor.registerGroup = function (name, cfg, extend) {
    G6.registerGroup(name, cfg, getExtendShape(extend, `${constructorName}-base`, parentConstructorName));
  };

  Constructor.registerGuide = function (name, cfg, extend) {
    G6.registerGuide(name, cfg, getExtendShape(extend, `${constructorName}-base`, parentConstructorName));
  };

  Constructor.registerBehaviour = function (name, behaviour, dependences) {
    G6.registerBehaviour(name, (graph) => {
      const page = graph.get('page');
      page.set('_graph', graph);
      behaviour(page);
    }, dependences);
  };
};

Page.setRegister(Page, 'page');
require('./behaviour');

export default Page;
