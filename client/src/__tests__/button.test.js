import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import useCounter from '../../components/use-counter';

function useCounter({ initialCount = 0, step = 1 } = {}) {
  const [count, setCount] = React.useState(initialCount);
  const increment = () => setCount((c) => c + step);
  const decrement = () => setCount((c) => c - step);
  return { count, increment, decrement };
}

function UseCounterHookExample() {
  const { count, increment, decrement } = useCounter();
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

test('exposes the count and increment/decrement functions', async () => {
  render(<UseCounterHookExample />);
  const increment = screen.getByRole('button', { name: /increment/i });
  const decrement = screen.getByRole('button', { name: /decrement/i });
  const message = screen.getByText(/current count/i);

  expect(message).toHaveTextContent('Current count: 0');
  await userEvent.click(increment);
  expect(message).toHaveTextContent('Current count: 1');
  await userEvent.click(decrement);
  expect(message).toHaveTextContent('Current count: 0');
});
