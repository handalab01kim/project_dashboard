CREATE TABLE public."project" (
	"id" serial NOT NULL,
	"name" varchar(32) NOT NULL,
	"client" varchar(32) NOT NULL,
	"step" varchar(32) NOT NULL,
	"period" varchar(16) NOT NULL,
	"content" varchar(64) NOT NULL,
	CONSTRAINT project_pk PRIMARY KEY (id)
);

CREATE TABLE public."task" (
	"id" serial NOT NULL,
	"task_title" varchar(32) NOT NULL,
	"step" varchar(32) NOT NULL,
	"assignee" varchar(8) NOT NULL,
	"project_id" int NOT NULL,
	CONSTRAINT task_pk PRIMARY KEY (id),
    CONSTRAINT fk_project FOREIGN KEY ("project_id") REFERENCES public.project(id) ON DELETE CASCADE
);

CREATE TABLE public."project_status" (
	"id" serial NOT NULL,
	"sales" NUMERIC(6,4) NOT NULL, -- 매출액: 억 단위(00.0000)
	"is_finished" boolean NOT NULL default false,
	"project_id" int NOT NULL,
	CONSTRAINT status_pk PRIMARY KEY (id),
    CONSTRAINT fk_project FOREIGN KEY ("project_id") REFERENCES public.project(id) ON DELETE CASCADE
);

CREATE TABLE public."issue" (
	"id" serial NOT NULL,
	"is_finished" boolean NOT NULL default false,
	"project_id" int NOT NULL,
	"content" varchar(64),
	CONSTRAINT issue_pk PRIMARY KEY (id),
    CONSTRAINT fk_project FOREIGN KEY ("project_id") REFERENCES public.project(id) ON DELETE CASCADE
);