import {createStoreContext} from './lib';

const {Provider, useSlice, useSetState} = createStoreContext();

const Child = () => {
  const count = useSlice(state => state.count);
  const setState = useSetState();

  return (
    <div>
      <div>count: {count}</div>
      <button
        onClick={() => {
          setState(prev => ({...prev, count: prev.count + 1}));
        }}
      >
        Add
      </button>
    </div>
  );
};

const Example = () => {
  return (
    <Provider initialState={{count: 10}}>
      <Child />
    </Provider>
  );
};

export default Example;
