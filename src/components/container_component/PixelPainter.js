import React, {Component} from 'react'
import io from 'socket.io-client'
import Styled from 'styled-components'
import ColorPicker from '../stateless_component/ColorPicker'
import ColorSelector from '../stateless_component/ColorSelector'
import throttle from 'lodash.throttle'

const StyledPixelPainter = Styled.div`
  color: ${(props) => props.theme.color}
  & .drawing-board {
    margin: 0 auto 1rem;
    display: block;
    transition: all .5s ease-in-out;
    box-shadow: 0px 0px 2px rgba(30, 30, 30, 1);
  }

  & .drawing-board:hover {
    box-shadow: 0px 0px 10px rgba(30, 30, 30, 0.8);
    transform: translate(0, -2px) 
  }

  & .magnifying-lens {
    width: 200px;
    height: 200px;
    overflow: hidden;
    color: transparent;
    position: relative;
    border: 5px solid #333;
    box-shadow: inset 0px 0px 75px rgba(128, 128, 128, 0.8);
    border-radius: 50%;
    background-color: rgba(248, 248, 248, 0.8);
  }

  & .point {
    width: 1px;
    height: 1px;
    position: absolute;
    left: 100px;
    top: 100px;
    background-color: #ff0000;
    border-radius: 50%;
  }

  & .magnifying-lens canvas {
    position: absolute
  }

  & .tool-bar {
    display: flex;
    margin: 1rem auto;
    max-width: 900px;
  }
  & .tool-bar>div:nth-of-type(2) {
    padding: 1rem;
    padding-left: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  & .tool-bar>div:nth-of-type(2)>* {
    margin-top: 1rem;
  }
  & .tool-bar>div:nth-of-type(2)>p i {
    color: red;
  }
  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(1) {
    display: flex;
  }

  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(1)>* {
    margin-right: 1rem;
  }
  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(2) {
    display: flex;
  }
  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(2)>label {
    width: 1.25rem;
    height: 1.25rem;
    margin: 0 0.2rem;
    border: 1px solid;
  }
  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(2)>label>input {
    visibility: hidden;
    pointer-events: none;
  }
  &>span {
    margin: 1rem;
    float: right;
  }
`

