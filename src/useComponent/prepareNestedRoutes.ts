import { ClientImport, PreparedComponent, Component } from './types';
import getComponents from './getComponents.js';
import getSingleComponent from './getSingleComponent.js';

export const prepComponentObject = async (
  componentObject: Component & { routes?: Component[] },
  extraProps = {},
  clientImport: ClientImport = (route: string) =>
    Promise.resolve({ default: null })
): Promise<Component & { routes?: PreparedComponent[] | Component[] }> => {
  if (!componentObject.component) return componentObject;

  const { components, component, ...parentProps } = componentObject;
  const children = await getComponents(components, clientImport);

  const routes = parentProps?.routes
    ? //@ts-ignore
      await prepareNestedRoutes(parentProps.routes, extraProps, clientImport)
    : null;

  const foundParent = await getSingleComponent(
    component,
    {
      ...parentProps,
      ...(routes ? { routes } : {})
    },
    children,
    clientImport
  );

  //@ts-ignore
  return {
    ...componentObject,
    ...(routes ? { routes } : {}),
    ...extraProps,
    ...(Object.keys(children).length ? { components: children } : {}),
    ...(foundParent ? { component: foundParent } : {})
  };
};

const prepArray = async (
  arr: (Component & { routes?: Component[] })[],
  extraProps: any,
  clientImport: ClientImport = (route: string) =>
    Promise.resolve({ default: null })
) => {
  let resolvedComponents: (PreparedComponent | Component)[] = [];
  for await (let singleRoute of arr) {
    const resolvedRoute: PreparedComponent | Component =
      await prepComponentObject(singleRoute, extraProps, clientImport);

    resolvedComponents = [...resolvedComponents, resolvedRoute];
  }

  return resolvedComponents;
};

const prepObject = async (
  obj: any,
  extraProps: any,
  clientImport: ClientImport = (route: string) =>
    Promise.resolve({ default: null })
) => {
  let updatedObject = { ...obj };

  for await (let key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === 'object' && value?.component) {
      const resolvedRoute = await prepComponentObject(
        value,
        extraProps,
        clientImport
      );
      updatedObject = { ...updatedObject, [key]: resolvedRoute };
      continue;
    }

    if (Array.isArray(value)) {
      const resolvedRoute = await prepArray(value, extraProps, clientImport);
      updatedObject = { ...updatedObject, [key]: resolvedRoute };
      continue;
    }

    if (typeof value === 'object') {
      const resolvedRoute = await prepObject(value, extraProps, clientImport);
      updatedObject = { ...updatedObject, [key]: resolvedRoute };
      continue;
    }

    updatedObject = {
      ...updatedObject,
      [key]: value
    };
  }

  return updatedObject;
};

export const prepareComponents = async (
  config: any,
  extraProps = {},
  clientImport: ClientImport = (route: string) =>
    Promise.resolve({ default: null })
) => {
  let obj = { ...config };

  for await (const key of Object.keys(obj)) {
    const value: any = obj[key];

    if (Array.isArray(value)) {
      const resolvedArray = await prepArray(value, extraProps, clientImport);
      obj = { ...obj, [key]: resolvedArray };
      continue;
    }

    if (typeof value === 'object') {
      const resolvedObject = await prepObject(value, extraProps, clientImport);
      obj = { ...obj, [key]: resolvedObject };
      continue;
    }

    obj = { ...obj, [key]: value };
  }

  return obj;
};

const prepareNestedRoutes = async (
  routes: (Component & { routes: (Component & { routes: Component[] })[] })[],
  extraProps = {},
  clientImport: ClientImport = (route: string) =>
    Promise.resolve({ default: null })
) => {
  let resolvedComponents: (PreparedComponent | Component)[] = [];
  for await (let singleRoute of routes) {
    const resolvedRoute: PreparedComponent | Component =
      await prepComponentObject(singleRoute, extraProps, clientImport);
    resolvedComponents = [...resolvedComponents, resolvedRoute];
  }

  return resolvedComponents;
};

export default prepareNestedRoutes;
