const initialData = {
    OrderRequestData: []
}

const OrderReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'GET_ORDERREQUEST':
            return {
                ...state,
                OrderRequestData: action.payload
            }
        default:
            return state;
    }
}
export default OrderReducer