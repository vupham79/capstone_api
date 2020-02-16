import * as admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: "capstoneproject1-26a40",
  private_key_id: "c56e4932adf0d624781ebd03c806349be56cdf6a",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDMUC7jqfmHPock\nVu9epTCYaml5DN5ydMb1k87Sk21vrU1T0CM2axgRB+2bdlEeRysjYJz7gGeLev82\nXxMg48U9utiGqo1wQu/KgvPfU0EadevtFrgwteU+CaJjU5WSINbGl3UaMxsNeguD\nQqnprHFy+z0jC/7GHO7jiF0d1Z9tPwMnsj+hwuuJaWem9x/yIJ4vNSqAvcPFG7MF\nyCHwIpFxyN2Eegvxto2SSAsdDkP6RYL1ky7bm8iL29gyICZ4xqD07A8bpqdChwfP\nNrQnNMuT5mYYudiHa1bJcbcmNIqXSxmjd77NUJ2zzrDc/+poOttRU/GjvP3poWTY\n3vUjOGOhAgMBAAECgf8aMFnJxOjydQleqCpYyP+VXzTkxkD7Hx3wlRzfSI30aq2e\nQTR+A59uYH/qWccZ84Z6+Efiw/eS4WtYeAdeVLG6n+ktCMX5ihr1vQnRQ9b1CImU\nvy/733+eMXRacJq+KoduUHh/hvcVjlluouPW3FRSuUboGt/psNESfIR/3OfyFPVi\niyGkCExj5dunjiAJx0aOoaLVPsg98s7EjJWpjPi7igRJ+HQ3JuSeHxhqNNLF7IL6\nvMBJrcbex2MEbOMPOtMb0NTYW6aWpzy5JtvH0PxpWkXVVjVPaRFreEQiRAiB2T2/\n/rpESdDGrvXN6em6mhiQrlSA92TWU+2g8o4VTgECgYEA65Fx9yOKYyuRggJL+cF3\nKtrPc2LCGqAbTFCpWT9zMPFU2Voc/wCgGLVrcTWbEFYO5L6c3CfSAo/Daomp+NKL\nGu0LsjermRNujlkH6qQwFpkCaYcq8UNW94i5rhK1Mah4rAGeba1kflxEwnoSaa6M\nyVwu5TU3O3oOB4Y4q2qcjaECgYEA3gjA6VM4stZvxzL1IPF9zRfqDQP2LcVGvxgl\nDiF7P80ycN+mhTWQatxTdGrsQ64/OIbWW94385kSFW9JZqL/Zc9kI0Uoe2Ha0lp1\nuikf2bzo0oBrEPZXqpwCTqSQ6eBJjum+1kITTNnpYMGPmrCf0Twr1J/UMrct012Z\nM45wFgECgYEA1Arn+v4S45GkONK4cOiky/6KHeMXtb/I0rkItz1WAwg4yC1FTITT\nl2o2fIE0Q1Azt9Ocfs+ZSpT94jhot4FNlb8qeBGEdRX4vkmFxsBkSPMSKMty7Bkh\nf0+jU/2i/EAZ3zrV0QPzIYsMmcIoMNjeAaLo04lDXlZPqpY3DJW6tgECgYEAu4PB\nCEyUcdTQCfdrNis9B1zO+bcCzZzyJqkJgmmcYUG2+8SmKZIXKWhxwrwaVP5vvhmC\nJ4wAzOXVc+zMnLXD5APGmlLp4Wm/GC/1hQb+MzFrn3t88JJbb2baO/iXui0FcoDN\n/r1G93yBsIlH8miAUID0s1lYKIyzUvKVVAlTeAECgYEAp0qyszdt8WyjAKuuXAIo\nCbIg6Y3dVZU1vjYVgiUx2IpvLQqQIv7z1USX+AXjbR+V6LwZwnJVdNumJOE4eOa4\n92UrsQKOPEvpywlqpFaZQjZ3RtXU5qEHPdbCF1eI8m4VaDHiHZqI/TUQafCY6eJy\nBqVqsV/7AWDAHXTuMJJLHZg=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-e3ts0@capstoneproject1-26a40.iam.gserviceaccount.com",
  client_id: "105639869774653271452",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e3ts0%40capstoneproject1-26a40.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://capstoneproject1-26a40.appspot.com"
});

export { admin };

export default admin.storage().bucket();

// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.
