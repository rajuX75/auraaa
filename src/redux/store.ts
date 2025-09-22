import { combineReducers, configureStore, Middleware, ReducersMapObject } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { apis } from './api';
import { slices } from './slice';

// Create the root reducer by combining slices and API reducers
const rootReducer = combineReducers({
  ...slices,
  ...apis.reduce((acc, api) => {
    acc[api.reducerPath] = api.reducer;
    return acc;
  }, {} as ReducersMapObject),
});

// Infer the RootState type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// Store factory function with optional preloaded state
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Customize default middleware options
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(...apis.map((api) => api.middleware as Middleware)),
    // Enable Redux DevTools in development
    devTools: process.env.NODE_ENV !== 'production',
  });
}

// Create the store instance
export const store = makeStore();

// Infer store types
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

// Typed hooks for use throughout the app
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
