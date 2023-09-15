const jwt = require('jsonwebtoken');
const mysql = require('../helpers/Sql_connection');

function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('New client connected');
      
        socket.on('sendMessage', (messageData) => {
          const { token, receiver, message, image } = messageData;
      
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
              console.log(err);
              // Handle error condition, such as emitting an error event
              socket.emit('sendMessageError', { message: "Internal server error" });
            } else {
              const { userId, username } = decoded;
              console.log(decoded);
              mysql.query(`SELECT id FROM user where username=?`, [receiver], (err, result) => {
                if (err) {
                  // Handle error condition, such as emitting an error event
                  socket.emit('sendMessageError', { message: "Internal server error" });
                } else {
                  const receiver_id = result[0].id;
                  mysql.query(`INSERT INTO chat(sender_id, receiver_id, message, seen, receiver_Liked, sender_Liked, image_sent) VALUES(?, ?, ?, 0, "n", 0, ?)`, [userId, receiver_id, message, image], (error, result) => {
                    if (error) {
                      console.log(error);
                      // Handle error condition, such as emitting an error event
                      socket.emit('sendMessageError', { message: "Error sending message" });
                    } else {
                      mysql.query(`SELECT *
                      FROM chat
                      WHERE sentAt = (SELECT MAX(sentAt) FROM chat)
                        AND message_id = (SELECT MAX(message_id) FROM chat)
                        `, (error, result) => {
                          if (error) {
                            console.log(error)
                            socket.emit('sendMessageError', { message: "Error sending message" });
                          }
                          else {
                            // Emit a success event to acknowledge that the message was sent
                            socket.emit('sendMessageSuccess', { message: "Message sent!" });
                            // Broadcast the message to all connected clients, except the sender
                            console.log("receiverMessage")
                            io.emit('receiveMessage', {
                              message_id: result[0].message_id,
                              sender_id: userId,
                              receiver_id: receiver_id,
                              SENDER: username,
                              RECEIVER:receiver,
                              message: message,
                              sentAt:result[0].sentAt,
                              image_sent:image,
                              seen: result[0].seen,
                              receiver_liked: result[0].receiver_Liked,
                              sender_liked: result[0].sender_Liked
                              
                            });
                          }
                        })
                      
                      
                    }
                  });
                }
              });
            }
          });
        });
      
        socket.on('disconnect', () => {
          console.log('Client disconnected');
        });
      
        socket.on('status', (status) => {
          const {token, isActive} = status
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded )=> {
            if (err) {
              console.log(err)
              socket.emit('sendMessageError', { message: "Internal server error" });
            }
            else {
              const {userId, username} = decoded
              console.log("ahawa userID=", userId)
              mysql.query(`UPDATE user 
                        set isActive = ?
                      where id = ?`, [isActive, userId], (err, result) => {
                        if (err) {
                          console.log(err)
                          socket.emit('sendMessageError', { message: "Error sending message" });
                        }else {
                          mysql.query('SELECT username, isActive FRom user where id  and isActive = 1 ', (error, result) => {
                            if (error) {
                              console.log(error)
                            }
                            else {
                              console.log("this is result:", result)
                              result.map((resul)=> {
                                console.log(resul)
                              })
                              io.emit('knowStatus', result);
                            }
                          })
                          
                        }
                      })
            }
          })
      
        })
      
        socket.on('Seen', (messageData) => {
          const {token, selected_username, time}  = messageData
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
              console.log(err)
              socket.emit('sendMessageError', { message: "Error sending message" });
            }
            else{
              console.log("seen altering ")
              const {userId, username} = decoded
              mysql.query(`UPDATE chat 
                          SET seen = 1, seen_time= ?
                          WHERE message_id = (
                              SELECT message_id
                              FROM (
                                  SELECT message_id
                                  FROM Chat
                                  WHERE (sender_id = ? AND receiver_id = (SELECT id FROM user WHERE username = ?))
                                    OR (sender_id = (SELECT id FROM user WHERE username = ?) AND receiver_id = ?)
                                  ORDER BY message_id DESC
                                  LIMIT 1
                              ) AS subquery);`, [time, userId, selected_username, selected_username, userId],  (error, result) => {
                if (error) {
                  console.log("erroe is: ", err)
                  
                }
                else {
                  mysql.query(`SELECT message_id, seen_time
                  FROM Chat
                  WHERE (sender_id = ? AND receiver_id = (SELECT id FROM user WHERE username = ?))
                     OR (sender_id = (SELECT id FROM user WHERE username = ?) AND receiver_id = ?)
                  ORDER BY message_id DESC
                  LIMIT 1;`, [userId, selected_username, selected_username, userId], (error, result) => {
                    if(error) {
                      console.log(err)
                      socket.emit('sendMessageError', { message: "Error sending message" });
                    }
                    else {
                      console.log("result", result[0])
                      io.emit('onSeen', result[0]);
                    }
                  })
                }
              })
            }
      
          })
      
        })
        socket.on('React', (messageData) => {
          const {message_id, reaction } = messageData
          console.log("emission: ", messageData)
          mysql.query(`UPDATE  chat set receiver_liked = ? where message_id = ?;`, [reaction, message_id], (err, result) => {
            if (err) {
              console.log(err)
              socket.emit('sendMessageError', { message: "Error sending message" });
            }
            else {
              io.emit('onReaction', messageData)
            }
      
          })
        })
        socket.on('Comment' , (messageData) => {
          const {token, comment, post_id } = messageData
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            const {username, userId} = decoded
            mysql.query('INSERT INTO posts_comments(post_id, id, comment, likes) VALUES(?, ?, ?, 0)', [post_id, userId, comment], (error, results) => {
              if (error) {
                console.log(err)
                socket.emit('sendMessageError', { message: "Error sending message" });
              }
              else {
                mysql.query('SELECT*FROM user where id = ? ', [userId], (err, results) => {
                  if (err) {
                    console.log(err)
                    socket.emit('sendMessageError', { message: "Error sending message" });
                  }
                  else {
                    const {pfp, isActive} = results[0]
                    mysql.query("SELECT comment_time, comment_id FROM posts_comments ORDER BY comment_id DESC LIMIT 1", (err, results) => {
                      if(err) {
                        console.log(err)
                        socket.emit('sendMessageError', { message: "Error sending message" });
                      }
                      else {
                        const {comment_time, comment_id} = results[0]
                        const Data = {
                          comment: comment, 
                          comment_id: comment_id, 
                          comment_time: comment_time, 
                          id: userId, 
                          isActive: isActive,
                          likes: 0,
                          pfp: pfp,
                          post_id: post_id,
                          username: username
                        }
                        io.emit('onComment', Data)
                      }
                    })
                  }
                })
              }
            })
          })
        })
      });
}

module.exports= setupSocketIO