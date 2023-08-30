# Dynamic Import for React components

A powerful library for importing react components from configuration

## Usage

To use the library in your project, you need to create a clientImport function, just copy this and change the paths. One note to add route is the path to the file from the src down, in this case src will be at the same level as this file so we write "./". (this can be found in the example files)


### clientImport function
```javascript
const clientImport = (route: string) => {
  // this is the path to your source
  return import(`./${route}`).catch(() => {
    // path to your 404 component
    return import('./components/notFound');
  });
};
```

### Example config

This is the most basic config, your config should have routes key that is array and inside are objects that are requred to have the key "component" because that is the path to the component that we want to load.
```
{
 "routes": [
    {
      "component": "pages/dashboard"
    }
  ]
}
```

### Example passing props from config to a component
In this example after we load the component for dashboard we will pass "prop1" to the loaded component.
```
{
 "routes": [
    {
      "prop1": "prop1",
      "component": "pages/dashboard"
    }
  ]
}
```


### Nested example config with props
In this example we have nested structure, one important thing to note is that this can be nested as much as needed. the basic idea is that if you have key "component" you specify path to a react component and if there is a key "components" all the keys that you write are used to name the components when we pass them as props to the parent component.

In this specific example we load "pages/users" that is a list for users and we expect the loaded component to get 2 props "Table" and "Actions" and they are react components and Table component will get "prop1" and "prop2" as props and Actions component will get "prop1"

```
{
 "routes": [
    {
      "component": "pages/dashboard"
    },
    {
      "component": "pages/users",
      "components": {
        "Table": {
          "prop1": "prop1",
          "prop2": "prop2",
          "component": "pages/users/customTable"
        },
        "Actions": {
          "prop1": "prop1",
          "component": "pages/users/customAction"
        }
      }
    },
    {
      "component": "pages/users/create"
    },
    {
      "prop1": "prop1",
      "component": "pages/users/update"
    }
  ]
}
```
