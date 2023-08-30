import React from 'react';
import dynamicImport from './dynamicImport';
import { ClientImport } from './types';

const getSingleComponent = async (
  component: string,
  extraProps: any = {},
  children: any = {},
  clientImport: ClientImport
) => {
  if (!component) return null;

  const FoundImport = await dynamicImport(component, clientImport);
  return <FoundImport {...extraProps} {...children} />;
};

export default getSingleComponent;
