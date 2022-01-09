--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.0 (Debian 14.0-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.client (
    id integer NOT NULL,
    tgid character varying(10) NOT NULL,
    lover_tgid character varying(10),
    username character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.client OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO postgres;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: trans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trans (
    client_id integer,
    wish_id integer
);


ALTER TABLE public.trans OWNER TO postgres;

--
-- Name: wish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wish (
    id integer NOT NULL,
    client_id integer,
    title character varying(255) NOT NULL,
    price numeric NOT NULL,
    href character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    bought_at timestamp with time zone,
    img_url character varying(255)
);


ALTER TABLE public.wish OWNER TO postgres;

--
-- Name: wish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wish_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wish_id_seq OWNER TO postgres;

--
-- Name: wish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wish_id_seq OWNED BY public.wish.id;


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: wish id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish ALTER COLUMN id SET DEFAULT nextval('public.wish_id_seq'::regclass);


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.client (id, tgid, lover_tgid, username, created_at) FROM stdin;
\.


--
-- Data for Name: trans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trans (client_id, wish_id) FROM stdin;
\.


--
-- Data for Name: wish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wish (id, client_id, title, price, href, created_at, bought_at, img_url) FROM stdin;
\.


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.client_id_seq', 6, true);


--
-- Name: wish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wish_id_seq', 8, true);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: wish wish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish
    ADD CONSTRAINT wish_pkey PRIMARY KEY (id);


--
-- Name: trans trans_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trans
    ADD CONSTRAINT trans_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: trans trans_wish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trans
    ADD CONSTRAINT trans_wish_id_fkey FOREIGN KEY (wish_id) REFERENCES public.wish(id);


--
-- Name: wish wish_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wish
    ADD CONSTRAINT wish_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Custom functions
--

CREATE OR REPLACE FUNCTION bind_lover(client_id_var varchar, lover_id_var varchar) returns boolean as $$
  BEGIN
  IF NOT EXISTS (SELECT 1 FROM client_lover cl
    WHERE cl.client_id = (SELECT id FROM client c WHERE c.tgid = client_id_var)
    AND cl.lover_id = (SELECT id FROM client c WHERE c.tgid = lover_id_var)
  )
  THEN
      INSERT INTO client_lover (
        client_id,
        lover_id
      ) VALUES (
        (SELECT id FROM client WHERE tgid = client_id_var),
        (SELECT id FROM client WHERE tgid = lover_id_var)
      );
      INSERT INTO client_lover (
        client_id,
        lover_id
      ) VALUES (
        (SELECT id FROM client WHERE tgid = lover_id_var),
        (SELECT id FROM client WHERE tgid = client_id_var)
      );
      RETURN true;
  ELSE
      RETURN false;
  END IF;
  END
  $$ language plpgsql;
--
-- PostgreSQL database dump complete
--

