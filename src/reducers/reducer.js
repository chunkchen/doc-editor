import { FOLD, UNFOLD } from './actionTypes';

const initialState = {
  collapsed: sessionStorage.getItem('collapsed') === 'true' || false,
};

export default function changeState(state = initialState, action) {
  switch (action.type) {
    case FOLD:
      return {
        collapsed: true,
      };
    case UNFOLD:
      return {
        collapsed: false,
      };
    default:
      return state;
  }
}
