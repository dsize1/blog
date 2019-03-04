import React, { Component } from 'react'
import styled from 'styled-components'
import getRest from '../../util/getRest'

const withPaginationController = (ListComponent) => {
  const StyledWrapper = styled.div`
    width: 100%;
    margin: 0 auto; 
    position: relative;  

      &>div {
        position: relative;
        margin: 5px auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

        &>div>div {
          min-width: 282px;
        }

        &>div button {
          border: none;
        }

        &>div label {
          border: 1px solid;
          border-radius: 5px;
        }

        &>div button,
        &>div>div>* {
          background-color: transparent;
          cursor: grab;
          height: 25px;
          text-align: center;
        }

        &>div label.${({current}) => 'page-' + current} {
          background-color: ${(props) => props.theme.color};
          font-weight: bolder;
          border: 1px solid ${(props) => props.theme.color};
          color: #fff;
        }

        &>div>div>*{
          width: 25px;
          display: inline-block;
          margin: 0 10px;
        }
        
          &>div input {
            position: absolute;
            left: -200px;
            visibility: hidden;
            height: 0;
            width: 0;
            pointer-events: none;
          }

      &>ul {
        display: flex;
        width: ${ ({width}) => Math.floor(width) }px;
        margin: 0 auto;
        flex-direction: column;
        overflow: hidden;
      }

        &>ul>li {
          width: ${ ({width}) => Math.floor(width) }px;
        }
  `
  return class extends Component {
    constructor (props) {
      super(props)
      this.randomName = 'radio-' + Date.now().toString(16).padEnd(20, '#').split('')
        .map(hex => hex !== '#' ? hex : (Math.floor(Math.random() * 100) % 16).toString(16)).join('')
      this.state = {
        current: this.props.defaultCurrent || 1,
        hideOnSinglePage: this.props.hideOnSinglePage || false,
        pageSize: this.props.defaultPageSize || 10,
        pageSizeOptions: this.props.pageSizeOptions || ['10', '20', '30', '40'],
        showQuickJumper: this.props.showQuickJumper || false,
      }
      this._handleChange = this._handleChange.bind(this)
    }

    _handleChange (event) {
      const target = event.target
      const value = target.type === 'radio' ? 
        Number.parseInt(target.value) :
        this.state.current + Number.parseInt(target.attributes['data-changed'].value)
      this.setState({
        current: value
      })
    }

    render () {
      const rest = getRest(this.props, this.state)
      const labels = new Array(Math.ceil(this.props.total/this.state.pageSize))
        .fill(0)
        .map((_, index, array) => {
          const length = array.length
          if (length <= 5 
            || index === 0 
            || index === length-1  
            || (index >= this.state.current - 3 && index <= this.state.current + 1)) {
            return (
              <label 
                key={index}
                className={`page-${index+1}`}>
                <input
                  type='radio'
                  value={index+1}
                  checked={index === this.state.current-1}
                  name={`${this.randomName}`}
                  onChange={this._handleChange}/>
                  {index+1}
              </label>
            )
          } else if (index === this.state.current - 4 || index === this.state.current + 2) {
            return (<span key={index}>...</span>)
          } else {
            return null
          }
        })
      return ( 
        <StyledWrapper
          ref={(el) => this.wrapper = el} 
          className='paginationController'
          current={this.state.current}
          pageSize={this.state.pageSize}
          width={this.wrapper && this.wrapper.offsetWidth}>
          <ListComponent  
            current={this.state.current}
            pageSize={this.state.pageSize}
            {...rest}/>
          <div>
            <button
              data-changed={'-1'}
              disabled={this.state.current === 1} 
              onClick={this._handleChange}>
              上一页
            </button>
              <div>{labels}</div>
            <button
              data-changed={'1'}
              disabled={this.state.current === Math.ceil(this.props.total/this.state.pageSize)} 
              onClick={this._handleChange}>
              下一页
            </button>
          </div>
        </StyledWrapper>
      )
    }
  }
}

export default withPaginationController