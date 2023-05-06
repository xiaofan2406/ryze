# Ryze

A minimal state management library for React.

## Install

```bash
npm install ryze
```

## Example

```jsx
import createStore from 'ryze';

const {store, useSlice} = createStore({count: 10, todos: []});

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

## Constraints

#### Selectors

Selector passed to `useSlice` should have the same identity across re renders.

That is,

- either declare selectors outside of components, or
- if the selector is dependent on component props, use `useCallback` to ensure the selector only changes when the prop change.

#### Updates

Updates should be immutable. Return new values, rather than modify the state value directly.
