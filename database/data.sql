INSERT INTO "users" (
  "username",
  "firstName",
  "lastName",
  "email",
  "password"
) VALUES (
  'johndoe',
  'John',
  'Doe',
  'johndoe@email.com',
  'password'
), (
  'harrypotter',
  'Harry',
  'Potter',
  'harrypotter@hogwarts.com',
  'password'
);

INSERT INTO "exerciseTypes" (
  "type"
) VALUES
  ('Bike'),
  ('Crossfit'),
  ('H.I.I.T'),
  ('Hike'),
  ('Lift Weights'),
  ('Pilates'),
  ('Run'),
  ('Swim'),
  ('Walk'),
  ('Yoga');

INSERT INTO "groups" (
  "groupName",
  "betAmount",
  "frequencyReq",
  "intervalReq",
  "durationReq",
  "passQty"
) VALUES (
  'Hogwarts',
  5,
  2,
  'Weekly',
  30,
  2
);

INSERT INTO "groupUsers" (
  "groupId",
  "userId",
  "passQty",
  "remainingPasses"
) VALUES (
  1,
  1,
  2,
  2
), (
  1,
  2,
  2,
  2
);
