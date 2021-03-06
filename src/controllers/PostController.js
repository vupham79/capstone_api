import { activePost } from "../services/PostService";

export async function activePosts(req, res) {
  const { posts } = req.body;
  try {
    const activeList = posts.filter(post => post.isActive === true);
    const deactiveList = posts.filter(post => post.isActive === false);

    const update = await activePost({
      activeList: activeList && activeList.length > 0 ? activeList : null,
      deactiveList:
        deactiveList && deactiveList.length > 0 ? deactiveList : null
    });
    if (update) {
      return res.status(200).send(posts);
    }
    return res.status(400).send({ error: "Update failed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
}
