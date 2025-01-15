import { Field } from "formik"


export function addFormikField(errors, touched, options) {
    const { fieldName, className, type, placeholder, focus } = options

    return (
        <div
            className={`${className} ${(errors[fieldName] && touched[fieldName]) ? 'error-input' : ''}`}
            data-error={(errors[fieldName] && touched[fieldName]) ? errors[fieldName] : ''}
        >
            <Field
                as={type === 'textarea' && type}
                type={type}
                name={fieldName}
                placeholder={placeholder}
                required
                autoFocus={focus === 'autoFocus'}
            />
        </div>
    )
}