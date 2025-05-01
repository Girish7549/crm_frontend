import { legacy_createStore as createStore } from 'redux';

const userData = JSON.parse(localStorage.getItem("user"));


const initialState = {
  sidebarShow: true,
  theme: 'light',
  user: null,
  coin: userData?.trialCount || 0,
};

// Main reducer
const changeState = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'set':
      return { ...state, ...payload };

    case 'setUser':
      return { ...state, user: payload };

    case 'decrementCoin':
      return {
        ...state,
        coin: state.coin > 0 ? state.coin - 1 : 0, 
      };

    case 'setCoin':
      console.log("payload global", payload)
      return { ...state, coin: payload }; 

    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;
