import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Layout, Home, Navigation } from './components';
import './styles/index.css';

const About = React.lazy(() =>
  import(/* webpackChunkName: "About" */ './components/About')
);

const Contact = React.lazy(() =>
  import(/* webpackChunkName: "Contact" */ './components/Contact')
);

const NotFound = React.lazy(() =>
  import(/* webpackChunkName: "NotFound" */ './components/NotFound')
);

const App = () => (
  <React.Suspense fallback="loading...">
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        <Navigation />
      </Layout>
    </BrowserRouter>
  </React.Suspense>
);

export default App;
