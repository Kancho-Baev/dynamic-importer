export type ClientImport = (route: string) => Promise<{ default: any }>;

export type Component = {
  component: string;
  components?: Record<string, Component>;
};

export type DefaultRoutes = {
  routes: Component[];
};

export type PreparedComponent = {
  component: React.ComponentType<any>;
  components?: Record<string, PreparedComponent>;
};

export type PreparedRoutes = {
  routes: PreparedComponent[];
};
