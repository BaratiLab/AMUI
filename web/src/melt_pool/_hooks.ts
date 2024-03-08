/**
 * _hooks.ts
 * React hooks related to melt pool state
 */

// Node Modules
import { useCallback, useEffect } from 'react';

// Actions
import { fetchProcessParameters } from 'melt_pool/processParametersSlice';
import { fetchRecords } from 'melt_pool/recordsSlice';

// Enums
import { Status } from 'enums';

// Hooks
import { useAppDispatch, useAppSelector } from 'hooks';

// Types
import { MeltPoolFilterset, RecordsSliceInitialState } from './_types';

type UseRecords = [
  RecordsSliceInitialState,
  (filterset: MeltPoolFilterset) => void
];

/**
 * @description Hook to manage melt pool process parameters store. 
 * @returns [state]
 */
export const useProcessParameters = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.meltPoolProcessParameters);

  useEffect(() => {
    // Retreives available process parameters from backend.
    if (state.status === Status.Idle) {
      dispatch(fetchProcessParameters());
    }
  }, [dispatch, state.status]);

  return [state];
};

/**
 * @description Hook to manage melt pool records store.
 * @returns [state, getRecords]
 */
export const useRecords = (): UseRecords => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.meltPoolRecords);

  const getRecords = useCallback(
    (filterset: MeltPoolFilterset) => {
      if (state.status !== Status.Loading) {
        dispatch(fetchRecords(filterset))
      }
    }, [dispatch, state.status]
  );

  return [state, getRecords];
};
