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
      // values
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
    const { children, onSubmit } = this.props
    const { page } = this.state
   // const isLastPage = page === React.Children.count(children) - 1
    //console.log(page);
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
                <button type="button" onClick={this.previous}>
                  « Previous
                </button>

              )}
              {page === 1 && (
                <button type="submit" disabled={submitting}>
                  Submit
                </button>
              )}

          
              {page === 0 && <button type="submit">Next »</button>}
              {isLastPage && (
                <button onClick={reset} type="submit">
                  Home
                </button>
              )}

              {isLastPage && (<pre>{JSON.stringify(values, 0, 2)}</pre>)}

            </div>


            <pre>{JSON.stringify(values, 0, 2)}</pre>

          </form>
        )}
      </Form>
    )
  }
}
