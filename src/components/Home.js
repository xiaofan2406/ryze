import React from 'react';
import { Anchor } from '../widgets';

const Home = () => (
  <div>
    <div className="text-6xl text-center mb-2">Hello world!</div>
    <table className="mt-2">
      <tbody>
        <tr>
          <td className="p-4">React</td>
          <td className="p-4">
            <Anchor href="https://reactjs.org/docs/thinking-in-react.html">
              Docs
            </Anchor>
          </td>
          <td className="p-4">
            <Anchor href="https://github.com/facebook/react/">Github</Anchor>
          </td>
        </tr>
        <tr>
          <td className="p-4">React Router</td>
          <td className="p-4">
            <Anchor href="https://reactrouter.com/web/guides/quick-start">
              Docs
            </Anchor>
          </td>
          <td className="p-4">
            <Anchor href="https://github.com/ReactTraining/react-router">
              Github
            </Anchor>
          </td>
        </tr>
        <tr>
          <td className="p-4">TailwindCSS</td>
          <td className="p-4">
            <Anchor href="https://tailwindcss.com">Docs</Anchor>
          </td>
          <td className="p-4">
            <Anchor href="https://github.com/tailwindcss/tailwindcss">
              Github
            </Anchor>
          </td>
        </tr>
        <tr>
          <td className="p-4">Create React App</td>
          <td className="p-4">
            <Anchor href="https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents">
              Docs
            </Anchor>
          </td>
          <td className="p-4">
            <Anchor href="https://github.com/facebook/create-react-app/tree/master/packages/react-scripts">
              Github
            </Anchor>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Home;
