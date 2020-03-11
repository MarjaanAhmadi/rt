import React, {useState} from 'react';
import './resetPassword.css'
import {withTranslation} from "react-i18next";
import axiosInstance from "../../../config/axios";
import {toast} from "react-toastify";

const ResetPassword = ({t}) => {
    const [changePass, setChangePass] = useState({
        old_password: null,
        new_password1: null,
        new_password2: null
    });


    //pass characters should be 8
    //new pass should match old pass
    //no fields shouldn't be null
    const changeValidations = ()=>{

        if(changePass.old_password == null || changePass.new_password1 == null || changePass.new_password2 == null ){
            toast.error('وارد کردن همه ی فیلدها اجباری است.')
            return true
        }
        if(changePass.new_password2 !== null && changePass.new_password1 !== null){
            if(changePass.new_password2.length <= 8){
                toast.error('حداقل ۸ کاراکتر نیاز است.')
                return true
            }
            if(changePass.new_password2 !== changePass.new_password1){
                toast.error('رمز وازد شده یکسان نمی‌‌‌‌‌باشد.')
                return true
            }
        }
    };

    return(
        <div className="form-group rtl">
                <input className="form-control mr-sm-2 custom-input amount-input mt-1"
                       type="password"
                       value={changePass.old_password}
                       onChange={(event) => {
                           setChangePass({
                               ...changePass,
                               old_password: event.target.value
                           })
                       }}
                       placeholder={t('currentPass')}
                />
            <input className="form-control mr-sm-2 custom-input amount-input mt-1"
                   value={changePass.new_password1}
                   onChange={(event) => {
                       setChangePass({
                           ...changePass,
                           new_password1: event.target.value
                       })
                   }}
                   placeholder={t('newPass')}

            />
            <input className="form-control mr-sm-2 custom-input amount-input mt-1"
                   value={changePass.new_password2}
                   onChange={(event) => {
                       setChangePass({
                           ...changePass,
                           new_password2: event.target.value
                       })
                   }}
                   placeholder={t('repeatPass')}
            />
            {/*<Button onClick={changePassword} className="btn-success">{t('submit')}</Button>*/}
        </div>
    )
}
export default withTranslation()(ResetPassword);
