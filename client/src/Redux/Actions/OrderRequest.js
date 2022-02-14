export const OrderRequestAction = (data, history) => {
    return (dispatch) => {
        dispatch({
            type:'GET_ORDERREQUEST',
            payload: data
        })
        history.push('/admin/OrderItem')
    }
}