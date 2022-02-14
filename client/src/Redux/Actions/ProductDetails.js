export const ProductData = (data) => {
    return (dispatch) => {
        dispatch({
            type:'GET_PRODUCTDETAILS',
            payload: data
        })
    }
}