-- Create the posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  visibility VARCHAR(50) DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);

