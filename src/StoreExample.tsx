import {createStore} from './lib';

type State = {
  count: number;
  todos: {title: string; date: number; completed: boolean}[];
};

const {store, useSlice} = createStore<State>({count: 10, todos: []});

function Counter() {
  const count = useSlice('count') as State['count'];

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

function getActiveTodos(state: State) {
  return state.todos.filter((item) => !item.completed);
}

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
      <Counter />
      <Todos />
    </>
  );
}

export default StoreExample;
