import axios from "../utils/axios";

export async function getFacebookPageInfo() {
  const data = await axios({
    params: {
      fields: "about,category,posts{full_picture,message}",
      access_token:
        "EAAIwerCGOR8BADemA3Caf1oza4tniFP07eSuG78SYIgsdRp5wJDhfylOf2dY7pXYZCerSgpzjcdVDA42pcSR7FKfhxAigPF0wb6G3qXJOrkDCp6qhEleRkiLhEIGSVHoUGRNiHdpKRbpzeDgrITJF4LtyAZCEKhdSq2GXuSE7vOGEN2RrZBDpsvVWBZBYX4ZD"
    },
    url: "HandsSG"
  });
}
