import { Suspense, useCallback } from 'react';
import styled from 'styled-components';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ROUTE_CONFIG from '../routes_config.json';
// import { useComponent } from '@hooks';
import useComponent from 'dynamic-import-for-react';
// import { useComponent } from '@hooks';

const StyledApp = styled.div`
  // Your style here
`;

const clientImport = (route: string) => {
  return import(`../${route}`).catch(() => {
    return import('../components/notFound');
  });
};

export function App() {
  const test = useCallback(() => {
    console.log('custom logic goes here');
  }, []);

  const { loading, defaultConfig, preparedConfig } = useComponent({
    config: ROUTE_CONFIG,
    clientImport,
    test,
  });

  console.log({ loading, defaultConfig, preparedConfig });
  if (loading) {
    return <h1>Loading....</h1>;
  }

  console.log({ defaultConfig, preparedConfig });
  return (
    <StyledApp>
      {preparedConfig?.routes?.map((route: any, index: number) => {
        if (!route?.component) return null;
        const TestComponent = route.component;

        return (
          <Suspense key={index} fallback={<h1>Loading....</h1>}>
            {TestComponent}
          </Suspense>
        );
      })}
    </StyledApp>
  );
}

export default App;
