/**
 * _hooks.ts
 * Hooks for materials app.
 */

// Node Modules
import { useEffect } from "react";

// Actions
import { fetchMaterialList } from "./materialListSlice";

// Enums
import { Status } from "enums";

// Hooks
import { useAppDispatch, useAppSelector } from "hooks";

export const useMaterialList = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.materialList);

  useEffect(() => {
    if (state.status === Status.Idle) {
      dispatch(fetchMaterialList());
    }
  }, [dispatch, state.status]);

  return [state];
};
