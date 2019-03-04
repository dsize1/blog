import React from 'react'

const Indication = (props) => {
  return (
    <ul className='indication'>
      <li>
        <span>U: 上层顺时针旋转90度</span>
        <span>U': 上层逆时针旋转90度</span>
        <span>U2: 上层顺时针旋转180度</span>
      </li>
      <li>
        <span>R: 右面顺时针旋转90度</span>
        <span>R': 右面逆时针旋转90度</span>
        <span>R2: 右面顺时针旋转180度</span>
      </li>
      <li>
        <span>F: 前面顺时针旋转90度</span>
        <span>F': 前面逆时针旋转90度</span>
        <span>F2: 前面顺时针旋转180度</span>
      </li>
      <li>
        <span>D: 下层顺时针旋转90度</span>
        <span>D': 下层逆时针旋转90度</span>
        <span>D2: 下层顺时针旋转180度</span>
      </li>
      <li>
        <span>L: 左面顺时针旋转90度</span>
        <span>L': 左面逆时针旋转90度</span>
        <span>L2: 左面顺时针旋转180度</span>
      </li>
      <li>
        <span>B: 后面顺时针旋转90度</span>
        <span>B': 后面逆时针旋转90度</span>
        <span>B2: 后面顺时针旋转180度</span>
      </li>
      <li>
        <span>UX: 参照面切换为黄色</span>
        <span>RY: 参照面切换为绿色</span>
        <span>FY: 参照面切换为红色</span>
      </li>
      <li>
        <span>DX: 参照面切换为白色</span>
        <span>LY: 参照面切换为蓝色</span>
        <span>BY: 参照面切换为橙色</span>
      </li>
    </ul>
  )
}

export default Indication 