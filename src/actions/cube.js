import produce from 'immer'

const transitionMap = {
  FRONT: {
    'F': 'F',
    'B': 'B',
    'L': 'L',
    'R': 'R',
    'U': 'U',
    'D': 'D',
  },
  BEHIND: {
    'F': 'B',
    'B': 'F',
    'L': 'R',
    'R': 'L',
    'U': 'U',
    'D': 'D',
  },
  LEFT: {
    'F': 'L',
    'B': 'R',
    'L': 'B',
    'R': 'F',
    'U': 'U',
    'D': 'D',
  },
  RIGHT: {
    'F': 'R',
    'B': 'L',
    'L': 'F',
    'R': 'B',
    'U': 'U',
    'D': 'D',
  },
  UP: {
    'F': 'U',
    'B': 'D',
    'L': 'L',
    'R': 'R',
    'U': 'B',
    'D': 'F',
  },
  DOWN: {
    'F': 'D',
    'B': 'U',
    'L': 'L',
    'R': 'R',
    'U': 'F',
    'D': 'B',
  }
}

const angleMap = {
  '': 1,
  "'": -1,
  '2': 2,
}

const rotationMap = {
  'F': [0, 0, 90],
  'B': [0, 0, -90],
  'L': [-90, 0, 0],
  'R': [90, 0, 0],
  'U': [0, -90, 0],
  'D': [0, 90, 0],
}

const cubesMap = {
  'F': {
    face: 0,
    side: [42, 43, 44, 27, 30, 33, 47, 46, 45, 26, 23, 20]
  },
  'B': {
    face: 9,
    side: [36, 37, 38, 24, 21, 18, 53, 52, 51, 29, 32, 35]
  },
  'L': {
    face: 18,
    side: [36, 39, 42, 0, 3, 6, 45, 48, 51, 17, 14, 11]
  },
  'R': {
    face: 27,
    side: [44, 41, 38, 9, 12, 15, 53, 50, 47, 8, 5, 2]
  },
  'U': {
    face: 36,
    side: [0, 1, 2, 18, 19, 20, 9, 10, 11, 27, 28, 29]
  },
  'D': {
    face: 45,
    side: [6, 7, 8, 33, 34, 35, 15, 16, 17, 24, 25, 26 ]
  },
}

const viewMap = {
  'UX': 'UP',
  'DX': 'DOWN',
  'RY': 'RIGHT',
  'LY': 'LEFT',
  'FY': 'FRONT',
  'BY': 'BEHIND'
}

const operationsJudge = (ops) => {
  if (ops.length === 0) {
    return false
  }
  return ops.every(op => {
    if (op.length === 2) {
      return rotationMap.hasOwnProperty(op[0]) && (angleMap.hasOwnProperty(op[1]) || viewMap.hasOwnProperty(op))
    } else if (op.length === 1) {
      return rotationMap.hasOwnProperty(op)
    }
    return false
  })
}

const swap = (c1, c2, c3, c4) => {
  const temp = c1.aspect
  c1.aspect = c4.aspect
  c4.aspect = c3.aspect
  c3.aspect = c2.aspect
  c2.aspect = temp
}

const exchange = (cubes, face, side) => {
  swap(cubes[face], cubes[face + 2], cubes[face + 8], cubes[face + 6])
  swap(cubes[face + 1], cubes[face + 5], cubes[face + 7], cubes[face + 3])
  swap(cubes[side[0]], cubes[side[3]], cubes[side[6]], cubes[side[9]])
  swap(cubes[side[1]], cubes[side[4]], cubes[side[7]], cubes[side[10]])
  swap(cubes[side[2]], cubes[side[5]], cubes[side[8]], cubes[side[11]])
}

const contraExchange = (cubes, face, side) => {
  swap(cubes[face], cubes[face + 6], cubes[face + 8], cubes[face + 2])
  swap(cubes[face + 1], cubes[face + 3], cubes[face + 7], cubes[face + 5])
  swap(cubes[side[0]], cubes[side[9]], cubes[side[6]], cubes[side[3]])
  swap(cubes[side[1]], cubes[side[10]], cubes[side[7]], cubes[side[4]])
  swap(cubes[side[2]], cubes[side[11]], cubes[side[8]], cubes[side[5]])
}

