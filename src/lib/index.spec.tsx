import {it, vi, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createStoreContext from './index';

it('renders without initial state', () => {
  const {useSlice} = createStoreContext({count: 10});

  const Component = vi.fn().mockImplementation(() => {
    useSlice();
    return null;
  });

  render(<Component />);

  expect(Component).toHaveBeenCalledTimes(1);
});

it('warns when state is not an object');

it('renders with full state when no selector', async () => {
  const {store, useSlice} = createStoreContext({count: 10});
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
  const {store, useSlice} = createStoreContext({count: 10});
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
  const {store, useSlice} = createStoreContext({count: 10});
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

it('should only update when its own slice changes', async () => {
  const {store, useSlice} = createStoreContext({count: 10, history: ['a']});

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
