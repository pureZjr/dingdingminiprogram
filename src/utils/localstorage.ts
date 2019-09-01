export const getItem = (key: string) => {
    return new Promise<any>(resolve => {
        wx.getStorage({
            key,
            success: res => {
                console.log('is get localstorage', res)
                resolve(res.data)
            },
            fail: () => {
                resolve('')
            },
        })
    })
}
export const setItem = (key: string, data: string) => {
    return new Promise<any>((resolve, _) => {
        wx.setStorage({
            key,
            data,
            success: res => {
                console.log('is set localstorage', res)
                resolve(res.data)
            },
            fail: () => {
                resolve('')
            },
        })
    })
}
