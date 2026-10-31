import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import cartReducer from '@/store/cartSlice';

const rootReducer = combineReducers({
    cart: cartReducer,
    themeConfig: themeConfigSlice,
});

export default configureStore({
    reducer: rootReducer,
});
// export type RootState = ReturnType<typeof store.getState>;
export type IRootState = ReturnType<typeof rootReducer>;
// export type RootState = ReturnType<typeof rootReducer.getState>;
// export type AppDispatch = typeof rootReducer.dispatch;
