import Taro, { useState } from '@tarojs/taro'
import { View, Text, Image, Input, Button } from '@tarojs/components'
import { AtMessage, AtIcon } from 'taro-ui'
import '@tarojs/async-await'

import {
    getVerify as getVerifyApi,
    userLogin,
    getCustomerInfo,
    getImageVerifyCode,
    fastLogin,
} from '@server/api/users'
import { isPhone } from '@utils/regExp'
import { setItem, getItem } from '@utils/localstorage'
import UserStore from '@store/UserStore'
import styles from './index.module.scss'

function Login() {
    // 手机号码
    const [phone, setPhone] = Taro.useState<string>('')
    // 验证码图片地址
    const [verifyPngUrl, setverifyPngUrl] = useState<string>('')
    // 短信验证码
    const [verifyFromSMS, setVerifyFromSMS] = Taro.useState<string>('')
    // 图片验证码
    const [verifyNumFromPng, setVerifyNumFromPng] = Taro.useState<string>('')
    const [verifyId, setVerifyId] = Taro.useState<string>('')

    Taro.useEffect(() => {
        setPhonInStorage()
    }, [])

    const setPhonInStorage = async () => {
        const val: string = await getItem('phone')
        setPhone(val || '')
    }

    // 登录
    const onLogin = async () => {
        const data = {
            phone,
            verify: verifyFromSMS,
        }
        const res: any = await userLogin(data)
        if (!!res.token) {
            setItem('token', res.token)
            setItem('phone', phone)
            const userInfo = await getCustomerInfo({})
            UserStore.setUserInfo(userInfo)
            Taro.navigateTo({
                url: '/container/pages/home/index',
            })
        } else {
            return Taro.atMessage({
                message: '验证码错误或过期请重新输入',
                type: 'warning',
            })
        }
    }
    // 手机号码
    const handlePhoneChange = (val: string) => {
        setPhone(val)
    }
    // 短信验证码
    const handleVerifyChange = (val: string) => {
        setVerifyFromSMS(val)
    }
    // 图片验证码
    const setPngVerifyCode = (val: string) => {
        setVerifyNumFromPng(val)
    }
    // 提交图片验证码，获取短信验证码
    const submitVerifyPngNum = async () => {
        const data = {
            phone,
            imageVerifyCode: verifyNumFromPng,
            verifyId,
        }
        const res = await getVerifyApi(data)
        setverifyPngUrl('')
        if (res.verifyStatus === 1) {
            Taro.atMessage({
                message: '短信发送成功,请在手机上查收',
                type: 'success',
            })
        } else {
            Taro.atMessage({
                message: '验证码错误，请重新获取',
                type: 'error',
            })
        }
    }
    // 获取验证码
    const getVerify = async () => {
        // 校验手机号码
        if (!isPhone(phone)) {
            Taro.atMessage({
                message: '请输入正确的手机号码',
                type: 'warning',
            })
            return false
        }
        const res = await getImageVerifyCode({})
        setverifyPngUrl(res.url)
        setVerifyId(res.verifyId)
    }
    // 重新获取图片验证码
    const reload = async () => {
        const res = await getImageVerifyCode({})
        setverifyPngUrl(res.url)
        setVerifyId(res.verifyId)
    }
    // 一键登录
    const onFastLogin = () => {
        fastLogin({ phone }).then(async res => {
            if (!!res.token) {
                await setItem('token', res.token)
                const userInfo = await getCustomerInfo({})
                console.log(userInfo)
                UserStore.setUserInfo(userInfo)
                Taro.navigateTo({
                    url: '/container/pages/home/index',
                })
            } else {
                return Taro.atMessage({
                    message: '不存在记录，请用短信方式登录',
                    type: 'warning',
                })
            }
        })
    }
    return (
        <View className={styles.container}>
            <Image
                className={styles.bg}
                src={require('@assets/login/login-bg.jpg')}
                lazyLoad
            />
            <View className={styles.shadow}>
                <View className={styles['input-container']}>
                    <Image
                        src={require('@assets/login/cell.png')}
                        className={styles['input-icon']}
                    />
                    <Input
                        className={styles.input}
                        value={phone}
                        type="text"
                        placeholder="输入手机号"
                        onInput={e => handlePhoneChange(e.detail.value)}
                    />
                </View>
                <View className={styles['input-container']}>
                    <Image
                        src={require('@assets/login/password.png')}
                        className={styles['input-icon']}
                    />
                    <Input
                        className={styles.input}
                        value={verifyFromSMS}
                        type="text"
                        placeholder="输入四位手机验证码"
                        onInput={e => handleVerifyChange(e.detail.value)}
                    />
                    <Text className={styles['get-verify']} onClick={getVerify}>
                        验证码
                    </Text>
                </View>
                <View className={styles.btns}>
                    <Text
                        className={styles['fast-login']}
                        onClick={onFastLogin}
                    >
                        一键登录
                    </Text>
                    <Button
                        className={styles.button}
                        onClick={onLogin}
                        disabled={!verifyFromSMS}
                        size="mini"
                    >
                        提交
                    </Button>
                </View>
                <View
                    className={styles['verify-png-container']}
                    style={{
                        display: `${!!verifyPngUrl ? 'flex' : 'none'}`,
                    }}
                >
                    <View className={styles['verify-png-box']}>
                        <AtIcon
                            className={styles.reload}
                            value="reload"
                            size="30"
                            color="#ebcb22"
                            onClick={reload}
                        />
                        <Image className={styles['img']} src={verifyPngUrl} />
                    </View>
                    <View className={styles['verify-png-input-container']}>
                        <Input
                            className={styles['verify-png-input']}
                            type="text"
                            value={verifyNumFromPng}
                            onInput={e => setPngVerifyCode(e.detail.value)}
                        />
                        <View className={styles['verify-png-sure']}>
                            <AtIcon
                                value="check"
                                size="28"
                                color="rgba(255, 255, 255, 0.8)"
                                onClick={submitVerifyPngNum}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <AtMessage />
        </View>
    )
}
export default Login
