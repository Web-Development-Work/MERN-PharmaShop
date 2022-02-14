const initialData = {
    CategoryData: []
}

const CategoryReducer = (state = initialData, action) => {
    switch (action.type) {
        case 'GET_CATEGORYDATA':
            return {
                ...state,
                CategoryData: action.payload

            }
        default:
            return state;
    }
}
export default CategoryReducer