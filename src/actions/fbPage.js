import axios from "../utils/axios";

export async function getFacebookPageInfo(
  url = "HandsSG",
  access_token = "EAAIwerCGOR8BADemA3Caf1oza4tniFP07eSuG78SYIgsdRp5wJDhfylOf2dY7pXYZCerSgpzjcdVDA42pcSR7FKfhxAigPF0wb6G3qXJOrkDCp6qhEleRkiLhEIGSVHoUGRNiHdpKRbpzeDgrITJF4LtyAZCEKhdSq2GXuSE7vOGEN2RrZBDpsvVWBZBYX4ZD"
) {
  const data = await axios({
    params: {
      fields: "about,category,posts{full_picture,message}",
      access_token
    },
    url
  });
  return data;
}

export async function getFacebookPageToken(
  url = "me/accounts",
  access_token = "EAAHpaPrJZCCsBANXRdCbo2iZA7WM97x48AubUkON27U5O6YF64AuuIajNcWHzJxuYkrRUijSZCdAVJZCOPxQ4vZCbQSFNkCGsB1CAHZBNUw2L0GMH7zqYyZCOc7JHr5DnnkLmrPPr9UJia5Ls6AA7Y3lGyye03siGlXiZCw1UgrjyqpMDUbhdI4LHWKtGBxKwWY1BUt8j2M7Sg4YlgukpymZA2zOsgwod2woZD"
) {
  const data = await axios({
    params: {
      access_token
    },
    url
  });
  return data;
}

export async function getFacebookPages(access_token) {
  const data = await axios({
    params: {
      access_token
    },
    url: "me?fields=accounts{picture{url},name,category_list}"
  });
  return data;
}
