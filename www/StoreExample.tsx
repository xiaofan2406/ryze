import {createSelector} from 'reselect';
import {createStore} from '../src';

type State = {
  count: number;
  todos: {title: string; date: number; completed: boolean}[];
};

const {store, useSlice} = createStore<State>({count: 10, todos: []});

function Counter() {
  const count = useSlice<number>('count');

  return (
    <div>
      <div>count: {count}</div>
      <button
        onClick={() => {
          store.setState((prev) => ({...prev, count: prev.count + 1}));
        }}
      >
        Add
      </button>
    </div>
  );
}

const getActiveTodos = createSelector(
  (state: State) => state.todos,
  (todos) => todos.filter((item) => !item.completed)
);

function Todos() {
  const todos = useSlice(getActiveTodos);

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.date}>{todo.title}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          store.setState((prev) => ({
            ...prev,
            todos: [
              ...prev.todos,
              {title: 'New Todo', date: +new Date(), completed: false},
            ],
          }));
        }}
      >
        Add
      </button>
    </div>
  );
}

function StoreExample() {
  return (
    <>
      <h1>StoreExample</h1>
      <Counter />
      <Todos />
    </>
  );
}

export default StoreExample;
