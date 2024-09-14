import {useMemo} from 'react';
import {createSelector} from 'reselect';
import {createStoreContext} from './lib';

type State = {
  count: number;
  todos: {title: string; id: number; completed: boolean}[];
};

const {StoreProvider, useStore, useSlice} = createStoreContext<State>();

function Counter() {
  const count = useSlice('count') as State['count'];
  const store = useStore();
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

const makeGetTodos = (completed) =>
  createSelector(
    (state) => state.todos,
    (todos) => todos.filter((item) => item.completed === completed)
  );

function Todos({completed = false}: {completed?: boolean}) {
  const getTodos = useMemo(() => makeGetTodos(completed), [completed]);
  const todos = useSlice(getTodos);
  const store = useStore();

  console.log('Todos', completed);
  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => {
              store.setState((prev) => ({
                ...prev,
                todos: prev.todos.map((entry) =>
                  todo.id === entry.id
                    ? {...entry, completed: !entry.completed}
                    : entry
                ),
              }));
            }}
          >
            ({todo.id}){todo.title}
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          store.setState((prev) => ({
            ...prev,
            todos: [
              ...prev.todos,
              {title: 'New Todo', id: uid(), completed: false},
            ],
          }));
        }}
      >
        Add
      </button>
    </div>
  );
}

function ContextExample() {
  return (
    <StoreProvider initialState={{count: 10, todos: []}}>
      <Counter />
      <h2>Todo:</h2>
      <Todos />
      <h2>Completed:</h2>
      <Todos completed />
    </StoreProvider>
  );
}

export default ContextExample;

let id = 0;
function uid() {
  return id++;
}
