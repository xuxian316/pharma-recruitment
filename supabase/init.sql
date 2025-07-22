-- 创建职位表
CREATE TABLE IF NOT EXISTS job_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  layer TEXT NOT NULL,
  node_id TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新记录表
CREATE TABLE IF NOT EXISTS update_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_name TEXT,
  records_count INTEGER,
  industry TEXT DEFAULT 'all'
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_job_positions_industry ON job_positions(industry);
CREATE INDEX IF NOT EXISTS idx_job_positions_layer ON job_positions(layer);
CREATE INDEX IF NOT EXISTS idx_job_positions_urgency ON job_positions(urgency);
CREATE INDEX IF NOT EXISTS idx_job_positions_created_at ON job_positions(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_positions_updated_at
  BEFORE UPDATE ON job_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 启用 RLS (Row Level Security)
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE update_history ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许匿名用户读取
CREATE POLICY "Allow anonymous read access" ON job_positions
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read history" ON update_history
  FOR SELECT USING (true);

-- 创建策略：只允许服务端更新（需要 service_role key）
CREATE POLICY "Allow service role insert" ON job_positions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role update" ON job_positions
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role delete" ON job_positions
  FOR DELETE USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role insert history" ON update_history
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 插入初始更新记录
INSERT INTO update_history (file_name, records_count, industry)
VALUES ('initial_setup', 0, 'all')
ON CONFLICT DO NOTHING;
