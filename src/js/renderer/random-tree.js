import {
  randomTree
} from 'random-graph'

export default
  function (size) {
  return randomTree({
    size: size - 1,
    attributes: {
      id: {
        type: 'uuid'
      },
      name: {
        type: 'randomString',
        options: {
          length: 0,
          maxLength: 16,
          categories: [
            'japanese',
            'letter',
            'chinese',
            'special'
          ]
        }
      }
    }

  })
}

