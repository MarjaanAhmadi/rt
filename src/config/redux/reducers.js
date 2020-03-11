const initialState = {
    language: 'per',
    loading: false,
    showNav: true,
    token: localStorage.getItem('admin-token'),
    invoices: [],
    user: JSON.parse(localStorage.getItem('admin-user')) || { user: {} },
    weeks: [],
    conditionalList: [],
    users: [],
    endpoints: [],
    cdrs:[],
    extensions: [],
    calenders: [],
    generalResources: [],
    gateways: [],
    destinations: [],
    operators: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_LOADING': {
            return {
                ...state,
                loading: action.loading
            }
        }
        case 'CHANGE_LANGUAGE' : {
            return {
                ...state,
                language: action.language
            }
        }
        case 'SET_SHOWNAV' : {
            return {
                ...state,
                showNav: !state.showNav
            }
        }
        case 'SET_TOKEN': {
            return {
                ...state,
                token: action.token
            }
        }
        case 'SET_USER' : {
            return {
                ...state,
                user: action.user
            }
        }
        case 'SET_INVOICES' : {
            return {
                ...state,
                invoices: action.invoices
            }
        }
        case 'SET_WEEKS' : {
            return {
                ...state,
                weeks: action.weeks
            }
        }
        case 'SET_CONDITIONAL_LIST' : {
            return {
                ...state,
                conditionalList: action.conditions
            }
        }
        case 'SET_USERS' : {
            return {
                ...state,
                users: action.users
            }
        }
        case 'SET_ENDPOINTS' : {
            return {
                ...state,
                endpoints: action.endpoints
            }
        }
        case 'SET_CDRS' : {
            return {
                ...state,
                cdrs: action.cdrs
            }
        }
        case 'SET_EXTENSIONS' : {
            return {
                ...state,
                extensions: action.extensions
            }
        }
        case 'SET_CALENDERS' : {
            return {
                ...state,
                calenders: action.calenders
            }
        }
        case 'SET_GENERAL_RESOURCES' : {
            return {
                ...state,
                generalResources: action.generalResources
            }
        }
        case 'SET_GATEWAYS' : {
            return {
                ...state,
                gateways: action.gateways
            }
        }
        case 'SET_DESTINATIONS' : {
            return {
                ...state,
                destinations: action.destinations
            }
        }
        case 'SET_OPERATORS' : {
            return {
                ...state,
                operators: action.operators
            }
        }

        default:
            return state;
    }
}
export default reducer;
