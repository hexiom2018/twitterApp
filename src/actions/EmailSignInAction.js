import {emailRegistration} from '../api/AuthenticationService';
export const SIGN_UP_EMAIL_ACCOUNT = 'SIGN_UP_EMAIL_ACCOUNT';

export async function createAccountWithEmail(registrationRequest,dispatch){
 console.log("create new account",registrationRequest)
      const TIMEOUTID = setTimeout(async ()=>{
        try {
            const result = await emailRegistration(registrationRequest)
            console.log(result)
                dispatch({type:SIGN_UP_EMAIL_ACCOUNT,data:{user:result},})
        } catch (error) {
          console.error(error)
            dispatch({type:SIGN_UP_EMAIL_ACCOUNT,error:error.message,})
        }finally{
            clearTimeout(TIMEOUTID)
        }
      },0 )      
    
  
   
}