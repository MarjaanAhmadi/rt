import React,{useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Loader from 'react-loader-spinner';
import i18n from './config/language/i18n';
import { Route, Switch, useHistory } from 'react-router-dom';
import {withTranslation} from "react-i18next";
import { toast, ToastContainer } from 'react-toastify';
import './App.css';
import DefaultLayout from "./layouts/defaultLayout";
import Auth from "./pages/auth/auth";
import NotFound from "./pages/notFound404";
import InternalServer from "./pages/500";
import axiosInstance from "./config/axios";
import getUsersList from "./mainComponents/getUsersList/getUsersList";
import getEndpointsList from "./mainComponents/getEndpointsList/getEndpointsList";

toast.configure({
    autoClose: 8000,
    draggable: false,
    //etc you get the idea
});



const App = () => {

    const dispatch = useDispatch();

    const token = localStorage.getItem('admin-token');

    const loading = useSelector(state => state.loading);

    const language = useSelector(state => state.language);

    const [direction, setDirection] = useState('rtl');

    const history = useHistory();

    const getStatics = async () => {
       await getBusinessWeeks();
       await getConditionalList();
       await getCalendars();
       await getOperators();
       await getGeneralResources();
       await getGateways();
       await getDestinations();
       const users = await getUsersList();
       if(users.length > 0) setListsToRedux(users, 'SET_USERS');
       const endpoints = await getEndpointsList();
       if(endpoints.length > 0) setListsToRedux(endpoints, 'SET_ENDPOINTS');
    };

    const getCalendars =async () => {
        const response = await axiosInstance.get('/calender/api/week');
        dispatch({calenders: response.data.data, type: 'SET_CALENDERS'});
    };
    const getOperators =async () => {
        const response = await axiosInstance.get('/cgrates/v1/api/operators/');
        dispatch({operators: response.data.data, type: 'SET_OPERATORS'});
    };

    const getGateways = async () =>{
        const response = await axiosInstance.get('/gateway/api/gateway/');
        dispatch({gateways: response.data.data, type: 'SET_GATEWAYS'});
    };
    const getDestinations = async () => {
        const response = await axiosInstance.get('/cgrates/v1/api/destinations',{params: {unused: 'operator'}});
        dispatch({destinations: response.data.data, type: 'SET_DESTINATIONS'});
    };
    const getGeneralResources = async () => {
        const response = await axiosInstance.get('/generalresources/api/playback/');
        dispatch({generalResources: response.data.data, type: 'SET_GENERAL_RESOURCES'});
    };

    const setListsToRedux = (payload, type) => {
       switch (type) {
           case 'SET_USERS':
               dispatch({users: payload, type: type});
               break;
           case 'SET_ENDPOINTS':
               dispatch({endpoints: payload, type: type});
               break;
           default: console.log('loaded');
       }
    };

    const getBusinessWeeks = async () => {
        try {
                const response = await axiosInstance.get('/calender/api/week/')
                dispatch({
                    weeks:response.data.data,
                    type: 'SET_WEEKS'
                });
        }
        catch (e) {
            console.log(e)
        }
    };
    const getConditionalList = async () => {
        try {
            const limit = 999;
            const response = await axiosInstance.get('/conditional_list/api/conditional_list/', {params: limit})
            dispatch({
                conditions: response.data.data,
                type: 'SET_CONDITIONAL_LIST'
            });
        }
        catch (e) {
            console.log(e)
        }
    };

    const getDirection = () => {
        language === 'per' ? setDirection('rtl') : setDirection('ltr')
    };

    const parseJwt = () => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };
    const checkToken = () => {
        const parsedToken= parseJwt();
        const current_time = new Date().getTime() / 1000;
        if (current_time < parsedToken.exp) refreshToken();
    };

    const refreshToken = async () => {
        const response = await axiosInstance.post('/api/token-refresh/', {token: token});
        localStorage.setItem('admin-token', response.data.token);
        dispatch({token: response.data.token, type: 'SET_TOKEN'});
    };

    //when language change direction will change and dispatch to redux i18n language will change => fort future when website is multi language
    useEffect(() => {
        i18n.changeLanguage(language);
        getDirection();
    },[language]);
    useEffect(() => {
        if(!token)
            history.push('/login');
        else
            getStatics();
    }, [token]);
    useEffect(() => {
        const interval = setInterval(() => {
            checkToken();
        }, 10800000);
        return () => clearInterval(interval);
    },[]);

    return (
     <div className={`App ${direction} ${loading ? 'app-loading' : ''}`}>
                     <React.Suspense>
                         <Switch>
                             <Route exact path="/login" name="Login Page" render={props => <Auth {...props}/>} />
                             {
                                token !== null ? <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
:''
                             }
                             <Route path="/404" name="NotFound" render={props => <NotFound {...props}/>} />
                             <Route path="/500" name="InternalServer" render={props => <InternalServer {...props}/>} />


                         </Switch>
                     </React.Suspense>

         <div>
             <ToastContainer/>
         </div>

         <Loader
             className="loading"
             type="Circles"
             color="#6b3586 "
             height={100}
             width={100}
             timeout={20000000}
             visible={loading} />
     </div>
  );
};

export default withTranslation()(App);
