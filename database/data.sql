insert into "users" (
  "username",
  "firstName",
  "lastName",
  "email",
  "password"
) values (
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

insert into "exerciseTypes" (
  "type"
) values
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

insert into "groups" (
  "groupName",
  "betAmount",
  "frequencyReq",
  "intervalReq",
  "durationReq",
  "passQty"
) values (
  'Hogwarts',
  5,
  2,
  7,
  30,
  2
);
