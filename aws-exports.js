import Amplify from 'aws-amplify';
// import { Permissions } from 'expo-permissions';

Amplify.configure({
  Auth: {
    identityPoolId: 'ap-southeast-2:6aec18e5-a12e-4dbc-ad62-1b27e179b685', // Identity Pool ID từ AWS Cognito
    region: 'ap-southeast-2', // Region của S3 Bucket
    userPoolId: 'ap-southeast-2_7EOZX84Da',
    userPoolWebClientId: '1hdntt367ligl26o1bj3iqsvl3',
  },
  Storage: {
    bucket: 'android-advance',
    region: 'ap-southeast-2',
    identityPoolId: 'ap-southeast-2:6aec18e5-a12e-4dbc-ad62-1b27e179b685',
  }
});
