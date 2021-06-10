// import { makeMutations } from '../utilities/store'

export const sortEnum = {
    NAME: 'name',
    SIZE: 'size',
    TIME: 'time',
}
export const directionsEnum = {
    ASCENDING: 'asc',
    DESCENDING: 'desc',
    EMPTY: '',
}

const initialState = {
    sortType: sortEnum[0],
    sort: {
        [sortEnum.NAME]: { direction: 'asc' },
        [sortEnum.SIZE]: { direction: '' },
        [sortEnum.TIME]: { direction: '' },
    },
}
export default {
    state: initialState,
    // mutations: {
    //     ...makeMutations(initialState),
    //     sortDirection(state, payload) {
    //         state.sort[payload.type] = payload.direction
    //     }
    // },
    // actions: {
    //     sortFiles(context, type) {
    //         const direction = sortEnum[type] || 'desc'
    //         context.commit('sortDirection', { type, direction })
    //         context.commit('sortType', type)

    //         const sortMode = {
    //             name: 'name',
    //             size: 'data.size',
    //             time: 'data.mtime'
    //         }

    //         context.state.sort.forEach((sort, sortTypeKey) => {
    //             if (sortTypeKey !== type) {
    //                 context.commit('sortDirection', { type, direction: directionsEnum.EMPTY })
    //             }
    //         })

    //         context.dispatch('browser/sortFiles', { sort: sortMode[type], direction })
    //     }
    // }
}
