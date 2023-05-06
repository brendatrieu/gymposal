set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "public"."users" (
	"userId" serial NOT NULL,
	"username" TEXT NOT NULL UNIQUE,
	"firstName" TEXT NOT NULL,
	"lastName" TEXT NOT NULL,
  "fullName" TEXT GENERATED ALWAYS AS ("firstName" || ' ' || "lastName") STORED,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "dateJoined" TIMESTAMP NOT NULL DEFAULT now(),
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."groups" (
	"groupId" serial NOT NULL,
	"groupName" TEXT NOT NULL,
	"betAmount" DECIMAL,
	"frequencyReq" int NOT NULL,
	"intervalReq" TEXT NOT NULL DEFAULT 'Weekly',
	"durationReq" int NOT NULL,
	"passQty" int,
	"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "inviteLink" TEXT  GENERATED ALWAYS AS ("groupId"::text || '/' || REPLACE(encodeURI("groupName"), '''', '%27')) STORED,
	CONSTRAINT "groups_pk" PRIMARY KEY ("groupId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."exercises" (
	"exerciseId" serial NOT NULL UNIQUE,
	"userId" int NOT NULL,
	"typeId" int NOT NULL,
	"type" TEXT NOT NULL,
  "totalMinutes" int NOT NULL,
	"date" TIMESTAMP NOT NULL,
  "week" int NOT NULL,
  "month" int NOT NULL
	CONSTRAINT "exercises_pk" PRIMARY KEY ("exerciseId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."groupUsers" (
	"groupId" int NOT NULL,
	"userId" int NOT NULL,
	"passQty" int,
	"remainingPasses" int,
  "activeDate" TIMESTAMP NOT NULL,
  "active" BOOLEAN NOT NULL,
	CONSTRAINT "groupUsers_pk" PRIMARY KEY ("groupId","userId")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."penalties" (
	"groupId" int NOT NULL,
	"userId" int NOT NULL,
	"date" TIMESTAMP NOT NULL DEFAULT now(),
  "status" TEXT NOT NULL DEFAULT 'Open',
  "week" int NOT NULL,
  "year" int NOT NULL,
  "penaltyId" TEXT GENERATED ALWAYS AS ("groupId"::text || "userId"::text || "week"::text || "year"::text) STORED UNIQUE
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."exerciseTypes" (
	"typeId" serial NOT NULL,
	"type" TEXT NOT NULL,
	CONSTRAINT "exerciseTypes_pk" PRIMARY KEY ("typeId")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "exercises" ADD CONSTRAINT "exercises_fk0" FOREIGN KEY ("userId") REFERENCES "users"("userId");
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_fk1" FOREIGN KEY ("typeId") REFERENCES "exerciseTypes"("typeId");

ALTER TABLE "groupUsers" ADD CONSTRAINT "groupUsers_fk0" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId");
ALTER TABLE "groupUsers" ADD CONSTRAINT "groupUsers_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");

ALTER TABLE "penalties" ADD CONSTRAINT "penalties_fk0" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId");
ALTER TABLE "penalties" ADD CONSTRAINT "penalties_fk1" FOREIGN KEY ("userId") REFERENCES "users"("userId");
