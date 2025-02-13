-- Modificar la columna date de timestamptz a text
ALTER TABLE public.events 
ALTER COLUMN date TYPE text;
