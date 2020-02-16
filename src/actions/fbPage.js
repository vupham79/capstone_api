import axios from "../utils/axios";
import admin from "firebase-admin";
import firebase from "../utils/firebase";
require("dotenv").config();

export async function getFirebaseStorage() {
  // const image = firebase
  //   .storage("gs://capstoneproject1-26a40.appspot.com/")
  //   .ref("Pagevamp.png");
  // console.log(image);
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
  });
}

export async function getFacebookPageInfo(
  url = process.env.facebookAPI + "103983364470143",
  access_token = "EAAMIaToJEsABAJamPcK1HTMjohvIlHBKs7Qm70o0nWjoxr4KJNlvhnKHd3cPVpHDcGcXGSSeslZBCdevMNVH2oV2EB8r745itylZAZCE2q5dhI3KPHWZC7PWhbNfTuvVm5FH0jUOwfKV98ZBOO8SCaGZCQP0fsVwYRtVYyyiw0e3wsConN3uckHxlAHwfYh5cZD"
) {
  const data = await axios({
    params: {
      fields: "about,category,posts{full_picture,message},events,photos,cover",
      locale: "en_US ",
      access_token
    },
    url
  });
  return data.data;
}

export async function getFacebookPageToken(
  url = process.env.facebookAPI + "me/accounts",
  access_token = "EAAMIaToJEsABAJamPcK1HTMjohvIlHBKs7Qm70o0nWjoxr4KJNlvhnKHd3cPVpHDcGcXGSSeslZBCdevMNVH2oV2EB8r745itylZAZCE2q5dhI3KPHWZC7PWhbNfTuvVm5FH0jUOwfKV98ZBOO8SCaGZCQP0fsVwYRtVYyyiw0e3wsConN3uckHxlAHwfYh5cZD"
) {
  const data = await axios({
    params: {
      locale: "en_US ",
      access_token
    },
    url
  });
  return data.data;
}

export async function getFacebookPages(access_token) {
  const data = await axios({
    params: { locale: "en_US ", access_token },
    url: process.env.facebookAPI + "me?fields=accounts{data}"
    // "me?fields=accounts{picture{url},name,category_list}"
  });
  return data.data;
}
