
// hook to get user data
import { useSelector } from "react-redux";

export const useUserData = () => {
    const user = useSelector((state: any) => state.user.user);
    return user;
};