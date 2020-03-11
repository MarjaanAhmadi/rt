//action for showing loading
export const showLoading = loading => ({
    type: 'SHOW_LOADING',
    loading
})


//actions for changing language
export const changeLanguage = language => ({
    type: 'CHANGE_LANGUAGE',
    language
})

//action to set showing side bar nav or not
export const setShowNav = showNav => ({
    type: 'SET_SHOWNAV',
    showNav
})

//action to set token
export const setToken = token => ({
    type: 'SET_TOKEN',
    token
})
//action to set user
export const setUser = user => ({
    type: 'SET_USER',
    user
})
//action to set weeks
export const setBusinessWeeks = weeks => ({
    type: 'SET_WEEKS',
    weeks
})
//action to set conditionalList
export const setConditionalLists = conditions => ({
    type: 'SET_CONDITIONAL_LIST',
    conditions
})
//action to set users
export const setUsers = users => ({
    type: 'SET_USERS',
    users
})
//action to set users
export const setEndpoints = endpoints => ({
    type: 'SET_ENDPOINTS',
    endpoints
})
//action to set users
export const setCdrs = cdrs => ({
    type: 'SET_CDRS',
    cdrs
})
//action to set users
export const setExtensions = extensions => ({
    type: 'SET_EXTENSIONS',
    extensions
})
//action to set users
export const setCalenders = calenders => ({
    type: 'SET_CALENDERS',
    calenders
})
//action to set users
export const setGeneralResources = generalResources => ({
    type: 'SET_GENERAL_RESOURCES',
    generalResources
})
//action to set users
export const setDestinations = destinations => ({
    type: 'SET_DESTINATIONS',
    destinations
})
