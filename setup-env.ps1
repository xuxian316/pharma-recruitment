# Supabase 和 Railway 配置助手脚本

Write-Host "=== Pharma Recruitment 部署配置助手 ===" -ForegroundColor Cyan
Write-Host ""

# 获取 Supabase 信息
Write-Host "请输入您的 Supabase 信息（从 Supabase 控制台获取）：" -ForegroundColor Yellow
$supabaseUrl = Read-Host "Supabase Project URL (例如: https://xxxxx.supabase.co)"
$supabaseKey = Read-Host "Supabase Anon Key (eyJhbGci... 开头的长字符串)"

# 获取管理员密码
Write-Host ""
Write-Host "设置管理员密码：" -ForegroundColor Yellow
$adminPassword = Read-Host "管理员密码（至少6位）"

# 创建 .env.local 文件
$envContent = @"
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey

# 管理员密码
ADMIN_PASSWORD=$adminPassword
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host ""
Write-Host "[OK] Created .env.local file" -ForegroundColor Green

# 显示 Railway 环境变量（用于复制粘贴）
Write-Host ""
Write-Host "=== Railway 环境变量 ===" -ForegroundColor Cyan
Write-Host "请将以下内容复制到 Railway 的环境变量设置中：" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl" -ForegroundColor White
Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseKey" -ForegroundColor White
Write-Host "ADMIN_PASSWORD=$adminPassword" -ForegroundColor White
Write-Host ""

# 提示下一步
Write-Host "=== 下一步操作 ===" -ForegroundColor Cyan
Write-Host "1. 完成 Supabase 设置（运行 SQL 脚本，创建存储桶）" -ForegroundColor White
Write-Host "2. 将代码推送到 GitHub" -ForegroundColor White
Write-Host "3. 在 Railway 中部署项目" -ForegroundColor White
Write-Host ""

# 询问是否打开 GitHub
$openGithub = Read-Host "是否打开 GitHub 创建仓库？(Y/N)"
if ($openGithub -eq "Y" -or $openGithub -eq "y") {
    Start-Process "https://github.com/new"
}

Write-Host ""
Write-Host "配置完成！祝您部署顺利！" -ForegroundColor Green
