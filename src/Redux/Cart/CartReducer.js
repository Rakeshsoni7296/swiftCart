import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SHIPPING_INFO,
  RESET_CART,
} from "./CartTypes";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const isExist = state.cartItems.find(
        (prod) => prod.product === item.product
      );

      if (isExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((prod) =>
            prod.product === isExist.product ? item : prod
          ),
        };
      } else
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (prod) => prod.product !== action.payload
        ),
      };

    case RESET_CART:
      return {
        ...state,
        cartItems: [],
      };

    case SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    default:
      return state;
  }
};
