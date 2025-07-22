Write-Host "=== Pharma Recruitment Configuration ===" -ForegroundColor Cyan
Write-Host ""

# Get Supabase info
Write-Host "Enter your Supabase information:" -ForegroundColor Yellow
$url = Read-Host "Supabase Project URL"
$key = Read-Host "Supabase Anon Key"
$pwd = Read-Host "Admin Password"

# Create env file
@"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$key

# Admin Password
ADMIN_PASSWORD=$pwd
"@ | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "Created .env.local file" -ForegroundColor Green
Write-Host ""
Write-Host "=== Copy these to Railway ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT_PUBLIC_SUPABASE_URL=$url"
Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY=$key"  
Write-Host "ADMIN_PASSWORD=$pwd"
Write-Host ""

$github = Read-Host "Open GitHub to create repository? (Y/N)"
if ($github -eq "Y") {
    Start-Process "https://github.com/new"
}
