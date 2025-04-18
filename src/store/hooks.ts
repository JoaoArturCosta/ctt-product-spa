import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./reducer";
import type { AppDispatch } from "./store";

// Use throughout our app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
