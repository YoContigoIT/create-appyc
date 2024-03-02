
// @ts-nocheck
import express, { Application } from 'express';
import morgan from 'morgan';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en el puerto ${port}`);
});