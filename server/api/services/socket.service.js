const socketio = require('socket.io')
const Socket = require('../../api/models/socket.model')

let socketServerInstance

function init(server) {
  socketServerInstance = socketio(server)
  socketServerInstance.on('connection', function(socket) {
    console.log('a user connected')
  })
  initUserSocket()
  return socketServerInstance
}

async function initUserSocket() {
  let socketsFromDatabase

  try {
    socketsFromDatabase = await Socket.find()
  } catch (error) {
    throw new Error(`Error getting socket from database: ${error}`)
  }

  for (const socket of socketsFromDatabase) {
    socketServerInstance.of(`/${socket.namespace}`)
  }
}

async function emit(userId, data, event = 'notification') {
  if (data.type === 'error') {
    data.title = 'Whoops...'
  }

  if (event === 'message') {
    socketServerInstance.emit('message', data) // send to everyone
  } else if (event === 'notification') {
    const socket = await getNamespaceSocket(userId)
    socket.emit('notification', data) // send only to user
  }
}

async function getNamespaceSocket(_namespaceName) {
  let socketFromDatabase
  let namespaceToReturn

  try {
    socketFromDatabase = await Socket.findOne({ namespace: _namespaceName })
  } catch (error) {
    throw new Error(`Error getting socket from database: ${error}`)
  }

  if (socketFromDatabase) {
    namespaceToReturn = socketServerInstance.of(`/${socketFromDatabase.namespace}`)
  } else {
    socketFromDatabase = new Socket({ namespace: _namespaceName })
    await socketFromDatabase.save()
    namespaceToReturn = socketServerInstance.of(`/${_namespaceName}`)
  }

  return namespaceToReturn
}

module.exports = {
  init,
  get socket() {
    return socketServerInstance
  },
  getNamespaceSocket,
  emit
}
