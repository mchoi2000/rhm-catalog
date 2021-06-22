import React from 'react';
import './app.scss';
import { Content } from 'carbon-components-react';
import { Route, Switch } from 'react-router-dom';
import RHMHeader from './components/ui/Header';
import Arrow from './content/ArrowPage';
import Software from './content/SoftwarePage';
import Datasets from './content/DatasetPage';

const App = () => {
  const dataUpdated = '2021-6-22 9AM ET';

  return (
    <>
      <RHMHeader />
      <Content>
        <Switch>
          <Route
            path="/"
            exact
            render={() => <Software updated={dataUpdated} />}
          />
          <Route
            path="/arrow"
            exact
            render={() => <Arrow updated={dataUpdated} />}
          />
          <Route
            path="/datasets"
            render={() => <Datasets updated={dataUpdated} />}
          />
        </Switch>
      </Content>
    </>
  );
};

export default App;
