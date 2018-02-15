import React from 'react'
import { render } from 'react-dom'
import { Field } from 'react-final-form'
import Wizard from './Wizard'
import today from './dateConverter';
import './App.css';
import registerServiceWorker from './registerServiceWorker';

const size = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, '31+']

let orders = [];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const onSubmit = async values => {
    await sleep(300)
    console.log(JSON.stringify(values, 0, 2))
    orders.push({ date: values.date, time: values.time })
}

const Error = ({ name }) => (
    <Field
        name={name}
        subscribe={{ touched: true, error: true, }}
        render={({ meta: { touched, error, } }) =>
            touched && error ? <span className='error-span'></span> : null
        }
    />
)

const PartyError = ({ name }) => (
    <Field
        name={name}
        subscribe={{ touched: true, error: true, dirty: true }}
        render={({ meta: { touched, error, dirty } }) =>
            dirty && error ? <p className='reservation-error'><a href={"tel:" + error}>Groups larger than 30 should call at <span className='reservation-number'>{error}</span> for reservations</a></p> : null
        }
    />
)

const DateError = ({ name }) => (
    <Field
        name={name}
        subscribe={{ touched: true, error: true, }}
        render={({ meta: { touched, error, } }) =>
            touched && error ? <p className='reservation-error red'>{error}</p> : null
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
    <div className='main-form-container'>
        <div className='main-form-inner'>
            <div className='form-title'>
                <h1>Jun Park QA</h1>
                <p>2202 N Irving Street, Allentown, PA 18109</p>
                <p> PHONE: <a href="tel:(800) 201-0461">(800) 201-0461</a></p>
            </div>
            <div  >
                <Wizard
                    initialValues={{ date: today, partySize: 2, phoneType: 'Cell', notification: 'Text', time: '' }}
                    onSubmit={onSubmit}
                >
                    <Wizard.Page
                        validate={values => {
                            const errors = {}
                            if (orders.find(o => o.date === values.date) && orders.find(o => o.time === values.time)) {
                                errors.date = 'Choose another date or time.'
                            }
                            if (values.partySize === '31+') {
                                errors.partySize = '(800) 201-0461'
                            }
                            return errors
                        }}
                    >

                        <div className='form-title-inner'>
                            <h2>Make a <span>Reservation</span>!</h2>
                            <p>Select the party size, date and time for your reservation.</p>
                        </div>

                        <div className='input-wrapper'>
                            <div className='input-container'>
                                <label className="select">Party size</label>
                                <Field name="partySize" component="select" className="party-size">
                                    {size.map(val => (
                                        <option value={val} key={val}>
                                            {val}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            <div className='input-container'>
                                <label>Date</label>
                                <Field
                                    name="date"
                                    component="input"
                                    type="date"
                                    className="date"
                                    min={today}
                                />
                                <Error name="date" />
                            </div>

                            <div className='input-container'>
                                <label>Time</label>
                                <Field
                                    name="time"
                                    component="input"
                                    type="time"
                                    className="time"
                                    validate={required}
                                />
                                <Error name="time" />
                            </div>
                        </div>

                        <div className='notes'>
                            <div><PartyError name="partySize" /> <DateError name="date" /></div>
                            <p>All time is displayed in EST timezone.</p>
                        </div>

                    </Wizard.Page>
                    <Wizard.Page>

                        <div className='form-title-inner'>
                            <h2>Table <span>Avalaible</span>!</h2>
                            <p>Complete your reservation.</p>
                        </div>

                        <div className='input-wrapper names-email'>
                            <div className='input-container'>
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
                            <div className='input-container'>
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

                            <div className='input-container'>
                                <label>Email</label>
                                <Field
                                    name="email"
                                    component="input"
                                    type="email"
                                    placeholder="Email"
                                />
                                <Error name="email" />
                            </div>
                        </div>
                        <div className='input-wrapper phone-notif'>
                            <div className='input-container'>
                                <label className='select'>Phone Type</label>
                                <Field name="phoneType" component="select">
                                    <option value="Cell">Cell</option>
                                    <option value="Mobile">Mobile</option>
                                </Field>
                                <Error name="phoneType" />
                            </div>

                            <div className='input-container'>
                                <label>Phone Number</label>
                                <Field
                                    name="phoneNumber"
                                    component="input"
                                    type="tel"
                                    parse={normalizePhone}
                                    placeholder="(000) 000 0000"
                                    validate={required}
                                />
                                <Error name="phoneNumber" />
                            </div>

                            <div className='input-container'>
                                <label className='select'>Notification</label>
                                <Field name="notification" component="select">
                                    <option value="text">Text</option>
                                    <option value="email">E-mail</option>
                                </Field>
                                <Error name="notification" />
                            </div>

                            <div className='input-container'>
                                <label>Special Requirements</label>
                                <Field
                                    name="specialRequirements"
                                    component="textarea"
                                    rows="num" cols="num"
                                />
                            </div>
                        </div>

                    </Wizard.Page>


                    <Wizard.Page>
                        <div className='form-title-inner'>
                            <h2>Reservation <span>Confirmed</span>!</h2>
                            <p>Reservation Details:</p>
                        </div>
                    </Wizard.Page>
                </Wizard>
            </div>
        </div>
 
    </div>
)

render(<App />, document.getElementById("root"));

registerServiceWorker();


