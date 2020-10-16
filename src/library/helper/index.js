import Search from './search';
import Translate from './translate';
import IFrame from './iframe';
import Uploader from './uploader';
import Transfer from './transfer';

const helper = {
  search: Search,
  translate: Translate,
  uploader: Uploader,
  iframeHelper: IFrame,
  pasteFileTransfer: Transfer,
};
export default function (engine, name) {
  let options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
  if (engine && helper[name]) {
    options = Object.assign({}, options, {
      engine,
    });
    engine[name] = new helper[name](options);
  }
}
