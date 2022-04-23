const Reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            }
        case "DELETE_USER":
            return {
                ...state,
                user: null
            }
        case "CHANGE_PROFILE_IMG":
            return {
                ...state,
                user: {
                    ...state.user,
                    idOrUrlOfProfilePicture: action.payload
                }
            }
        case "CHANGE_COVER_IMG":
            return {
                ...state,
                user: {
                    ...state.user,
                    idOrUrlOfCoverPicture: action.payload
                }
            }
        case "SET_COLORS":
            return {
                ...state,
                backgroundColor1: action.payload.backgroundColor1,
                backgroundColor2: action.payload.backgroundColor2,
                backgroundColor3: action.payload.backgroundColor3,
                backgroundColor4: action.payload.backgroundColor4
            }
        case "SET_ONLINE_FRIENDS":
            return {
                ...state,
                onlineFriends: action.payload
            }
        case "SET_SOCKET":
            return {
                ...state,
                socket: action.payload
            }
        case "SET_NUMBER_UNREADED_MESSAGES":
            return {
                ...state,
                numberOfNewMessages: action.payload
            }
        default:
            return state;
    }
}

export default Reducer