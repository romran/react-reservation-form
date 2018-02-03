import React from 'react'
import { render } from 'react-dom'
import { Field } from 'react-final-form'
import Wizard from './Wizard'
import today from './dateConverter';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

const size = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, '>30']

let orders = [];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const onSubmit = async values => {
    await sleep(300)
    console.log(JSON.stringify(values, 0, 2))
    orders.push({ date: values.date, time: values.time })
    //console.log(orders)
}

const Error = ({ name }) => (
    <Field
        name={name}
        subscribe={{ touched: true, error: true, }}
        render={({ meta: { touched, error, dirty } }) =>
           touched && error ? <span>{error}</span> : null
        }
    />
)

const PartyError = ({ name }) => (
    <Field
        name={name}
        subscribe={{ touched: true, error: true, dirty:true }}
        render={({ meta: { touched, error, dirty } }) =>
           dirty && error ? <span>{error}</span> : null
        }
    />
)

const normalizePhone = value => {
    if (!value) return value
    const onlyNums = value.replace(/[^\d]/g, '')
    if (onlyNums.length <= 3) return onlyNums
    if (onlyNums.length <= 7)
        return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3)}`
    return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)} ${onlyNums.slice(
        6,
        10
    )}`
}


const required = value => (value ? undefined : 'Required')

const App = () => (
    <div>
        <h2>Wizard Form</h2>
        <Wizard
            initialValues={{ date: today, partySize: 2, phoneType: 'Cell', notification: 'Text' }}
            onSubmit={onSubmit}>
            <Wizard.Page

                validate={values => {
                    const errors = {}
                    if ((orders.find(o => o.date === values.date)) && (orders.find(o => o.time === values.time))) {
                        errors.date = 'Date already taken'
                        errors.time = 'Time already taken'
                    }
                    if (values.partySize === '>30') {
                        errors.partySize = 'Contact'
                    }
                    return errors
                }}

            >
                <div>
                    <label>Party size</label>
                    <Field name="partySize" component="select">
                        {size.map(val => (
                            <option value={val} key={val}>
                                {val}
                            </option>
                        ))}
                    </Field>
                    <PartyError name="partySize" />
                </div>

                <div>
                    <label>Date</label>
                    <Field
                        name="date"
                        component="input"
                        type="date"
                        min={today}
                        // placeholder="First Name"
                        validate={required}
                    />
                    <Error name="date" />
                </div>

                <div>
                    <label>Time</label>
                    <Field
                        name="time"
                        component="input"
                        type="time"
                        // placeholder="First Name"
                        validate={required}
                    />
                    <Error name="time" />
                </div>

            </Wizard.Page>
            <Wizard.Page
                validate={values => {
                    const errors = {}
                    if (!values.email) {
                        errors.email = 'Required'
                    }
                    /*   if (!values.favoriteColor) {
                          errors.favoriteColor = 'Required'
                      } */
                    return errors
                }}
            >
                <div>
                    <label>First Name</label>
                    <Field
                        name="firstName"
                        component="input"
                        type="text"
                        placeholder="First Name"
                        validate={required}
                    />
                    <Error name="firstName" />
                </div>
                <div>
                    <label>Last Name</label>
                    <Field
                        name="lastName"
                        component="input"
                        type="text"
                        placeholder="Last Name"
                        validate={required}
                    />
                    <Error name="lastName" />
                </div>

                <div>
                    <label>Email</label>
                    <Field
                        name="email"
                        component="input"
                        type="email"
                        placeholder="Email"
                    />
                    <Error name="email" />
                </div>
                <div>
                    <label>Phone Type</label>
                    <Field name="phoneType" component="select">
                        <option value="Cell">Cell</option>
                        <option value="Mobile">Mobile</option>
                    </Field>
                    <Error name="phoneType" />
                </div>

                <div>
                    <label>Phone Number</label>
                    <Field
                        name="phoneNumber"
                        component="input"
                        type="text"
                        parse={normalizePhone}
                        placeholder="(000) 000 0000"
                        validate={required}
                    />
                    <Error name="phoneNumber" />
                </div>

                <div>
                    <label>Notification</label>
                    <Field name="notification" component="select">
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                    </Field>
                    <Error name="notification" />
                </div>

                <div>
                    <label>Special Requirements</label>
                    <Field
                        name="specialRequirements"
                        component="input"
                        type="textField"
                    />
                </div>

            </Wizard.Page>


            <Wizard.Page>
                <div>
                    <h1>Results</h1>
                </div>
            </Wizard.Page>



        </Wizard>
    </div>
)

render(<App />, document.getElementById("root"));

registerServiceWorker();


