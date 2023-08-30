import React from 'react';
import { ClientImport, Component } from './types';
import dynamicImport from './dynamicImport';

const getComponents = async (
  components: Record<string, Component> | undefined,
  clientImport: ClientImport = (route: string) =>
    Promise.resolve({ default: null })
) => {
  if (!components) return {};

  const componentResponse = Object.keys(components).map(async (key: string) => {
    const {
      component,
      components: nestedComponentsJson,
      ...configProps
    } = components[key];

    const FoundImport = await dynamicImport(component, clientImport);
    const nestedComponents = await getComponents(
      nestedComponentsJson,
      clientImport
    );

    return {
      [key]: (props = {}) => (
        <FoundImport {...configProps} {...props} {...nestedComponents} />
      )
    };
  });

  let componentObject = {};

  for await (const componentChunk of componentResponse) {
    const resolvedChunk = await componentChunk;
    componentObject = { ...componentObject, ...resolvedChunk };
  }

  return componentObject;
};

export default getComponents;
