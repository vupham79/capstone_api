import axios from "../utils/axios";

export async function getUserPages(access_token) {
  const data = await axios({
    params: { locale: "en_US ", access_token: access_token },
    url:
      process.env.facebookAPI +
      "me?fields=accounts{category,name,id,access_token, picture, link}"
  });
  return data.data;
}

export async function getSyncEvent({ pageId, access_token }) {
  const data = await axios({
    params: {
      fields:
        "events{id,name,description,place,is_canceled,end_time,start_time,cover}",
      locale: "en_US",
      access_token
    },
    url: process.env.facebookAPI + pageId
  });
  return data.data;
}

export async function getSyncData({ pageId, access_token }) {
  const data = await axios({
    params: {
      fields:
        "cover,phone,category_list,about,genre," +
        "location,single_line_address,albums{picture,link}," +
        "posts{message,created_time,attachments{title,media_type,subattachments,media,target}}",
      locale: "en_US",
      access_token
    },
    url: process.env.facebookAPI + pageId
  });
  return data.data;
}

export async function getPageData({ pageId, access_token }) {
  const data = await axios({
    params: {
      fields:
        "name,cover,phone,category_list,picture,about,genre," +
        "location,single_line_address,albums{picture,link}," +
        "posts{message,created_time,attachments{title,media_type,subattachments,media,target}}," +
        "events{id,name,description,place,is_canceled,end_time,start_time,cover}",
      locale: "en_US",
      access_token
    },
    url: process.env.facebookAPI + pageId
  });
  return data.data;
}
