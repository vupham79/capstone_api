import axios from "../utils/axios";
import bucket from "../utils/firebase";
import { insertTheme } from "../actions/themeDB";
import { insertHomePageImage } from "../actions/homePageImageDB";
import { insertImage } from "../actions/imageDB";
import { insertPost } from "../actions/postDB";
import { insertSite } from "../actions/siteDB";
import { insertUser } from "../actions/userDB";
import { insertVideo } from "../actions/videoDB";

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
  });
  return data.data;
}

export async function getUserPages(access_token) {
  const data = await axios({
    params: { locale: "en_US ", access_token: access_token },
    url:
      process.env.facebookAPI +
      "me?fields=accounts{category,name,id,access_token, picture, link}"
  });
  return data.data;
}

export async function getPageImage(id) {
  try {
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    };
    const data = await bucket.file("Pagevamp.png").getSignedUrl(options);
    console.log(data);
  } catch (error) {
    console.log("error: ", error);
  }
}

export async function uploadPageImage(id) {
  try {
    bucket.file("new.png").createWriteStream();
    console.log(data);
  } catch (error) {
    console.log("error: ", error);
  }
}

export async function downloadPageImage(id) {
  try {
    // download
    const data = await bucket.file("Pagevamp.png").download({
      destination: "src/assets"
    });
  } catch (error) {
    console.log("error: ", error);
  }
}

export async function confirmPage({ access_token, pageId }) {
  const data = await axios({
    params: {
      fields:
        "about,category,posts{full_picture,message},events,cover,videos{permalink_url},location,single_line_address," +
        "phone,photos{link,images,album,picture,webp_images}",
      locale: "en_US ",
      access_token
    },
    url: process.env.facebookAPI + pageId
  });
  return data.data;
}
