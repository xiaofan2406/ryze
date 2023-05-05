import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import {StoreProvider, useSetState, useSlice, useGetState} from './AppContext';
import Example from './Example';

import './App.css';

const ChildStr = () => {
  const str = useSlice(state => state.str) as string;
  const setState = useSetState();

  console.log('ChildStr');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildStr</h2>
      {str}
      <button
        onClick={() => {
          setState(prev => ({
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
  const num = useSlice(state => state.num) as string;
  const setState = useSetState();

  console.log('ChildNum');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildNum</h2>
      {num}
      <button
        onClick={() => {
          setState(prev => ({
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
  const paths = useSlice(state => state.paths) as string;
  const setState = useSetState();

  console.log('ChildPaths');
  return (
    <div style={{marginBottom: 24}}>
      <Another />
      <h2>ChildPaths</h2>
      <pre>{JSON.stringify(paths, null, 2)}</pre>
      <button
        onClick={() => {
          setState(prev => ({
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
  const obj = useSlice(state => state.obj) as string;
  const setState = useSetState();

  console.log('ChildObj');
  return (
    <div style={{marginBottom: 24}}>
      <h2>ChildObj</h2>
      <pre>{JSON.stringify(obj, null, 2)}</pre>
      <button
        onClick={() => {
          setState(prev => ({
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
  const [name, setName] = useState('str');
  // const selector = useCallback(state => state[name], [name]);

  const slice = useSlice(name);

  console.log('Dynamic');
  return (
    <div style={{marginBottom: 24}}>
      <h2>Dynamic</h2>
      <div>
        {name}: {slice}
      </div>
      <button onClick={() => setName(prev => (prev === 'str' ? 'num' : 'str'))}>
        Toggle
      </button>
    </div>
  );
};

const GetState = () => {
  const getState = useGetState();
  return (
    <button
      onClick={() => {
        console.log(JSON.stringify(getState(), null, 2));
      }}
    >
      log getState
    </button>
  );
};

function App() {
  console.log('App');

  return (
    <StoreProvider initialState={{paths: [], obj: {}, num: 1, str: 'never'}}>
      <ChildStr />
      <ChildNum />
      <Dynamic />
      <ChildPaths />
      <ChildObj />
      <GetState />
      <Example />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </StoreProvider>
  );
}

export default App;
