import { createStore } from 'redux';
import ChangeState from './reducer';

const store = createStore(ChangeState);

export default store;
