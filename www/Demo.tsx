import {useState} from 'react';
import {createStore, useSlice, useSetSlice} from '../src';

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
  const setStr = useSetSlice(store, 'str');

  console.log('ChildStr');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildStr</h2>
      {str}
      <button
        onClick={() => {
          setStr((prev) => prev + 'k');
        }}
      >
        add
      </button>
    </div>
  );
}

function ChildNum() {
  const num = useSlice(store, (state) => state.num);
  const setNum = useSetSlice(store, 'num');

  console.log('ChildNum');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildNum</h2>
      {num}
      <button
        onClick={() => {
          setNum((prev) => prev + 1);
        }}
      >
        add
      </button>
    </div>
  );
}

function ChildPaths() {
  const paths = useSlice(store, (state) => state.paths);
  const setPaths = useSetSlice(store, 'paths');

  console.log('ChildPaths');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildPaths</h2>
      <pre>{JSON.stringify(paths, null, 2)}</pre>
      <button
        onClick={() => {
          setPaths((prev) => [...prev, Math.random()]);
        }}
      >
        add
      </button>
    </div>
  );
}

function ChildObj() {
  const obj = useSlice(store, (state) => state.obj);
  const setObj = useSetSlice(store, 'obj');

  console.log('ChildObj');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildObj</h2>
      <pre>{JSON.stringify(obj, null, 2)}</pre>
      <button
        onClick={() => {
          setObj((prev) => ({...prev, x: 1}));
        }}
      >
        add
      </button>
    </div>
  );
}

function Dynamic() {
  const [name, setName] = useState<'str' | 'num'>('str');
  const slice = useSlice(store, name);

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
