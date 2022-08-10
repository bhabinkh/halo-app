export const validEmail = (email: string) => {
    if (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    } else return false
}
export const validPassword = (password: string) => {
    if (password) {
        var re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[\w\S+]{8,24}$/
        return re.test(password)
    } else return false
}