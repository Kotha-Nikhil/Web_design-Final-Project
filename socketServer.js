const socket = require("socket.io");
let users = [];

const EditData = (data, id, call) => {
  const newData = data.map((item) =>
    item.id === id ? { ...item, call } : item
  );
  return newData;
};

const SocketServer = (socket) => {
  // Connect - Disconnect
  socket.on("joinUser", (user) => {
    users.push({
      id: user._id,
      socketId: socket.id,
      followers: user.followers,
    });
  });

  socket.on("disconnect", () => {
    const data = users.find((user) => user.socketId === socket.id);
    console.log(data);

    if (data) {
      const clients = users.filter((user) =>
        data.followers.find((item) => item._id === user.id)
      );

      if (clients.length > 0) {
        clients.forEach((client) => {
          socket.to(`${client.socketID}`).emit("ChekUserOffline", data.id);
        });
      }
      console.log(clients);
    }
    users = users.filter((user) => user.socketId !== socket.id);

    //console.log({users})
  });

  // Likes
  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    //console.log(newPost)
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        //console.log("like in server")
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });

  // Unlikes
  socket.on("unLikePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    ///console.log(newPost)
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unLikeToClient", newPost);
      });
    }
  });

  //Comments
  socket.on("createComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    //console.log(newPost)
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createCommentToClient", newPost);
      });
    }
  });

  //Comments
  socket.on("deleteComment", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    //console.log(newPost)
    const clients = users.filter((user) => ids.includes(user.id));
    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("deleteCommentToClient", newPost);
      });
    }
  });

  //follow
  socket.on("follow", (newUser) => {
    // console.log(newUser)
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit("followToClient", newUser);
  });

  //unfollow
  socket.on("unFollow", (newUser) => {
    // console.log(newUser)
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit("unFollowToClient", newUser);
  });

  // Notification
  socket.on("createNotify", (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    const uniqueClients = clients.filter(
      (client, index, self) =>
        index === self.findIndex((c) => c.id === client.id)
    );
    if (uniqueClients.length > 0) {
      console.log("React out now");
      uniqueClients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("createNotifyToClient", msg);
      });
    }
  });

  socket.on("removeNotify", (msg) => {
    const clients = users.filter((user) => msg.recipients.includes(user.id));
    const uniqueClients = clients.filter(
      (client, index, self) =>
        index === self.findIndex((c) => c.id === client.id)
    );
    if (uniqueClients.length > 0) {
      //console.log("React out now")
      uniqueClients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("removeNotifyToClient", msg);
      });
    }
  });

  //Message
  socket.on("addMessage", (msg) => {
    //console.log(msg)
    const user = users.find((user) => user.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit("addMessageToClient", msg);
  });

  //check user Online/ offline
  socket.on("checkUserOnline", (data) => {
    //console.log(user.following);
    const following = users.filter((user) =>
      data.following.find((item) => item._id === user.id)
    );
    // console.log(following);
    socket.emit("checkUserOnlineToMe", following);

    const clients = users.filter((user) =>
      data.followers.find((item) => item._id === user.id)
    );

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket
          .to(`${client.socketId}`)
          .emit("checkUserOnlineToClient", data._id);
      });
    }
  });
};

module.exports = SocketServer;