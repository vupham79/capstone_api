import { Theme, Category } from "../models";

export async function insertTheme(body) {
  const themeResult = await Theme.findOne({ name: body.name });
  let insert = null;
  if (!themeResult) {
    let category = await Category.findOne({ _id: body.category });
    console.log(body);
    insert = await Theme.create({
      name: body.name,
      fontTitle: body.fontTitle ? body.fontTitle : "Arial",
      fontBody: body.fontBody ? body.fontBody : "Arial",
      mainColor: body.mainColor ? body.mainColor : "#1474D4",
      previewImage: body.previewImage,
      category: category,
      isOnePage: body.isOnePage,
      isDeleted: false,
    });
  } else {
    let category = await Category.findOne({ _id: body.category });
    insert = await Theme.updateOne(
      {
        name: body.name,
      },
      {
        fontTitle: body.fontTitle ? body.fontTitle : "Arial",
        fontBody: body.fontBody ? body.fontBody : "Arial",
        mainColor: body.mainColor ? body.mainColor : "#1474D4",
        previewImage: body.previewImage,
        category: category,
        isOnePage: body.isOnePage,
        isDeleted: false,
      }
    );
  }
  return insert;
}

export async function editTheme(id, body) {
  let category = await Category.findOne({ _id: body.category });
  const edit = await Theme.updateOne(
    { _id: id },
    {
      name: body.name,
      fontTitle: body.fontTitle ? body.fontTitle : "Arial",
      fontBody: body.fontBody ? body.fontBody : "Arial",
      mainColor: body.color ? body.color : "#1474D4",
      previewImage: body.previewImage,
      category: category,
      isOnePage: body.isOnePage,
    }
  );
  return edit;
}

export async function findAllTheme() {
  return await Theme.find({ isDeleted: false }).populate("category");
}

export async function findOneTheme(id) {
  return await Theme.findOne({ _id: id });
}

export async function deleteTheme(id) {
  return await Theme.updateOne({ _id: id }, { isDeleted: true });
}
