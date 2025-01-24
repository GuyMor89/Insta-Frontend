import { RemoveScroll } from 'react-remove-scroll';
import { userActions } from '../store/actions/user.actions.js'
import { addFormikField } from '../cmps/Formik.jsx';

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';


export function LoginSignup() {

    const fullLoggedInUser = useSelector(storeState => storeState.userModule.fullLoggedInUser)
    const [currState, setCurrState] = useState('login')
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const [checkUser, setCheckUser] = useState(false)

    useEffect(() => {
        if (fullLoggedInUser) return setIsLoggedIn(true)
        const fetchLoggedInUser = async () => {
            const userIsLoggedIn = await userActions.loadLoggedInUser()
            setIsLoggedIn(!!userIsLoggedIn)
        }
        fetchLoggedInUser()
    }, [checkUser, fullLoggedInUser])

    if (isLoggedIn) return

    async function handleAuth(values) {
        if (currState === 'login') await userActions.loginUser(values)
        if (currState === 'signup') await userActions.signupUser(values)
        setCheckUser(!checkUser)
    }

    function handleChooserBtn() {
        if (currState === 'login') return <button onClick={() => setCurrState('signup')}>Sign up</button>
        if (currState === 'signup') return <button onClick={() => setCurrState('login')}>Log in</button>
    }

    return (
        <RemoveScroll>
            <article className="login-signup-overlay">
                <div className='login-signup-container'>
                    <div className='login-signup-contents'>
                        <span className='logo-name'>Instagram</span>
                        <div className='login-container'>
                            <Formik
                                initialValues={{
                                    username: '',
                                    password: '',
                                    ...(currState === 'signup' && { fullname: '' })
                                }}
                                // validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    handleAuth(values)
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        {addFormikField(errors, touched, { fieldName: 'username', className: 'username-input', type: 'text', placeholder: 'Username', focus: 'autoFocus' })}
                                        {currState === 'signup' && addFormikField(errors, touched, { fieldName: 'fullname', className: 'fullname-input', type: 'text', placeholder: 'Full name' })}
                                        {addFormikField(errors, touched, { fieldName: 'password', className: 'password-input', type: 'password', placeholder: 'Password' })}
                                        <button>{currState === 'login' ? 'Log in' : 'Sign up'}</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                    </div>
                    <div className='login-or-signup-chooser-container'>
                        <div className='login-or-signup-chooser'>
                            {currState === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}
                            {handleChooserBtn()}
                        </div>
                    </div>
                </div>
            </article>
        </RemoveScroll>
    )
}