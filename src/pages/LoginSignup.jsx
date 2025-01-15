import { RemoveScroll } from 'react-remove-scroll';
import { userActions } from '../store/actions/user.actions.js'
import { addFormikField } from '../cmps/Formik.jsx';

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { userService } from '../services/user.service.js';

export function LoginSignup() {

    const loggedInUser = useSelector(storeState => storeState.userModule.loggedInUser)

    useEffect(() => {
        if (!loggedInUser) userActions.loadLoggedInUser()
    }, [])

    if (loggedInUser) return

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
                                    password: ''
                                }}
                                // validationSchema={validationSchema}
                                onSubmit={(values) => {
                                    userActions.loginUser(values)
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        {addFormikField(errors, touched, { fieldName: 'username', className: 'username-input', type: 'text', placeholder: 'Username', focus: 'autoFocus' })}
                                        {addFormikField(errors, touched, { fieldName: 'password', className: 'password-input', type: 'text', placeholder: 'Password' })}
                                        <button>Log in</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                    </div>
                    <div className='login-or-signup-chooser-container'>
                        <div className='login-or-signup-chooser'>
                            Don't have an account?
                            <button>Sign up</button>
                        </div>
                    </div>
                </div>
            </article>
        </RemoveScroll>
    )
}