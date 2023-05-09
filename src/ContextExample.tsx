import {createStoreContext} from './lib';

type State = {
  count: number;
  todos: {title: string; date: number; completed: boolean}[];
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

const getActiveTodos = (state: State) =>
  state.todos.filter((item) => !item.completed);

function Todos() {
  const todos = useSlice(getActiveTodos);
  const store = useStore();

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

function ContextExample() {
  return (
    <StoreProvider initialState={{count: 10, todos: []}}>
      <Counter />
      <Todos />
    </StoreProvider>
  );
}

export default ContextExample;
