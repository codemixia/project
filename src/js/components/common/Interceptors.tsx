import axios from 'axios';
import { useState } from 'react';

import { useAppDispatch } from '_utils/reduxHooks';

function Interceptors() {
    const dispatch = useAppDispatch();
    const [isLoadedInterceptors, setIsLoadedInterceptors] = useState(false);
    if (!isLoadedInterceptors) {
        axios.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                const response = error.response || {};
                const code = response.status || 999;
                switch (code) {
                    case 401: {
                        break;
                    }
                    default: {
                        break;
                    }
                }
                return Promise.reject(error);
            },
        );
        setIsLoadedInterceptors(true);
    }
    return <></>;
}

export default Interceptors;
