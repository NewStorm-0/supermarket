import {defineStore} from 'pinia'
import {ref} from "vue";

export const useLoginStore = defineStore('user', () => {
    const login = ref({
        account: null,
        level: null,
        login: false
    })

    function setLogin(account, level, isLogin) {
        console.log("setLogin: {\n\taccount: " + account + "\n\tlevel: " + level +
            "\n\tlogin: " + login + "}")
        login.value.account = account
        login.value.level = level
        login.value.login = isLogin
    }

    return {login, setLogin}
})
