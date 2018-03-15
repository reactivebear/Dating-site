import * as config from '../config'
import { setAlert } from 'actions'
import store from 'store'
import 'whatwg-fetch'

const responseHandler = (response) => {
    let promise = response.json()
    let ok = response.ok
    
    promise.then(response => {
        if (response.validate) {
            for (let k in response.validate) {
                for (let j in response.validate[k]) {
                    store.dispatch(setAlert(response.validate[k][j], 'error'))
                }
            }
        }

        if (response.message && (! response.validate || response.validate == null)) {
            store.dispatch(setAlert(response.message, ok ? 'success' : 'error'))
        }

        if (response.errors) {
            for (let k in response.errors) {
                for (let j in response.errors[k]) {
                    store.dispatch(setAlert(response.errors[k][j], 'error'))
                }
            }
        }
    })
    return promise;
}

export default {
    login(data) {
        return fetch(config.API_URL + 'login', {
            method: 'post',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getFullInfo(token) {
        return fetch(config.API_URL + 'user/profile', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getUserInfo(token) {
        return fetch(config.API_URL + 'user', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getMembers(token) {
        return fetch(config.API_URL + 'user/members', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getMemberInfo(token, id) {
        return fetch(config.API_URL + 'user/member/' + id, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getNewMembers(token) {
        return fetch(config.API_URL + 'user/members/new', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getPopularMembers(token) {
        return fetch(config.API_URL + 'user/members/popular', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getFavoriteMembers(token) {
        return fetch(config.API_URL + 'user/members/favorite', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    addToFavorite(id, token) {
        return fetch(config.API_URL + 'user/members/favorite/' + id + '/add', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    removeFromFavorite(id, token) {
        return fetch(config.API_URL + 'user/members/favorite/' + id + '/remove', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    addViewed(id, token) {
        return fetch(config.API_URL + 'user/view/' + id, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    setPlan(plan_id, value_id, token) {
        const data = {
            membership_id: plan_id,
            value_id: value_id
        }
        return fetch(config.API_URL + 'client/membership/update', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getGallery(token) {
        return fetch(config.API_URL + 'gallery', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
                //'Accept': 'application/json',
                //'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getVideo(token) {
        return fetch(config.API_URL + 'girl/video', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
                //'Accept': 'application/json',
                //'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getMemberships() {
        return fetch(config.API_URL + 'memberships/active', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    updateUserProfile(data, token) {
        return fetch(config.API_URL + 'user/profile', {
            method: 'put',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    activateUser(hash) {
        return fetch(config.API_URL + 'activate/' + hash, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    sendRecovery(data) {
        return fetch(config.API_URL + 'recovery', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    updatePassword(data, hash) {
        return fetch(config.API_URL + 'password/' + hash, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    changePassword(data, token) {
        return fetch(config.API_URL + 'password/update', {
            method: 'put',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpStart(data) {
        return fetch(config.API_URL + 'signup/start', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpOne(data) {
        return fetch(config.API_URL + 'signup/' + data.route + '/step/one', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpTwo(data) {
        let formData = new FormData()
        formData.append('avatar', data.avatar)
        formData.append('height', data.height)
        formData.append('width', data.width)
        formData.append('x', data.x)
        formData.append('y', data.y)
        formData.append('remember_token', data.remember_token)

        return fetch(config.API_URL + 'signup/client/step/two', {
            method: 'post',
            /*headers: {
                //'Content-Type': 'multipart/form-data'
            },*/
            body: formData
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    addToGallery(data, token) {
        let formData = new FormData()
        formData.append('image', data)

        return fetch(config.API_URL + 'gallery/add', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            body: formData
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    updateAvatar(data, token) {
        return fetch(config.API_URL + 'gallery/avatar', {
            method: 'put',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    removePhotos(data, token) {
        return fetch(config.API_URL + 'gallery/remove', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    toggleActive(data, url, token) {
        return fetch(config.API_URL + 'gallery/' + url, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    togglePrivate(data, url, token) {
        return fetch(config.API_URL + 'gallery/' + url, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpTwoGirl(data) {
        return fetch(config.API_URL + 'signup/girl/step/two', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpThree(data) {
        return fetch(config.API_URL + 'signup/last', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpThreeGirl(data) {
        return fetch(config.API_URL + 'signup/girl/step/four', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    signUpFinish(data) {
        return fetch(config.API_URL + 'signup/finish', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getOptions(type) {
        return fetch(config.API_URL + type, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getSearchProfileId(profile_id, token) {
        return fetch(config.API_URL + 'user/search/' + profile_id, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getSearch(data, token) {
        return fetch(config.API_URL + 'user/search', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    sendMessage(id, message, token) {
        const data = {
            receiver_id: id,
            original: message
        }
        return fetch(config.API_URL + 'user/message/send', {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    },

    getDialogs(token) {
        return fetch(config.API_URL + 'user/message/dialogs', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(responseHandler)
        .catch(error => console.log(error))
    }
}