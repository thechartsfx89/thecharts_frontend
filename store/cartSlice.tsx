import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 🧩 Define types
export interface CartItem {
    id: string;
    name: string;
    course_price: number;
    image?: string;
    quantity: number;
}

export interface CartState {
    cartItems: CartItem[];
    totalQuantity: number;
    totalAmount: number;
}

// 🗃️ Load from localStorage helper
const loadCartFromLocalStorage = (): CartState => {
    if (typeof window === 'undefined') return { cartItems: [], totalQuantity: 0, totalAmount: 0 };

    try {
        const stored = localStorage.getItem('cart');
        if (stored) return JSON.parse(stored) as CartState;
    } catch (err) {
        console.error('Error loading cart from localStorage:', err);
    }

    return { cartItems: [], totalQuantity: 0, totalAmount: 0 };
};

// 💾 Save to localStorage helper
const saveCartToLocalStorage = (state: CartState) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state));
    }
};

// ⚙️ Initial State
const initialState: CartState = loadCartFromLocalStorage();

// 🧱 Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, { payload }: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const existingItem = state.cartItems.find(item => item.id === payload.id);

            if (existingItem) {
                return;
            }

            state.cartItems.push({ ...payload, quantity: 1 });

            state.totalQuantity = state.cartItems.length;
            state.totalAmount = state.cartItems.reduce(
                (sum, item: any) => sum + item.course_price * item.quantity,
                0
            );

            saveCartToLocalStorage(state);
        },

        // Redux slice
        removePurchasedItems: (state, { payload }: PayloadAction<string[]>) => {
            // payload is an array of purchased item IDs
            state.cartItems = state.cartItems.filter(item => !payload.includes(item.id));

            // recalculate total quantity and total amount
            state.totalQuantity = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.course_price * item.quantity, 0);

            saveCartToLocalStorage(state);
        },

        removeFromCart: (state, { payload }: PayloadAction<string>) => {
            const itemIndex = state.cartItems.findIndex(item => item.id === payload);

            if (itemIndex !== -1) {
                const item = state.cartItems[itemIndex];
                state.totalQuantity -= item.quantity;
                state.cartItems.splice(itemIndex, 1);
            }

            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.course_price * item.quantity, 0);
            saveCartToLocalStorage(state);
        },

        decreaseQuantity: (state, { payload }: PayloadAction<string>) => {
            const item = state.cartItems.find(item => item.id === payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                state.totalQuantity -= 1;
            } else {
                state.cartItems = state.cartItems.filter(item => item.id !== payload);
            }

            state.totalAmount = state.cartItems.reduce((sum, item) => sum + item.course_price * item.quantity, 0);
            saveCartToLocalStorage(state);
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
            saveCartToLocalStorage(state);
        },
    },
});

// 🧾 Export actions & reducer
export const { addToCart, removeFromCart, removePurchasedItems, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
