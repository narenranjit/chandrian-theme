import { useState, useEffect } from 'react';
import useInterval from './useInterval';

// return Type of useCOunter
type ReturnValueUseCounter = [
  number, // value
  {
    inc(step?: number): void;
    dec(step?: number): void;
    get(): number;
    set(count: number): void;
    reset(count?: number): void;
  }
];

interface ICounter {
  initialCount?: number;
  onReset?: () => void;
  onAfterReset?: (initialCount: number) => void;
  options?: {
    autoIncrementCounter: boolean;
  };
}

let renderCounter = 0;

const defaultOptions = {
  autoIncrementCounter: true,
};

const useCounter = ({
  initialCount = 0,
  onReset,
  onAfterReset,
  options = defaultOptions,
}: ICounter): ReturnValueUseCounter => {
  const [count, setCount] = useState(initialCount);
  const [state, setState] = useState({
    resetTriggered: false,
  });
  // Event handlers
  const inc = (step: number = 1) => {
    setCount(count + step);
  };
  const dec = (step: number = 1) => {
    setCount(count - step);
  };

  const get = () => count;

  const reset = (count: number = initialCount) => {
    setCount(count);
    setState({ ...state, resetTriggered: true });

    if (onReset) {
      onReset();
    }
  };

  // Side effects
  useEffect(() => {
    if (state.resetTriggered && onAfterReset) {
      setState({ ...state, resetTriggered: false });
      onAfterReset(initialCount);
    }
  }, [count]);

  options.autoIncrementCounter &&
    useInterval(() => setCount(count => count + 1), 1000);

  renderCounter++;

  console.info('render counter', renderCounter);

  return [count, { inc, dec, get, set: setCount, reset }];
};

export default useCounter;
