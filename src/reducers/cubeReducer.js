import produce from 'immer'
const colors = {
  FRONT: 'red',
  BEHIND: 'orange',
  LEFT: 'blue',
  RIGHT: 'green',
  UP: 'yellow',
  DOWN: 'white',
}

const create = (face, side, color) => {
    const outPos = {
      FRONTX: [
        -1, 0, 1,
        -1, 0, 1,
        -1, 0, 1
      ],      
      FRONTY: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
      ],      
      FRONTZ: 1.5,
      FRONTRotate3d: [0, 0, 0, 0],
      
      BEHINDX: [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
      ],      
      BEHINDY: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
      ],      
      BEHINDZ: -1.5,
      BEHINDRotate3d: [0, 1, 0, 180],
      
      LEFTX: -1.5,      
      LEFTY: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
      ],      
      LEFTZ: [
        -1, 0, 1,
        -1, 0, 1,
        -1, 0, 1
      ],
      LEFTRotate3d: [0, 1, 0, -90],
      
      RIGHTX: 1.5,      
      RIGHTY: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
      ],      
      RIGHTZ: [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
      ],
      RIGHTRotate3d: [0, 1, 0, 90],

      UPX: [
        -1, 0, 1,
        -1, 0, 1,
        -1, 0, 1
      ],      
      UPY: -1.5,      
      UPZ: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
      ],
      UPRotate3d: [1, 0, 0, 90],
      
      DOWNX: [
        -1, 0, 1,
        -1, 0, 1,
        -1, 0, 1
      ],      
      DOWNY: 1.5,      
      DOWNZ: [
        1, 1, 1,
        0, 0, 0,
        -1, -1, -1
      ],
      DOWNRotate3d: [1, 0, 0, -90]      
    }

    const bgPos = [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [0, -1],
      [-1, -1],
      [-2, -1],
      [0, -2], 
      [-1, -2], 
      [-2, -2]]

    return new Array(9).fill(0).map((_, i) => {
      const action = [0, 0, 0]
      const x = outPos[`${face}X`]
      const y = outPos[`${face}Y`]
      const z = outPos[`${face}Z`]
      const translateX = Array.isArray(x) ? x[i] : x 
      const translateY = Array.isArray(y) ? y[i] : y
      const translateZ = Array.isArray(z) ? z[i] : z
      const translate3d = [translateX, translateY, translateZ]
      const rotate3d = outPos[`${face}Rotate3d`] 
      let backgroundPos
      switch (color) {
        case 'red':
          backgroundPos = {x: bgPos[i][0] - 0, y: bgPos[i][1] - 0}
          break;
        case 'orange':
          backgroundPos = {x: bgPos[i][0] - 0, y: bgPos[i][1] - 3}
          break;
        case 'blue':
          backgroundPos = {x: bgPos[i][0] - 3, y: bgPos[i][1] - 3}
          break;
        case 'green':
          backgroundPos = {x: bgPos[i][0] - 3, y: bgPos[i][1] - 0}
          break;
        case 'yellow':
          backgroundPos = {x: bgPos[i][0] - 6, y: bgPos[i][1] - 0}
          break;
        case 'white':
          backgroundPos = {x: bgPos[i][0] - 6, y: bgPos[i][1] - 3}
          break;
        default:
          break
      }
      return {
        position: {
          action,
          translate3d,
          rotate3d,
        },
        aspect: {
          id: i,
          color,
          backgroundPos,
        }
      }
    })
  }

const createCube = (colors) => {
  const cubes = []
  for (var [key, value] of Object.entries(colors)) {
    cubes.push(...create(key, 'outside', value))
  }
  return cubes
}

const cubes = createCube(colors)

const globalDisplay = cubes.map(cube => cube.aspect.color)

const defaultState = {
  size: 50,
  cubes,
  globalDisplay,
  view: 'FRONT',
  colors,
  rotating: false,
  records: [],
  inputFieldValue: '',
  submitting: false,
  submitStatus: '请输入操作例如：U D\' F2 RY。'
}

const cubeReducer= (state = defaultState, action) => {
  switch (action.type) {
    case 'RESTORE':
      return produce(state, draft => {
        const cubes = createCube(colors)
        draft.cubes = cubes
        draft.globalDisplay = cubes.map(cube => cube.aspect.color)
      })
    case 'VIEW_CHANGING':
      return produce(state, draft => {
        draft.view = action.view
        draft.rotating = true
      })
    case 'VIEW_CHANGED':
      return produce(state, draft => {
        draft.rotating = false
      })
    case 'CUBE_ROTATING':
      return produce(state, draft => {
        draft.cubes = action.cubes
        draft.rotating = true
      })
    case 'CUBE_ROTATED':
      return produce(state, draft => {
        draft.cubes = action.cubes
        draft.rotating = false
      })
    case 'INPUT_CHANGE':
      return produce(state, draft => {
        draft.inputFieldValue = action.value
      })
    case 'INPUT_SUBMITTING':
    return produce(state, draft => {
      draft.inputFieldValue && draft.records.unshift(draft.inputFieldValue)
      draft.submitting = true
      draft.submitStatus = '操作魔方中......'
    })
    case 'INPUT_SUBMITTED':
    return produce(state, draft => {
      draft.inputFieldValue = ''
      draft.submitting = false
      draft.submitStatus = '请输入旋转操作。'
      draft.globalDisplay = draft.cubes.map(cube => cube.aspect.color)
    })
    case 'SUBMIT_FAILED':
    return produce(state, draft => {
      draft.inputFieldValue = ''
      draft.submitStatus = '输入有误，请重新输入。'
    })
    default:
      return state
  }
}

export default cubeReducer