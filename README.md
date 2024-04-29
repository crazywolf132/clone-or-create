# clone-or-create

[![npm version](https://badge.fury.io/js/clone-or-create.svg)](https://badge.fury.io/js/clone-or-create)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`clone-or-create` is a powerful and flexible library for cloning and creating React elements. It provides a simple and intuitive API to clone existing elements or create new ones with enhanced features and optimizations.

## Features

- Clone existing React elements or create new ones
- Merge and extend props of cloned or created elements
- Memoize elements for performance optimization
- Manage state using `useReducer` and `initialState`
- Lifecycle methods for fine-grained control
- Context support for passing data through the component tree
- Snapshot support for capturing component state before updates
- Error boundary handling with `componentDidCatch`
- Backward compatibility with previous versions
- Lightweight version available at `clone-or-create/tiny`

## Installation

```bash
npm install clone-or-create
```

or

```bash
yarn add clone-or-create
```

## Usage

### Basic Usage

```tsx
import cloneOrCreate from 'clone-or-create';

const MyComponent = ({ text }) => <div>{text}</div>;

const ClonedComponent = cloneOrCreate(MyComponent, { text: 'Cloned' });
const CreatedComponent = cloneOrCreate('div', { className: 'created' }, 'Created');
```

### Advanced Usage

```tsx
import cloneOrCreate from 'clone-or-create';

interface MyComponentProps {
  text: string;
  onClick: () => void;
}

interface MyComponentState {
  count: number;
}

const MyComponent = ({ text, onClick }) => (
  <button onClick={onClick}>{text}</button>
);

const EnhancedComponent = cloneOrCreate<typeof MyComponent, MyComponentState>({
  component: MyComponent,
  props: {
    text: 'Click me',
    onClick: () => console.log('Clicked'),
  },
  initialState: {
    count: 0,
  },
  reducer: (state, action) => {
    switch (action.type) {
      case 'increment':
        return { ...state, count: state.count + 1 };
      default:
        return state;
    }
  },
  onStateChange: (prevState, nextState) => {
    console.log('State changed:', prevState, nextState);
  },
  shouldMemo: true,
  displayName: 'EnhancedComponent',
});
```

### Tiny Version

```tsx
import cloneOrCreate from 'clone-or-create/tiny';

const MyComponent = ({ text }) => <div>{text}</div>;

const ClonedComponent = cloneOrCreate(MyComponent, { text: 'Cloned' });
const CreatedComponent = cloneOrCreate({
  component: 'div',
  props: { className: 'created' },
  children: 'Created',
});
```

## API

### `cloneOrCreate<C, S>(componentOrOptions: C | CloneOrCreateOptions<C, S>, props?: ComponentProps<C>, children?: ReactNode): ReactElement | ReactPortal`

Clones an existing element or creates a new one based on the provided options.

#### Parameters

- `componentOrOptions`: The component to clone or create, or an options object.
- `props` (optional): The props to merge with the cloned or created element.
- `children` (optional): The children to pass to the cloned or created element.

#### Options

- `component`: The component to clone or create.
- `props` (optional): The props to merge with the cloned or created element.
- `children` (optional): The children to pass to the cloned or created element.
- `ref` (optional): The ref to attach to the cloned or created element.
- `key` (optional): The key to assign to the cloned or created element.
- `mergeProp` (optional): A function to merge existing and new props.
- `shouldMemo` (optional): Whether to memoize the element for performance optimization.
- `displayName` (optional): The display name for the memoized component.
- `context` (optional): Additional context to pass through the component tree.
- `propsAreEqual` (optional): A function to compare props for memoization.
- `beforeClone` (optional): A function to execute before cloning the element.
- `afterClone` (optional): A function to execute after cloning the element.
- `initialState` (optional): The initial state for the cloned or created element.
- `reducer` (optional): A reducer function to manage the element's state.
- `onUpdate` (optional): A function to execute when the props update.
- `onStateChange` (optional): A function to execute when the state changes.
- `shouldUpdate` (optional): A function to determine if the element should update.
- `getSnapshotBeforeUpdate` (optional): A function to capture a snapshot before the element updates.
- `componentDidMount` (optional): A function to execute when the element mounts.
- `componentWillUnmount` (optional): A function to execute when the element unmounts.
- `componentDidCatch` (optional): A function to handle errors thrown by the element.

### `cloneOrCreate/tiny`

A lightweight version of `clone-or-create` with a simplified API and reduced features.

#### Parameters

- `componentOrOptions`: The component to clone or create, or an options object.
- `props` (optional): The props to merge with the cloned or created element.
- `children` (optional): The children to pass to the cloned or created element.

#### Options

- `component`: The component to clone or create.
- `props` (optional): The props to merge with the cloned or created element.
- `children` (optional): The children to pass to the cloned or created element.
- `ref` (optional): The ref to attach to the cloned or created element.
- `key` (optional): The key to assign to the cloned or created element.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

Feel free to customize the README.md file based on your project's specific details, such as the package name, installation instructions, usage examples, and any additional sections you want to include.