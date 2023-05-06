import {ReactNode, useState} from 'react';
import Example from './Example';
import createStoreContext from './lib';

import './App.css';

type State = {
  paths: number[];
  obj: object;
  num: number;
  str: string;
};

const {store, useSlice} = createStoreContext({
  paths: [],
  obj: {},
  num: 1,
  str: 'never',
} as State);

const ChildStr = () => {
  const str = useSlice((state) => state.str);

  console.log('ChildStr');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildStr</h2>
      {str}
      <button
        onClick={() => {
          store.setState((prev) => ({
            ...prev,
            str: prev.str + 'k',
          }));
        }}
      >
        add
      </button>
    </div>
  );
};

const ChildNum = () => {
  const num = useSlice((state) => state.num);

  console.log('ChildNum');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildNum</h2>
      {num}
      <button
        onClick={() => {
          store.setState((prev) => ({
            ...prev,
            num: prev.num + 1,
          }));
        }}
      >
        add
      </button>
    </div>
  );
};

const Another = () => {
  console.log('Another');
  return null;
};

const ChildPaths = () => {
  const paths = useSlice((state) => state.paths);

  console.log('ChildPaths');
  return (
    <div style={{marginBottom: 24}}>
      <Another />
      <h2>ChildPaths</h2>
      <pre>{JSON.stringify(paths, null, 2)}</pre>
      <button
        onClick={() => {
          store.setState((prev) => ({
            ...prev,
            paths: [...prev.paths, Math.random()],
          }));
        }}
      >
        add
      </button>
    </div>
  );
};

const ChildObj = () => {
  const obj = useSlice((state) => state.obj);

  console.log('ChildObj');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildObj</h2>
      <pre>{JSON.stringify(obj, null, 2)}</pre>
      <button
        onClick={() => {
          store.setState((prev) => ({
            ...prev,
            obj: {
              ...prev.obj,
              x: 1,
            },
          }));
        }}
      >
        add
      </button>
    </div>
  );
};

const Dynamic = () => {
  const [name, setName] = useState('str' as keyof State);
  const slice = useSlice(name) as ReactNode;

  console.log('Dynamic');
  return (
    <div style={{marginBottom: 24}}>
      <h2>Dynamic</h2>
      <div>
        {name}: {slice}
      </div>
      <button
        onClick={() => setName((prev) => (prev === 'str' ? 'num' : 'str'))}
      >
        Toggle
      </button>
    </div>
  );
};

const GetState = () => {
  return (
    <button
      onClick={() => {
        console.log(JSON.stringify(store.getState(), null, 2));
      }}
    >
      log getState
    </button>
  );
};

function App() {
  console.log('App');

  return (
    <div>
      <Dynamic />
      <ChildStr />
      <ChildNum />
      <ChildPaths />
      <ChildObj />
      <GetState />
      <Example />
    </div>
  );
}

export default App;
