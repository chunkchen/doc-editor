export const lists = (element) => {
  element.find('ul,ol').each((node) => {
    const indent = parseInt(node.getAttribute('data-itellyou-indent'), 10) || 0;
    node.style.padding = '0';
    node.style.margin = '0';
    node.style['margin-left'] = ''.concat(28 * indent, 'px');
  });
};
