import axios from "../utils/axios";

export async function getFacebookPageInfo() {
  const data = await axios({
    params: {
      fields: "about,category,posts{full_picture,message}",
      access_token:
        "EAAMIaToJEsABAMbxhs2cwrKbBeSouKnwoRqNgBBkZAJ8EoYZCx0aOnGS2QBMx25NwFILvHtZAZAaVDXseY0YZAyU1mIbI4rj4rsFjAVr5OI05r09JMK15lprF9PNtGGOqP2GrtYoMggWItXyB3VE4hVANjfkR9h0icXkXieV2yMSWEMqZBLPuWw0OVWAN7wGhVrCcs7ZBrRkwZDZD"
    },
    url: "1138168126514171"
  });
}
