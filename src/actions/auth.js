import { User } from '../models'

export const login = () => {
  const user = await User.findOne({
    id: profile.id
  })
  if (user) {
    await User.updateOne(
      {
        id: profile.id
      },
      {
        accessToken: accessToken
      },
      function(err, user) {
        if (err) {
          done(err);
        } else {
          req.user = {
            ...user,
            accessToken
          };
          done(null, user);
        }
      }
    );
  } else {
    await User.create(
      {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails && profile.emails[0].value,
        accessToken: accessToken,
        picture: `${process.env.facebookAPI}/${profile.id}/picture?type=large`
      },
      function(err, user) {
        if (err) {
          done(err);
        } else {
          req.user = {
            ...user,
            accessToken
          };
          done(null, user);
        }
      }
    );
  }
}
