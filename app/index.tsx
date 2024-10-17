import { Redirect } from "expo-router"
// import * as Permissions from 'expo-permissions';
import { useEffect } from "react";

// async function getPermissions() {
//   const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
//   if (status !== 'granted') {
//     console.log('Permission to access media library is required!');
//     return false;
//   }
//   console.log('Access to AWS S3.');
//   return true;
// }

const index = () => {
    useEffect(() => {
        // getPermissions();
    }, []);
    return <Redirect href={"/(routes)/onboard"} />
}

export default index;