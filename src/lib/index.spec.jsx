import React from 'react';
import {it, vi, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {createStore} from './index';

it('renders without initial state', () => {
  const {useSlice} = createStore({count: 10});

  const Component = vi.fn().mockImplementation(() => {
    useSlice();
    return null;
  });

  render(<Component />);

  expect(Component).toHaveBeenCalledTimes(1);
});

it('warns when state is not an object');

it('renders with full state when no selector', async () => {
  const {store, useSlice} = createStore({count: 10});
  const Component = vi.fn().mockImplementation(() => {
    const state = useSlice();
    return (
      <div>
        <div data-testid="count">{state.count}</div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('10');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('11');
});

it('renders string slice', async () => {
  const {store, useSlice} = createStore({count: 10});
  const Component = vi.fn().mockImplementation(() => {
    const count = useSlice('count');
    return (
      <div>
        <div data-testid="count">{count}</div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('10');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('11');
});

it('renders selector function slice', async () => {
  const {store, useSlice} = createStore({count: 10});
  const getIsEven = (state) => state.count % 2 === 0;
  const Component = vi.fn().mockImplementation(() => {
    const isEven = useSlice(getIsEven);
    return (
      <div>
        <div data-testid="count">{isEven ? 'even' : 'odd'}</div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('even');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('odd');
});

it('supports initializer function', async () => {
  const {store, useSlice} = createStore(() => ({count: 10}));
  const getIsEven = (state) => state.count % 2 === 0;
  const Component = vi.fn().mockImplementation(() => {
    const isEven = useSlice(getIsEven);
    return (
      <div>
        <div data-testid="count">{isEven ? 'even' : 'odd'}</div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('even');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('odd');
});

it('only updates when its own slice changes', async () => {
  const {store, useSlice} = createStore({count: 10, history: ['a']});

  const History = vi.fn().mockImplementation(() => {
    const history = useSlice('history');
    return (
      <div>
        <div data-testid="history">
          {history.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
        <button
          data-testid="push"
          onClick={() => {
            store.setState((prev) => ({
              ...prev,
              history: [...prev.history, 'a'],
            }));
          }}
        >
          push
        </button>
      </div>
    );
  });
  const Counter = vi.fn().mockImplementation(() => {
    const count = useSlice('count');
    return (
      <div>
        <div data-testid="count">{count}</div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(
    <>
      <Counter />
      <History />
    </>
  );
  expect(Counter).toHaveBeenCalledTimes(1);
  expect(History).toHaveBeenCalledTimes(1);

  await user.click(screen.getByTestId('add'));
  await user.click(screen.getByTestId('add'));
  expect(History).toHaveBeenCalledTimes(1);
  expect(Counter).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('count')).toHaveTextContent('12');

  await user.click(screen.getByTestId('push'));
  await user.click(screen.getByTestId('push'));
  expect(History).toHaveBeenCalledTimes(3);
  expect(Counter).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('history')).toHaveTextContent('aaa');
});

it('only update once when there are multiple subscriptions in one component', async () => {
  const {store, useSlice} = createStore({count: 10, history: ['a']});

  const getHistoryLength = (state) => state.history.length;
  const Component = vi.fn().mockImplementation(() => {
    const count = useSlice('count');
    const length = useSlice(getHistoryLength);

    return (
      <div>
        <div data-testid="count">
          {count} {length}
        </div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({
              ...prev,
              count: prev.count + 1,
              history: [...prev.history, 'a'],
            }));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('10 1');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('11 2');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('count')).toHaveTextContent('12 3');
});

it('support dynamic string selector', async () => {
  const {store, useSlice} = createStore({
    count: 10,
    history: ['a', 'a'],
  });
  const Component = vi.fn().mockImplementation(() => {
    const [name, setName] = React.useState('count');
    const data = useSlice(name);

    return (
      <>
        <div data-testid="target">
          {name === 'count' ? data : data.join('')}
        </div>
        <button
          data-testid="switch"
          onClick={() =>
            setName((prev) => (prev === 'count' ? 'history' : 'count'))
          }
        >
          switch
        </button>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
        <button
          data-testid="push"
          onClick={() => {
            store.setState((prev) => ({
              ...prev,
              history: [...prev.history, 'a'],
            }));
          }}
        >
          push
        </button>
      </>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('target')).toHaveTextContent('10');

  // change history state but component is using count atm
  await user.click(screen.getByTestId('push'));
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('target')).toHaveTextContent('10');

  // change to use history data
  await user.click(screen.getByTestId('switch'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('target')).toHaveTextContent('aaa');

  await user.click(screen.getByTestId('push'));
  expect(Component).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('target')).toHaveTextContent('aaaa');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('target')).toHaveTextContent('aaaa');
});

it('support dynamic function selector', async () => {
  const {store, useSlice} = createStore({
    count: 10,
    history: ['a', 'a'],
  });

  const getHistoryLength = (state) => state.history.length;
  const getIsCountEven = (state) => (state.count % 2 === 0 ? 'even' : 'odd');
  const Component = vi.fn().mockImplementation(() => {
    const [name, setName] = React.useState('count');
    const data = useSlice(name === 'count' ? getIsCountEven : getHistoryLength);

    return (
      <>
        <div data-testid="target">{data}</div>
        <button
          data-testid="switch"
          onClick={() =>
            setName((prev) => (prev === 'count' ? 'history' : 'count'))
          }
        >
          switch
        </button>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
        <button
          data-testid="push"
          onClick={() => {
            store.setState((prev) => ({
              ...prev,
              history: [...prev.history, 'a'],
            }));
          }}
        >
          push
        </button>
      </>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('target')).toHaveTextContent('even');

  // change history state but component is using count atm
  await user.click(screen.getByTestId('push'));
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('target')).toHaveTextContent('even');

  // change to use history data
  await user.click(screen.getByTestId('switch'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('target')).toHaveTextContent('3');

  await user.click(screen.getByTestId('push'));
  expect(Component).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('target')).toHaveTextContent('4');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(3);
  expect(screen.getByTestId('target')).toHaveTextContent('4');
});

it('resets initial state', async () => {
  const {store, useSlice} = createStore({count: 10, history: ['a']});

  const getHistoryLength = (state) => state.history.length;
  const Component = vi.fn().mockImplementation(() => {
    const count = useSlice('count');
    const length = useSlice(getHistoryLength);

    return (
      <div>
        <div data-testid="count">
          {count} {length}
        </div>
        <button
          data-testid="add"
          onClick={() => {
            store.setState((prev) => ({
              ...prev,
              count: prev.count + 1,
              history: [...prev.history, 'a'],
            }));
          }}
        >
          add
        </button>

        <button
          data-testid="reset"
          onClick={() => {
            store.reset();
          }}
        >
          reset
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(<Component />);
  expect(screen.getByTestId('count')).toHaveTextContent('10 1');

  await user.click(screen.getByTestId('add'));
  await user.click(screen.getByTestId('add'));
  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(4);
  expect(screen.getByTestId('count')).toHaveTextContent('13 4');

  await user.click(screen.getByTestId('reset'));
  expect(Component).toHaveBeenCalledTimes(5);
  expect(screen.getByTestId('count')).toHaveTextContent('10 1');
});
