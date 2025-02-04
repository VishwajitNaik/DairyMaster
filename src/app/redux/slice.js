const { createSlice, nanoid } = require('@reduxjs/toolkit');

// initial state
const initialState = {
    milks: [],  // Default as empty array
  };

const slice = createSlice({
    name: 'milksSclice',
    initialState,
    reducers: {
        addUser: (state, action) => {
            console.log(action);
            
        const data = {
            id: nanoid(),
            name: action.payload.name,
        }
        state.milks.push(data);
        }
    }
    
});

export const { addmilk } = slice.actions;
export default slice.reducer;