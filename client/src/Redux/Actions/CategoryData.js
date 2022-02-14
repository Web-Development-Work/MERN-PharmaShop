export const CategoryData = (data, history) => {
    return (dispatch) => {
        dispatch({
            type:'GET_CATEGORYDATA',
            payload: data
        })
        history('/admin/SubCategory')
    }
}