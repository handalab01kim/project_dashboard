-- CREATE TABLE public."client"
-- (
--     "idx"  serial      NOT NULL,
--     "name" varchar(32) NOT NULL,
--     CONSTRAINT client_pk PRIMARY KEY (idx)
-- );
-- CREATE TABLE public."assignee"
-- (
--     "idx"  serial      NOT NULL,
--     "name" varchar(16) NOT NULL,
--     CONSTRAINT assignee_pk PRIMARY KEY (idx)
-- );



CREATE TABLE public."project"
(
    "idx"        serial      NOT NULL,
    "name"       varchar(32) NOT NULL unique,
    "client"  varchar(64),
--     "step"       varchar(32) NOT NULL, -- latest history
    "start_date" date        NOT NULL,
    "end_date"   date        NOT NULL,
--     "content"    varchar(64) NOT NULL,
    CONSTRAINT project_pk PRIMARY KEY (idx)
    -- CONSTRAINT fk_client FOREIGN KEY ("client_id") REFERENCES public.client (idx) ON DELETE SET NULL
);

CREATE TABLE public."task"
(
    "idx"        serial      NOT NULL,
    "name"       varchar(32) NOT NULL,
    "step"       varchar(32) NOT NULL,
    "assignee"   varchar(32) NOT NULL,
    "start_date" date        NOT NULL,
    "end_date"   date        NOT NULL,
    "project_id" int         NOT NULL,
    "content" text,
    CONSTRAINT task_pk PRIMARY KEY (idx),
    CONSTRAINT fk_project FOREIGN KEY ("project_id") REFERENCES public.project (idx) ON DELETE CASCADE
);

CREATE TABLE public."project_history"
(
    "idx" serial NOT NULL,
    "project_id" int NOT NULL,
    "content" VARCHAR(64) NOT NULL
);


-- CREATE TABLE public."project_status" (
-- 	"idx" serial NOT NULL,
-- 	"sales" NUMERIC(6,4) NOT NULL, -- 매출액: 억 단위(00.0000)
-- 	"is_finished" boolean NOT NULL default false,
-- 	"project_id" int NOT NULL,
-- 	CONSTRAINT status_pk PRIMARY KEY (idx),
--     CONSTRAINT fk_project FOREIGN KEY ("project_id") REFERENCES public.project(idx) ON DELETE CASCADE
-- );

-- CREATE TABLE public."issue"
-- (
--     "idx"         serial  NOT NULL,
--     "is_finished" boolean NOT NULL default false,
--     "project_id"  int     NOT NULL,
--     "content"     varchar(64),
--     CONSTRAINT issue_pk PRIMARY KEY (idx),
--     CONSTRAINT fk_project FOREIGN KEY ("project_id") REFERENCES public.project (idx) ON DELETE CASCADE
-- );


-- CREATE TABLE public."project_client"
-- (
--     "project_id" int NOT NULL,
--     "client_id"  int NOT NULL,
--     CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.project (idx) ON DELETE CASCADE,
--     CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES public.client (idx) ON DELETE CASCADE
-- );
-- CREATE TABLE public."task_assignee"
-- (
--     "task_id"     int NOT NULL,
--     "assignee_id" int NOT NULL,
--     CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES public.task (idx) ON DELETE CASCADE,
--     CONSTRAINT fk_assignee FOREIGN KEY (assignee_id) REFERENCES public.assignee (idx) ON DELETE CASCADE
-- );


-- dummy
-- insert into client(name) values('EGGTEC'), ('NSK');
-- insert into assignee(name) values('김도균'), ('김영일'), ('박희원'), ('조성현');

insert into project(name, client, start_date, end_date)
values ('창원 SMVS 6CH', 'NSK', '2025.02.11','2025.09.20'),
       ('오물란 검사기', 'EGGTEC', '2025.02.11','2025.09.20');
insert into task(name, step, assignee, start_date, end_date, project_id)
values ('카메라 셋업 및 학습 영상 확보', '완료', '조성현', '2025.05.17','2025.05.27', 1),
       ('카메라 셋업 및 학습 영상 확보2', '이슈 대응 중', '조성현', '2025.05.17','2025.05.18', 1),
       ('카메라 셋업 및 학습 영상 확보3', '진행중', '조성현', '2025.05.24','2025.05.25', 1),
       ('카메라 셋업 및 학습 영상 확보4', '진행중', '조성현', '2025.05.25','2025.05.25', 1),
       ('카메라 셋업 및 학습 영상 확보5', '진행중', '조성현', '2025.05.01','2025.05.30', 1);
-- insert into task_assignee(task_id, assignee_id) values(1,1), (2,4);
insert into project_history(project_id, content) values(1, '발주'), (2, '발주');
-- insert into project_status(sales, is_finished, project_id) values
-- (1.75, false, 1),
-- (0.8, true, 2);
--
-- insert into issue(is_finished, project_id)
-- values (false, 1),
--        (true, 2);
