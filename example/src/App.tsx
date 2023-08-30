import { Suspense, useCallback } from 'react';
import ROUTE_CONFIG from './routes_config.json';
import useComponent from 'dynamic-import-for-react';

const clientImport = (route: string) => {
  // this is the path to your source
  return import(`./${route}`).catch(() => {
    // path to your 404 component
    return import('./components/notFound');
  });
};

export function App() {
  // This is a custom function that you can pass to all of your components
  const CustomFancyFunction = useCallback(() => {
    console.log('custom logic goes here');
  }, []);

  const { loading, preparedConfig } = useComponent({
    config: ROUTE_CONFIG,
    clientImport,
    CustomFancyFunction
  });

  if (loading) {
    return <h1>Loading....</h1>;
  }

  return (
    <div>
      {preparedConfig?.routes?.map(
        (route: { component: React.ReactNode }, index: number) => {
          if (!route?.component) return null;
          const TestComponent = route.component;

          return (
            <Suspense key={index} fallback={<h1>Loading....</h1>}>
              {TestComponent}
            </Suspense>
          );
        }
      )}
    </div>
  );
}

export default App;
