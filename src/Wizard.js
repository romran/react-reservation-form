import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'

export default class Wizard extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }
  static Page = ({ children }) => children

  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      values: props.initialValues || {},
      reset: {}
    }
  }
  next = values =>
    this.setState(state => ({
      page: Math.min(state.page + 1, this.props.children.length - 1),
    }))

  previous = () =>
    this.setState(state => ({
      page: Math.max(state.page - 1, 0)
    }))

  last = () =>
    this.setState(state => ({
      page: Math.max(state.page + 1, 0)
    }))


  first = () =>
    this.setState(state => ({
      page: Math.max(state.page - 2, 0),
    }))

 /**
 * NOTE: Both validate and handleSubmit switching are implemented
 * here because 🏁 Redux Final Form does not accept changes to those
 * functions once the form has been defined.
 */

  validate = values => {
    const activePage = React.Children.toArray(this.props.children)[
      this.state.page
    ]
    return activePage.props.validate ? activePage.props.validate(values) : {}
  }

  handleSubmit = values => {
    const { onSubmit } = this.props
    const { page } = this.state
      if (page === 1) {
      this.last();
      return onSubmit(values)
    }
    else if (page === 2) {
      this.first();
    }
    else {
      this.next(values)
    }
  }

  render() {
    const { children } = this.props
    const { page, values } = this.state
    const activePage = React.Children.toArray(children)[page]
    const isLastPage = page === React.Children.count(children) - 1
    return (
      <div className='form-wrapper'>
        <Form
          initialValues={values}
          validate={this.validate}
          onSubmit={this.handleSubmit}
        >
          {({ handleSubmit, reset, submitting, values }) => (
            <form onSubmit={handleSubmit}
            >
              {activePage}
              <div className="buttons">
                {page === 1 && (
                  <div className="res-details" >

                    <div className="res-details-block">
                      <p>Date</p>
                      <p>{values.date}</p>
                    </div>

                    <div className="res-details-block">
                      <p>Time</p>
                      <p>{values.time}</p>
                    </div>

                    <div className="res-details-block icon">
                      <p>Party of</p>
                      <p>{values.partySize}</p>
                    </div>

                    <button type="button" className="edit-button" onClick={this.previous}>
                      Edit
                </button>
                  </div>

                )}
                {page === 1 && (
                  <button type="submit" className="check-button confirm" disabled={submitting}>
                    Confirm Reservation
                </button>
                )}

                {page === 0 && <button className='check-button' type="submit">Check Availability</button>}
                {isLastPage && (

                  <div>
                    <div className="res-details home" >

                      <div className="res-details-block icon">
                        <p>Party of</p>
                        <p>{values.partySize}</p>
                      </div>

                      <div className="res-details-block">
                        <p>Date</p>
                        <p>{values.date}</p>
                      </div>

                      <div className="res-details-block">
                        <p>Time</p>
                        <p>{values.time}</p>
                      </div>

                    </div>

                    <div className="res-details-info"><p>Your information:</p></div>

                    <div className="res-details confirm" >
                      <div className="res-details-block">
                        <p>{values.firstName} {values.lastName}</p>
                        <p>{values.email}</p>
                        <p>{values.phoneNumber}</p>
                      </div>

                      <div className="res-details-block">
                        <p>Special Requirements:</p>
                        <p>{values.specialRequirements}</p>
                      </div>

                    </div>

                    <button className="check-button home" onClick={reset} type="submit">
                      Home
                </button>
                  </div>
                )}
              </div>

            </form>
          )}
        </Form>
      </div>
    )
  }
}