class PixelPainter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pixelData: [],
      commonColors: [
        '#000000',
        '#ffffff',
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#00ffff',
        '#ff00ff',        
        "#ff5722",
        "#faac8e",        
        "#f8cb8c",        
        "#e91e63",        
        "#d7ff07",        
        "#97fddc",
        "#673ab7",
        "#37a93c",
      ],
      color: '#000000',
      width: 880,
      height: 544,
      isPickingColor: false,
      clientsCount: 0,
      factor: 1,
      offsetX: 200,
      offsetY: 200,
      scale: 'scale(1)',
      origin: 'center',
      lastX: 0,
      lastY: 0,
    }
    this.handelMouseEnter = this.handelMouseEnter.bind(this)
    this.pickColor = this.pickColor.bind(this)
    this.drawDot = this.drawDot.bind(this)
    this.handleColorPickerClick = this.handleColorPickerClick.bind(this)
    this.handleColorPickerChange = this.handleColorPickerChange.bind(this)
    this.handleColorSelectorChange = this.handleColorSelectorChange.bind(this)
  }

  handelMouseEnter(e) {
    e.stopPropagation()
    this.setState({
      offsetX: 636 + e.target.offsetLeft - e.clientX,
      offsetY: 158 + e.target.offsetTop - e.clientY,
      lastX: e.clientX,
      lastY: e.clientY
    })
    const handleMagnifyingLensEnlarge = this.handleMagnifyingLensEnlarge.bind(this)
    const handleMagnifyingLensMove = throttle(this.handleMagnifyingLensMove.bind(this), 17, { leading: true })
    e.target.addEventListener('mousemove', handleMagnifyingLensMove)
    e.target.addEventListener('mousewheel', handleMagnifyingLensEnlarge)

    e.target.onmouseleave = (e) => {

      e.target.removeEventListener("mousemove", handleMagnifyingLensMove)
      e.target.removeEventListener("mousewheel", handleMagnifyingLensEnlarge)

      this.setState({
        offsetX: 200,
        offsetY: 200,
        factor: 1,
        scale: 'scale(1)',
        origin: 'center',
        lastX: 0,
        lastY: 0,
      })
    }

    e.target.onclick = (e) => {
      e.stopPropagation()
      this.setState({
        factor: 1,
        scale: 'scale(1)',
      })
      if(this.state.isPickingColor){
        this.pickColor(e)
      } else {
        this.drawDot(e)
      }          
    }
  }

  handleMagnifyingLensMove (e) {
    this.setState({
      offsetX: this.state.offsetX + (this.state.lastX - e.clientX) * this.state.factor,
      offsetY: this.state.offsetY + (this.state.lastY - e.clientY) * this.state.factor,
      lastX: e.clientX,
      lastY: e.clientY
    })
  }

  handleMagnifyingLensEnlarge (e) {
    e.preventDefault()

    let factor
    if (e.deltaY > 0 && this.state.factor < 8) {
      factor = 2 * this.state.factor
    } else if (e.deltaY < 0 && this.state.factor > 1) {
      factor = 0.5 * this.state.factor
    } else {
      return
    }
    const offsetX = 636 + e.target.offsetLeft - e.clientX
    const offsetY = 158 + e.target.offsetTop - e.clientY
    const origin = `${100 - offsetX}px ${100 - offsetY}px`
    const scale = `scale(${factor})`
    this.setState({
      factor,
      offsetX,
      offsetY,
      origin,
      scale,
    })
  }

  handleColorPickerClick () {
    this.setState({
      isPickingColor: !this.state.isPickingColor
    })
  }

  handleColorPickerChange (e) {
    this.setState({
      color: e.target.value
    })
  }

  handleColorSelectorChange (e) {
    this.setState({
      color: e.target.value
    })
  }

  rgba2Hex (dot) {
    dot = Array.from(dot)
    dot = dot.map(it => it.toString(16).padStart(2, '0'))
    return '#' + dot[0] + dot[1] + dot[2]
  }

  pickColor (e) {
    const x = e.offsetX
    const y = e.offsetY
    const p = this.ctx1.getImageData(x, y, 1, 1).data

    this.setState({
      color: this.rgba2Hex(p),
      isPickingColor: false
    })
  }

  drawDot (e) {
    const x = e.offsetX
    const y = e.offsetY
    this.ws.emit('drawDot', {
      x: x,
      y: y,
      color: this.state.color
    })
    this.ctx1.fillStyle = this.state.color
    this.ctx1.fillRect(x, y, 1, 1)
    this.ctx2.fillStyle = this.state.color
    this.ctx2.fillRect(x, y, 1, 1)
  }

  componentDidMount () {
    const ws = io('https://www.chengcici.info/pixelpainter')
    this.ws = ws

    const DrawingBoard = this.DrawingBoard
    DrawingBoard.addEventListener('mouseenter', this.handelMouseEnter)
    const MagnifyingLens = this.MagnifyingLens
    DrawingBoard.style.imageRendering = 'pixelated'
    MagnifyingLens.style.imageRendering = 'pixelated'

    const ctx1 = DrawingBoard.getContext('2d', {alpha: false})
    window.ctx1 = ctx1
    this.ctx1 = ctx1
    const ctx2 = MagnifyingLens.getContext('2d', { alpha: false })
    this.ctx2 = ctx2

    //arrayBuffer=>blob
    ws.on('init', imgBinaryData => {
      const blob = new Blob([new Uint8Array(imgBinaryData)])
      const tmpURL = URL.createObjectURL(blob)
      const image = new Image()
      image.src = tmpURL
      image.onload = () => {
        this.ctx1.drawImage(image, 0, 0)
        this.ctx2.drawImage(image, 0, 0)
      }
    })

    ws.on('onlineCount', data => {
      this.setState({
        clientsCount: data.count
      })
    })

    ws.on('updataDot', opList => {
      opList.forEach(data => {
        this.ctx1.fillStyle = data.color
        this.ctx1.fillRect(data.x, data.y, 1, 1)
        this.ctx2.fillStyle = data.color
        this.ctx2.fillRect(data.x, data.y, 1, 1)
      })
    })
  }

  componentWillUnmount () {
    this.DrawingBoard.removeEventListener('mouseenter', this.handelMouseEnter)
    this.ws.close()
  }

  render () {
    const width = this.state.width
    const height = this.state.height
    const left = this.state.offsetX + 'px'
    const top = this.state.offsetY + 'px'
    const transform = this.state.scale
    const transformOrigin = this.state.origin
    return (
      <StyledPixelPainter>
        <div className='tool-bar'>
          <div 
            className='magnifying-lens'>
            <canvas 
              ref={(canvas) => this.MagnifyingLens = canvas}
              width={width}
              height={height} 
              style={{left, top, transform, transformOrigin}}>
            </canvas>
            <div className='point' style={{transform: `${transform} translate(50%, 50%)`}}></div>
          </div>
          <div>
            <p><span>当前放大倍数：X<i>{this.state.factor}</i>，鼠标滚轮向上缩小，向下放大。</span></p>
            <ColorPicker 
              onClick={this.handleColorPickerClick} 
              onChange={this.handleColorPickerChange}
              color={this.state.color}
              isPickingColor={this.state.isPickingColor}
            />
            <ColorSelector 
              onChange={this.handleColorSelectorChange} 
              commonColors={this.state.commonColors}
            />
          </div>
        </div>
        <canvas 
          className='drawing-board'
          ref={(canvas) => this.DrawingBoard = canvas} 
          width={width}
          height={height}>
        </canvas>
        <span>在线人数：{ this.state.clientsCount }人</span>
      </StyledPixelPainter>
    )
  }
}

export default PixelPainter