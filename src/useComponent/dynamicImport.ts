import { lazy, LazyExoticComponent } from 'react';

export type Route = string;

const dynamicImport = (
  route: Route,
  clientImport: (route: string) => Promise<{ default: any }>
): LazyExoticComponent<any> | Route => {
  if (typeof route === 'string') {
    return lazy(() => clientImport(route));
  }

  return route;
};

export default dynamicImport;
