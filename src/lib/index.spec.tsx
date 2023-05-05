import {ReactNode} from 'react';
import {it, vi, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import createStoreContext from './index';

const {StoreProvider, useSlice, useSetState} = createStoreContext();

const Setup = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: object;
}) => {
  return <StoreProvider initialState={initialState}>{children}</StoreProvider>;
};

it('renders without initial state', () => {
  const Component = vi.fn().mockImplementation(() => {
    useSlice();
    return null;
  });

  render(
    <Setup>
      <Component />
    </Setup>
  );

  expect(Component).toHaveBeenCalledTimes(1);
});

it('warns when state is not an object');

it('renders with full state when no selector', async () => {
  const Component = vi.fn().mockImplementation(() => {
    const state = useSlice();
    const setState = useSetState();
    return (
      <div>
        <div data-testid="count">{state.count}</div>
        <button
          data-testid="add"
          onClick={() => {
            setState(prev => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(
    <Setup initialState={{count: 10}}>
      <Component />
    </Setup>
  );
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('10');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('11');
});

it('renders string slice', async () => {
  const Component = vi.fn().mockImplementation(() => {
    const count = useSlice('count');
    const setState = useSetState();
    return (
      <div>
        <div data-testid="count">{count}</div>
        <button
          data-testid="add"
          onClick={() => {
            setState(prev => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(
    <Setup initialState={{count: 10}}>
      <Component />
    </Setup>
  );
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('10');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('11');
});

it('renders selector function slice', async () => {
  const getIsEven = state => state.count % 2 === 0;
  const Component = vi.fn().mockImplementation(() => {
    const isEven = useSlice(getIsEven);
    const setState = useSetState();
    return (
      <div>
        <div data-testid="count">{isEven ? 'even' : 'odd'}</div>
        <button
          data-testid="add"
          onClick={() => {
            setState(prev => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(
    <Setup initialState={{count: 10}}>
      <Component />
    </Setup>
  );
  expect(Component).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('count')).toHaveTextContent('even');

  await user.click(screen.getByTestId('add'));
  expect(Component).toHaveBeenCalledTimes(2);
  expect(screen.getByTestId('count')).toHaveTextContent('odd');
});

it('should only update when its own slice changes', async () => {
  const History = vi.fn().mockImplementation(() => {
    const history = useSlice('history');
    const setState = useSetState();
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
            setState(prev => ({
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
    const setState = useSetState();
    return (
      <div>
        <div data-testid="count">{count}</div>
        <button
          data-testid="add"
          onClick={() => {
            setState(prev => ({...prev, count: prev.count + 1}));
          }}
        >
          add
        </button>
      </div>
    );
  });

  const user = userEvent.setup();
  render(
    <Setup initialState={{count: 10, history: ['a']}}>
      <Counter />
      <History />
    </Setup>
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
