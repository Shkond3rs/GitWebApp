import React from "react";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const NotFoundPage = () => {
    toast.error('Страница не найдена', {
        position: "bottom-center",
        autoClose: 3000,
    });
};

export default NotFoundPage;