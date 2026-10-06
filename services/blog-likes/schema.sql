CREATE TABLE IF NOT EXISTS article_likes (
  article_slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL CHECK(length(visitor_hash) = 64),
  PRIMARY KEY (article_slug, visitor_hash)
) WITHOUT ROWID;
