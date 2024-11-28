import 'dotenv/config';
import express from 'express';
import routes from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes());

app.get("/health",(req,res)=>

  res.status(200).json({
      status: 200,
      message: "Working!",
    }),
)

app.use("*", (req, res) =>
  res.status(404).json({
    status: 404,
    message: "Sorry, the requested url does not found!",
  }),
);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;