import {ProductsState} from './';

type ProductsActionType = {type: '[Products] - ActionName'};

export const productsReducer = (
  state: ProductsState,
  action: ProductsActionType,
): ProductsState => {
  switch (action.type) {
    case '[Products] - ActionName':
      return {
        ...state,
      };

    default:
      return state;
  }
};
