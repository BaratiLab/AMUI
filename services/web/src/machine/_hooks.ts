/**
 * _hooks.ts
 * Hooks for machine app.
 */

// Node Modules
import { useEffect } from "react";

// Actions
import { fetchSpecifications } from "./specificationsSlice";

// Enums
import { Status } from "enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

export const useSpecifications = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.machineSpecifications);

  useEffect(() => {
    if (state.status === Status.Idle) {
      dispatch(fetchSpecifications());
    }
  }, [dispatch, state.status]);

  return [state];
};
