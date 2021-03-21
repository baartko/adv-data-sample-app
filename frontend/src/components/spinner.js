import React from 'react'
import PropTypes from 'prop-types'

const DEFAULT_SIZE = 66
const STROKE_BIG = 6
const STROKE_SMALL = 4

/**
 * Spinner component
 *
 * @param {int} [size]
 * @returns {React.Component}
 */
function Spinner ({ size }) {
  const isBig = size >= DEFAULT_SIZE

  const length = `${size}px`
  const viewBox = `0 0 ${size} ${size}`
  const stroke = isBig ? STROKE_BIG : STROKE_SMALL
  const circle = String(size / 2)
  const radius = (size - stroke) / 2

  return (
    <svg
      width={length}
      height={length}
      viewBox={viewBox}
      xmlns='http://www.w3.org/2000/svg'
      className='spinner'
      style={{ marginTop: -(DEFAULT_SIZE/2) }}
    >
      <circle
        fill='none'
        strokeWidth={stroke}
        strokeLinecap='round'
        cx={circle}
        cy={circle}
        r={radius}
        className='path'
      />
    </svg>
  )
}

Spinner.propTypes = {
  size: PropTypes.number
}

Spinner.defaultProps = {
  size: DEFAULT_SIZE
}

export default Spinner
