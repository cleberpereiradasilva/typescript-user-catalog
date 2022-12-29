import express from 'express'
import { bodyParser, contentTypeJson, cors } from './middleware';

const app = express();

app.use(bodyParser)
app.use(cors)
app.use(contentTypeJson)

export default app

