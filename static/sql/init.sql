--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE database_admin;
ALTER ROLE database_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:KSNrR1E0BDL7h0NnAiu0zw==$gR4LA7/WcA54fzraXaWA5fmNkD4+y0MeGT+3dEcJE5c=:rl8ZNTnIsXGysWYtzyxHXJU2S40ZrQ6XjOT/LKMnZSE=';
CREATE ROLE wishlist_admin;
ALTER ROLE wishlist_admin WITH SUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:SGEVp3zG+w0oDUhAR5W+ww==$kLDP51N7qH5vOOerIqVZ8Om/3CzOriG8JaxSNAg4YE4=:h5tJEhBd/++8jhQeZpMURMzQ7uKgyMVOrFmpl3K1xbg=';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

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

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

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

--
-- PostgreSQL database dump complete
--

--
-- Database "wishlist" dump
--

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

--
-- Name: wishlist; Type: DATABASE; Schema: -; Owner: database_admin
--

CREATE DATABASE wishlist WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE wishlist OWNER TO database_admin;

\connect wishlist

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: bind_lover(character varying, character varying); Type: FUNCTION; Schema: public; Owner: database_admin
--

CREATE FUNCTION public.bind_lover(client_id_var character varying, lover_id_var character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
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
  $$;


ALTER FUNCTION public.bind_lover(client_id_var character varying, lover_id_var character varying) OWNER TO database_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client; Type: TABLE; Schema: public; Owner: database_admin
--

CREATE TABLE public.client (
    id integer NOT NULL,
    tgid character varying(10) NOT NULL,
    username character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    uuid uuid DEFAULT public.uuid_generate_v4()
);


ALTER TABLE public.client OWNER TO database_admin;

--
-- Name: client_id_seq; Type: SEQUENCE; Schema: public; Owner: database_admin
--

CREATE SEQUENCE public.client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.client_id_seq OWNER TO database_admin;

--
-- Name: client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: database_admin
--

ALTER SEQUENCE public.client_id_seq OWNED BY public.client.id;


--
-- Name: client_lover; Type: TABLE; Schema: public; Owner: database_admin
--

CREATE TABLE public.client_lover (
    client_id integer,
    lover_id integer
);


ALTER TABLE public.client_lover OWNER TO database_admin;

--
-- Name: shops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shops (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.shops OWNER TO postgres;

--
-- Name: shops_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shops_id_seq OWNER TO postgres;

--
-- Name: shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shops_id_seq OWNED BY public.shops.id;


--
-- Name: trans; Type: TABLE; Schema: public; Owner: database_admin
--

CREATE TABLE public.trans (
    client_id integer,
    wish_id integer
);


ALTER TABLE public.trans OWNER TO database_admin;

--
-- Name: wish; Type: TABLE; Schema: public; Owner: database_admin
--

CREATE TABLE public.wish (
    id integer NOT NULL,
    client_id integer,
    created_at timestamp with time zone NOT NULL,
    bought_at timestamp with time zone,
    img_url character varying(255),
    is_given boolean,
    title character varying(255),
    try integer,
    price numeric,
    href character varying(255) NOT NULL,
    hostname character varying(255) NOT NULL
);


ALTER TABLE public.wish OWNER TO database_admin;

--
-- Name: wish_id_seq; Type: SEQUENCE; Schema: public; Owner: database_admin
--

CREATE SEQUENCE public.wish_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wish_id_seq OWNER TO database_admin;

--
-- Name: wish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: database_admin
--

ALTER SEQUENCE public.wish_id_seq OWNED BY public.wish.id;


--
-- Name: client id; Type: DEFAULT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.client ALTER COLUMN id SET DEFAULT nextval('public.client_id_seq'::regclass);


--
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shops_id_seq'::regclass);


--
-- Name: wish id; Type: DEFAULT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.wish ALTER COLUMN id SET DEFAULT nextval('public.wish_id_seq'::regclass);


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: database_admin
--

COPY public.client (id, tgid, username, created_at, uuid) FROM stdin;
19	174055421	Sergey Khramov	2022-01-11 05:48:35.325891+00	bfd62d66-2314-426c-ad3b-d70e23cfe2de
\.


--
-- Data for Name: client_lover; Type: TABLE DATA; Schema: public; Owner: database_admin
--

COPY public.client_lover (client_id, lover_id) FROM stdin;
\.


--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shops (id, title, created_at) FROM stdin;
2	www.ozon.ru	2022-01-11 06:33:54.10724+00
\.


--
-- Data for Name: trans; Type: TABLE DATA; Schema: public; Owner: database_admin
--

COPY public.trans (client_id, wish_id) FROM stdin;
\.


--
-- Data for Name: wish; Type: TABLE DATA; Schema: public; Owner: database_admin
--

COPY public.wish (id, client_id, created_at, bought_at, img_url, is_given, title, try, price, href, hostname) FROM stdin;
\.


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: database_admin
--

SELECT pg_catalog.setval('public.client_id_seq', 19, true);


--
-- Name: shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shops_id_seq', 2, true);


--
-- Name: wish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: database_admin
--

SELECT pg_catalog.setval('public.wish_id_seq', 54, true);


--
-- Name: client client_pkey; Type: CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.client
    ADD CONSTRAINT client_pkey PRIMARY KEY (id);


--
-- Name: shops shops_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_id_key UNIQUE (id);


--
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (title);


--
-- Name: wish wish_pkey; Type: CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.wish
    ADD CONSTRAINT wish_pkey PRIMARY KEY (id);


--
-- Name: client_lover client_lover_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.client_lover
    ADD CONSTRAINT client_lover_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: client_lover client_lover_lover_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.client_lover
    ADD CONSTRAINT client_lover_lover_id_fkey FOREIGN KEY (lover_id) REFERENCES public.client(id);


--
-- Name: trans trans_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.trans
    ADD CONSTRAINT trans_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- Name: trans trans_wish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.trans
    ADD CONSTRAINT trans_wish_id_fkey FOREIGN KEY (wish_id) REFERENCES public.wish(id);


--
-- Name: wish wish_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: database_admin
--

ALTER TABLE ONLY public.wish
    ADD CONSTRAINT wish_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.client(id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

