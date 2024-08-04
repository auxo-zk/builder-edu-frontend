import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
);
