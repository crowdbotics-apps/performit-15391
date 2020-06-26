import React from 'react'
import Svg, { Defs, G, Rect } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: style */

const SvgComponent = props => (
  <Svg width='100%' height='100%' viewBox='0 0 15.573 25.786' {...props}>
    <Defs />
    <G
      id='prefix__Group_898'
      data-name='Group 898'
      transform='translate(-293.149 -25.254)'
    >
      <Rect
        id='prefix__Rectangle_535'
        width={5.191}
        height={25.786}
        className='prefix__cls-1'
        data-name='Rectangle 535'
        rx={2.595}
        transform='translate(293.149 25.254)'
        fill='#fff'
      />
      <Rect
        id='prefix__Rectangle_536'
        width={5.191}
        height={25.786}
        className='prefix__cls-1'
        data-name='Rectangle 536'
        rx={2.595}
        transform='translate(303.53 25.254)'
        fill='#fff'
      />
    </G>
  </Svg>
)

export default SvgComponent
