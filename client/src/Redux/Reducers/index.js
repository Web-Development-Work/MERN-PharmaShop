import { combineReducers } from "redux";
import CategoryData from "./CategoryReducer";
import OrderReducer from "./OrderReducer";
import ProductReducer from "./ProductReducer";

const rootReducer = combineReducers(
    {CategoryData , OrderReducer , ProductReducer}
)

export default rootReducer