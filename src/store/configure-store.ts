import { createStore, Store } from 'redux';
import undoable, { includeAction, StateWithHistory } from 'redux-undo';
import * as constants from './contants';

import { ReactFlowState } from '../types';
import { ReactFlowAction } from './actions';
import reactFlowReducer from './reducer';

export default function configureStore(
  preloadedState: ReactFlowState
): Store<StateWithHistory<ReactFlowState>, ReactFlowAction> {
  const store = createStore(
    undoable(reactFlowReducer, {
      limit: 400,
      filter: includeAction([
        constants.SET_ELEMENTS,
        constants.UPDATE_NODE_DIMENSIONS,
        constants.UPDATE_NODE_POS,
        constants.UPDATE_NODE_POS_DIFF,
      ]),
    }),
    preloadedState as any as StateWithHistory<typeof preloadedState>
  );

  return store;
}
