import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Styled from 'styled-components'
import Indication from '../stateless_component/Indication'
import Item from '../stateless_component/Item'
import InputField from '../stateless_component/InputField'
import Record from '../stateless_component/Record'
import Display from '../stateless_component/Display'
import { handleInputChange,
         handleInputSubmit,
         handleRestore,
         handleAutoArrangement
        } from '../../actions/cube'

const StyledMagicCube = Styled.div`
  padding: 1rem;
  background-color: #fff5;

  .magic-cube-container {
    width: 100%;
    display: grid;
    grid-template-columns: 35% 45% 20%;
    grid-template-rows: 10rem 20rem;
    grid-template-areas: 
      "b c d"
      "a a a";
  }

  .magic-cube-wrapper {
    perspective: 1500px;
    margin: 0 auto;
    font-size: 1rem; 
    width: 100%;
    grid-area: a;
  }

  .items {
    transform-style: preserve-3d;
    transition: transform .2s ease-in;
    position: absolute;
    left: 50%;
    top: 40%;
    transform-origin: 50px 50px 0px;
  }

  .items>* {
    position: absolute;
    border: 1px solid rgba(200, 200, 200, 0.8);
    box-sizing: content-box;
  }

  .rotating>* {
    transition: transform .2s ease-in-out;
  }

  .items.front {
    transform: rotate3d(1, 1, 0, -30deg)rotateY(0deg)
  }

  .items.behind {
    transform: rotate3d(1, 1, 0, -30deg)rotateY(180deg)
  }

  .items.left {
    transform: rotate3d(1, 1, 0, -30deg)rotateY(90deg)
  }

  .items.right {
    transform: rotate3d(1, 1, 0, -30deg)rotateY(-90deg)
  }

  .items.up {
    transform: rotate3d(1, 1, 0, -30deg)rotateX(-90deg)
  }

  .items.down {
    transform: rotate3d(1, 1, 0, -30deg)rotateX(90deg)
  }

  .indication {
    padding: 10px 5px;
  }

  .indication>li {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    
  }

  .indication>li>span {
    display: inline-block;
    width: calc(100% / 3);
    flex-grow: 1;
    text-align: left;
    text-indent: 2rem;
    color: royalblue;
    user-select: none;
  }

  .record {
    grid-area: b;
    border: 1px solid #ccc;
    overflow-y: scroll;
  }

  .input-field {
    grid-area: c;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    width: 80%;
    margin: 10px auto;
  }

  .input-field>span:nth-of-type(1) {
    color: royalblue;
  }

  .input-field input {
    width: 90%;
  }

  .input-field>*{
    margin: .5rem;
  }
  
  .input-field>span:nth-of-type(3) {
    display: flex;
    justify-content: space-between;
  }

  .display {
    grid-area: d;
    background-color: #ccc;
    border-radius: .25rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 2px;
    grid-row-gap: 2px;
    grid-template-areas: 
      "a u c c"
      "l f r b"
      "e d g g";
  }

  .display ul {
    width: 100%;
    border: none;
    margin-top: 10px; 
  }

  .display ul.display-up {
    grid-area: u;
  }

  .display ul.display-left {
    grid-area: l;
  }

  .display ul.display-front {
    grid-area: f;
  }

  .display ul.display-behind {
    grid-area: b;
  }

  .display ul.display-right {
    grid-area: r;
  }

  .display ul.display-down {
    grid-area: d;
  }

  .display li {
    float: left;
    margin: 2px;
    width: calc(calc(100% - 12px ) / 3);
    padding-bottom: calc(calc(100% - 12px) / 3);
    border: none;
  }
`

class MagicCube extends Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    cubes: PropTypes.array.isRequired,
    globalDisplay: PropTypes.array.isRequired,
    view: PropTypes.string.isRequired,
    colors: PropTypes.object.isRequired,
    rotating: PropTypes.bool.isRequired,
    records: PropTypes.array.isRequired,
    submitting: PropTypes.bool.isRequired,
    submitStatus: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    inputFieldValue: PropTypes.string.isRequired,
    handleInputSubmit: PropTypes.func.isRequired,
    handleAutoArrangement: PropTypes.func.isRequired
  }

  render () {
    const rotating = this.props.rotating ? 'rotating' : ''
    return (
      <StyledMagicCube>
        <div className='magic-cube-container'>
          <div 
            className="magic-cube-wrapper">
            <div
              className={`items ${this.props.view.toLowerCase()} ${rotating}`}>
              {this.props.cubes.map((cube, idx) => (
                  <Item 
                    key={idx}
                    size={this.props.size} 
                    {...cube}/>
                ))
              }
            </div>
          </div>
          <Record records={this.props.records}/>
          <Display globalDisplay={this.props.globalDisplay}/>
          <InputField
            submitting={this.props.submitting}
            submitStatus={this.props.submitStatus}
            inputFieldValue={this.props.inputFieldValue}
            handleChange={this.props.handleInputChange}
            handleSubmit={this.props.handleInputSubmit}
            handleRestore={this.props.handleRestore}
            handleAutoArrangement={this.props.handleAutoArrangement}/>
        </div>
        <Indication/>
      </StyledMagicCube>
    )
  }
}

const mapStateToProps = state => ({...state.cube})
const mapDispatchToProps = (dispatch) => ({
  handleInputChange: (e) => {
    e.preventDefault()
    dispatch(handleInputChange(e.target.value)
  )},
  handleInputSubmit:  () => dispatch(handleInputSubmit()),
  handleAutoArrangement: () => dispatch(handleAutoArrangement()),
  handleRestore: () => dispatch(handleRestore())
})

export default connect(mapStateToProps, mapDispatchToProps)(MagicCube)