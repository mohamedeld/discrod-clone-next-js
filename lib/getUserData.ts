import axios from "axios";


export const getUserData = async ()=>{
    try{
        const response = await axios.get("/api/getSessionUser");
        if(response?.status === 200){
            return response?.data
        }
    }catch(error){
        console.log(error);
        return null;
    }
}