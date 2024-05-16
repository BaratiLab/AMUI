/**
 * hooks.ts
 * React hooks that are commonly used throughout the application.
 * https://redux.js.org/usage/usage-with-typescript#define-typed-hooks
 */

// Node Modules
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Types
import type { RootState, AppDispatch } from "store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
