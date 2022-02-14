const initialData = {
    ProductData: ''
}

const ProductReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'GET_PRODUCTDETAILS':
            return {
                ...state,
                ProductData: action.payload
            }
        default:
            return state;
    }
}
export default ProductReducer