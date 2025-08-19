import {useState} from 'react';
import {createStore, useSlice} from '../src';

type State = {
  paths: number[];
  obj: object;
  num: number;
  str: string;
};

const {store} = createStore({
  paths: [],
  obj: {},
  num: 1,
  str: 'never',
} as State);

function ChildStr() {
  const str = useSlice(store, (state) => state.str);

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
}

function ChildNum() {
  const num = useSlice(store, (state) => state.num);

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
}

function ChildPaths() {
  const paths = useSlice(store, (state) => state.paths);

  console.log('ChildPaths');
  return (
    <div style={{marginBottom: 24}}>
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
}

function ChildObj() {
  const obj = useSlice(store, (state) => state.obj);

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
}

function Dynamic() {
  const [name, setName] = useState('str');
  const slice: string = useSlice(store, name);

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
}

function GetState() {
  return (
    <button
      onClick={() => {
        console.log(JSON.stringify(store.getState(), null, 2));
      }}
    >
      log getState
    </button>
  );
}

function Demo() {
  return (
    <>
      <h1>Demo</h1>
      <ChildStr />
      <ChildNum />
      <ChildPaths />
      <ChildObj />
      <Dynamic />
      <GetState />
    </>
  );
}

export default Demo;
