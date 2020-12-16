import {combineReducers} from 'redux'
import userReducer from './userReducer'

// untuk combine semua reducer
const allReducers = combineReducers({
    user: userReducer,
})

export default allReducers