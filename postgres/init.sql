CREATE TABLE public."project" (
	"id" serial NOT NULL,
	"name" varchar(32) NOT NULL,
	"client" varchar(32) NOT NULL,
	"step" varchar(32) NOT NULL,
	"period" varchar(32) NOT NULL,
	"content" varchar(64) NOT NULL,
	CONSTRAINT project_pk PRIMARY KEY (id)
);

CREATE TABLE public."task" (
	"id" serial NOT NULL,
	"name" varchar(32) NOT NULL,
	"step" varchar(32) NOT NULL,
	"assignee" varchar(16) NOT NULL,
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

-- dummy
insert into project(name,client,step,period,content) values('창원 SMVS 6CH', 'NSK', '발주 03/31', '25.02.11~25.09.20', 'BOM 발주 진행 중'),('오물란 검사기', 'EGGTEC', '납품완료 03/31', '25.02.11~25.09.20', 'BOM 발주 진행 중');
insert into task(name, step, assignee, project_id) values('카메라 셋업 및 학습 영상 확보', '완료', '조성현', 1),('카메라 셋업 및 학습 영상 확보', '이슈 대응 중', '조성현', 1);

insert into project_status(sales, is_finished, project_id) values
(1.75, false, 1),
(0.8, true, 2);

insert into issue(is_finished, project_id) values
(false, 1),
(true, 2);
