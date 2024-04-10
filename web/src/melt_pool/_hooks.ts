/**
 * _hooks.ts
 * React hooks related to melt pool state
 */

// Node Modules
import { useCallback } from "react";

// Actions
import {
  fetchProcessParameters,
  ProcessParametersInitialState,
} from "melt_pool/processParametersSlice";
import { fetchRecords, RecordsSliceInitialState } from "melt_pool/recordsSlice";

// Enums
import { Status } from "enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

// Types
import { MeltPoolFilterset } from "./_types";

type UseRecords = [
  RecordsSliceInitialState,
  (filterset: MeltPoolFilterset) => void,
];

type UseProcessParameters = [
  ProcessParametersInitialState,
  (material: string) => void,
];

/**
 * @description Hook to manage melt pool process parameters by material store.
 * @returns [state, getProcessParameters]
 */
export const useProcessParameters = (): UseProcessParameters => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.meltPoolProcessParameters);

  const getProcessParameters = useCallback(
    (material: string) => {
      if (state.status !== Status.Loading) {
        dispatch(fetchProcessParameters(material));
      }
    },
    [dispatch, state.status],
  );

  return [state, getProcessParameters];
};

/**
 * @description Hook to manage melt pool records store.
 * @returns [state, getRecords]
 */
export const useRecords = (): UseRecords => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.meltPoolRecords);

  const getRecords = useCallback(
    (filterset: MeltPoolFilterset) => {
      if (state.status !== Status.Loading) {
        dispatch(fetchRecords(filterset));
      }
    },
    [dispatch, state.status],
  );

  return [state, getRecords];
};
