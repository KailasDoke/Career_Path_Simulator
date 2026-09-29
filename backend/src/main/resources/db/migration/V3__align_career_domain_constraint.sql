ALTER TABLE careers
    DROP CONSTRAINT IF EXISTS careers_domain_check;

UPDATE careers
SET domain = CASE title
    WHEN 'Software Engineer' THEN 'SOFTWARE_ENGINEERING'
    WHEN 'Data Scientist' THEN 'DATA'
END
WHERE domain = 'IT'
  AND title IN ('Software Engineer', 'Data Scientist');

ALTER TABLE careers
    ADD CONSTRAINT careers_domain_check
    CHECK (
        domain IS NULL
        OR domain IN (
            'SOFTWARE_ENGINEERING',
            'DATA',
            'HEALTHCARE',
            'FINANCE',
            'BUSINESS',
            'RESEARCH',
            'DESIGN',
            'ENGINEERING',
            'ENVIRONMENT'
        )
    );
