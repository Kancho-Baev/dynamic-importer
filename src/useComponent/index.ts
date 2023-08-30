import { prepareComponents } from './prepareNestedRoutes';
import { ClientImport, DefaultRoutes, PreparedRoutes } from './types';
import { useEffect, useReducer, useRef } from 'react';

const UPDATE = 'update';
const START_LOADING = 'loading';
const END_LOADING = 'end_loading';

type State = {
  loading: boolean;
  defaultConfig: DefaultRoutes;
  preparedConfig: PreparedRoutes;
};

type UseComponentProps = {
  config: DefaultRoutes;
  clientImport: ClientImport;
  [key: string]: any;
};

const initialState = {
  loading: true,
  defaultConfig: {},
  preparedConfig: {}
};

function reducer(
  state: State,
  { type, payload }: { type: string; payload?: any }
) {
  switch (type) {
    case UPDATE: {
      return { ...state, [payload.field]: payload.value };
    }

    case START_LOADING: {
      return {
        ...state,
        loading: true
      };
    }

    case END_LOADING: {
      return {
        ...state,
        defaultConfig: payload.defaultConfig,
        preparedConfig: payload.preparedComponents,
        loading: false
      };
    }

    default:
      return state;
  }
}

const useComponent = ({
  config,
  clientImport = (route: string) => Promise.resolve({ default: null }),
  ...extraProps
}: UseComponentProps) => {
  const [{ preparedConfig, defaultConfig, loading }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const prepearingComponents = useRef(false);

  useEffect(() => {
    if (!config?.routes || prepearingComponents.current) {
      return;
    }
    prepearingComponents.current = true;

    (async () => {
      try {
        dispatch({ type: START_LOADING });
        const preparedComponents = await prepareComponents(
          config,
          extraProps,
          clientImport
        );

        dispatch({
          type: END_LOADING,
          payload: { preparedComponents, defaultConfig: config }
        });

        prepearingComponents.current = false;
      } catch (error) {
        console.log({ error });
      }
    })();
  }, [JSON.stringify(config)]);

  return {
    loading,
    defaultConfig,
    preparedConfig
  };
};

export default useComponent;
