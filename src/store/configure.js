// Create a store function and export it
// This function will be called from store / index.js
import { createStore, combineReducers } from 'redux';

function PlaceholderReducer(state = {}, action) {
  switch (action.type) {
    case 'EXAMPLE':
      return {example: true}
    default:
      return state;
  }
}

const rootReducer = combineReducers({placeholder: PlaceholderReducer});

const configure = () => {
  const store = createStore(rootReducer);
  return store;
}

export default configure;
