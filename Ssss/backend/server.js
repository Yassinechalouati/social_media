require("dotenv").config();
const express = require('express');
const app = express();
var cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path')
const server = http.createServer(app);
const setupSocketIO = require('./routes/socketHandler')
const io = socketIO(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      credentials: true
    }
  });

app.use(cors());


const port = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

setupSocketIO(io)

const loginRouter = require('./routes/signin');
const SignupRouter = require('./routes/signup');
const infoRouter = require('./routes/getinfo');
const insertextRouter = require('./routes/savetext');
const loaddataRouter = require('./routes/loadtext');
const loadchatRouter = require('./routes/loadChat');
const searchRouter = require('./routes/search_content')
const idRouter = require('./routes/gettingId')
const videoRouter= require('./routes/upload')
const storiesRouter = require('./routes/stories')
const postsRouter = require('./routes/posts')
const likeRouter = require('./routes/Like')
const isLikedRouter= require('./routes/isLiked')

app.use('/', loginRouter);
app.use('/', SignupRouter);
app.use('/', infoRouter);
app.use('/', insertextRouter);
app.use('/', loaddataRouter);
app.use('/', loadchatRouter);
app.use('/', searchRouter)
app.use('/', idRouter)
app.use('/', videoRouter)
app.use('/', storiesRouter)
app.use('/', postsRouter)
app.use('/', likeRouter)
app.use('/', isLikedRouter)
app.use('/api/uploads', (req, res, next) => {
  console.log('Request received:', req.url);
  next();
}, express.static('../images_videos'));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
