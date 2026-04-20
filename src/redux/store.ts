import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import quickViewReducer from "./slices/quickView-slice";
import cartReducer from "./slices/cart-slice";
import wishlistReducer from "./slices/wishlist-slice";
import productDetailsReducer from "./slices/product-details";
import authReducer from "./slices/authSlice";
import addressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";

import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cartReducer'],
  blacklist: [],
};

const rootReducer = combineReducers({
  quickViewReducer,
  cartReducer,
  wishlistReducer,
  productDetailsReducer,
  auth: authReducer,
  address: addressReducer,
  order: orderReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
