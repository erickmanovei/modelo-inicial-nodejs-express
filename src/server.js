import app from './app';

const { PORT = 3333 } = process.env;

app.listen(PORT, () => console.log(`Connected at ${PORT} port`));
