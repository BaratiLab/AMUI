/**
 * Surrogate.tsx
 * test page for surrogate model
 */

// Node Modules
import { FC } from 'react';

// Actions
import { fetchSimulation } from 'surrogate/simulationSlice';

// Hooks
import { useAppDispatch } from 'hooks';

const Surrogate: FC = () => {
  // Hooks
  const dispatch = useAppDispatch();

  // Callbacks
  const handleClick = () => {
    dispatch(fetchSimulation({
      velocity: 400,
      power: 100,
      simulation_id: 0,
    }));
  };

  return (
    <button onClick={handleClick}>Surrogate</button>
  )
};

export default Surrogate
