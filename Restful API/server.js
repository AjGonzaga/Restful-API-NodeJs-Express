const express = require ('express')
const studentRoutes = require('./src/student/routes')
const app = express();
const bodyParser = require('body-parser');
const cors =require ('cors')
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());


app.use(cors());
app.get('/', (req, res) => {
    res.send('hello');
});

app.use('/api/v1/students', studentRoutes);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