const rotating = (cubes, {face, side}, rotation, angle) => {
  for (let i = face; i < face + 9; i++) {
    cubes[i].position.action[0] = cubes[i].position.action[0] + rotation[0] * angle
    cubes[i].position.action[1] = cubes[i].position.action[1] + rotation[1] * angle
    cubes[i].position.action[2] = cubes[i].position.action[2] + rotation[2] * angle
  }
  side.forEach(it => {
    cubes[it].position.action[0] = cubes[it].position.action[0] + rotation[0] * angle
    cubes[it].position.action[1] = cubes[it].position.action[1] + rotation[1] * angle
    cubes[it].position.action[2] = cubes[it].position.action[2] + rotation[2] * angle
  })
}

const rotated = (cubes, {face, side}, angle) => {
  if (angle === 1) {
    exchange(cubes, face, side)
  } else if (angle === -1) {
    contraExchange(cubes, face, side)
  } else {
    exchange(cubes, face, side)
    exchange(cubes, face, side)
  }
}

const rotateAction = (cubes, view, rotateDirection, angle = '') => {
  angle = angleMap[angle]
  const transition = transitionMap[view][rotateDirection]
  const direction = transition[transition.length - 1]
  const rotation = rotationMap[direction]
  const rotatingObj = cubesMap[direction]
  const rotatingCubes = produce(cubes, draft => rotating(draft, rotatingObj, rotation, angle))
  const rotatedCubes = produce(cubes, draft => rotated(draft, rotatingObj, angle))
  return {
    rotating: { type: 'CUBE_ROTATING', cubes: rotatingCubes , view },
    rotated: { type: 'CUBE_ROTATED', cubes: rotatedCubes , view }
  }
}

const viewChangeAction = (view, cubes) => ({
  changing: { type: 'VIEW_CHANGING', view , cubes },
  changed: { type: 'VIEW_CHANGED', view , cubes }
})

const operationFlowGenerator = (ops, cubes, view) => {
  const opFlow = ops.reduce((flow, op) => {
    const top = flow[flow.length - 1]
    const v = top.view
    const c = top.cubes 
    if (viewMap.hasOwnProperty(op)) {
      const {changing, changed} = viewChangeAction(viewMap[op], c)
      flow.push(changing, changed)
    } else {
      const {rotating, rotated} = op.length > 1 ? rotateAction(c, v, op[0], op[1]) : rotateAction(c, v, op)
      flow.push(rotating, rotated)
    }
    return flow
  }, [{ type: 'INPUT_SUBMITTING' ,cubes , view }]) 
  opFlow.push({ type: 'INPUT_SUBMITTED' })
  return opFlow
}

export const handleInputChange = (value) => ({ type: 'INPUT_CHANGE', value })

export const handleInputSubmit = () => async (dispatch, getState) => {
  const operations = getState().cube.inputFieldValue.trim().split(' ')
  const submitting = getState().cube.submitting
  if( !operationsJudge(operations) || submitting === true) {
    return dispatch({ type: 'SUBMIT_FAILED' })
  }
  const view = getState().cube.view
  const cubes = getState().cube.cubes
  const operationFlow = operationFlowGenerator(operations, cubes, view)
  operationFlow.map(async (op, idx) => {
    await setTimeout(() => dispatch(op), (idx + 1) * 300)
  })
}

export const handleAutoArrangement = () => async (dispatch, getState) => {
  const rotation  = Object.keys(rotationMap)
  const angle = Object.keys(angleMap)
  const operations = new Array(10)
    .fill(0)
    .map((_) => rotation[Math.floor(Math.random() * 6)] + angle[Math.floor(Math.random() * 3)])
    const view = getState().cube.view
    const cubes = getState().cube.cubes
    const operationFlow = operationFlowGenerator(operations, cubes, view)
    operationFlow.map(async (op, idx) => {
      await setTimeout(() => dispatch(op), (idx + 1) * 300)
    })
}

export const handleRestore = () => ({ type: 'RESTORE' })