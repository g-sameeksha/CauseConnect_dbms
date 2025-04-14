import React from 'react'

const Error = ({error}) => {
  return (
    <div className="alert alert-danger m-3 text-center" role="alert">
        {error}
  </div>
  )
}

export default Error