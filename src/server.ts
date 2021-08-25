import app from './app';
import './config/enviroment';

const initServer = async (): Promise<void> => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server started on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

initServer();
