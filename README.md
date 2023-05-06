# Ryze

```jsx
import createStoreContext from 'ryze';

const {store, useSlice} = createStoreContext({count: 10, todos: []});

const Counter = () => {
  const count = useSlice('count');

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
};

const getActiveTodos = (state) => state.todos.filter((item) => !item.completed);

const Todos = () => {
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
            todos: [...prev.todos, {title: 'New Todo', date: +new Date()}],
          }));
        }}
      >
        Add
      </button>
    </div>
  );
};

const Example = () => {
  return (
    <>
      <Counter />
      <Todos />
    </>
  );
};
```
