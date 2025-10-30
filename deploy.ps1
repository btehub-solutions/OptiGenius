# OptiGenius Deployment Script for Windows PowerShell
# This script helps you prepare and deploy to GitHub/Vercel

Write-Host "🚀 OptiGenius Deployment Helper" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
Write-Host "📋 Checking Git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "📦 Current branch and remote:" -ForegroundColor Yellow
git branch -v
git remote -v

Write-Host ""
Write-Host "🔍 Checking for uncommitted changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  You have uncommitted changes:" -ForegroundColor Red
    git status --short
    Write-Host ""
    $commit = Read-Host "Do you want to commit these changes? (y/n)"
    
    if ($commit -eq "y" -or $commit -eq "Y") {
        Write-Host ""
        $message = Read-Host "Enter commit message"
        git add .
        git commit -m "$message"
        Write-Host "✅ Changes committed!" -ForegroundColor Green
    }
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 Ready to push to GitHub?" -ForegroundColor Yellow
Write-Host "Repository: https://github.com/btehub-solutions/OptiGenius" -ForegroundColor Cyan
$push = Read-Host "Push to GitHub now? (y/n)"

if ($push -eq "y" -or $push -eq "Y") {
    Write-Host ""
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed. Please check your credentials and try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ GitHub Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Sign in with GitHub" -ForegroundColor White
Write-Host "3. Import 'btehub-solutions/OptiGenius'" -ForegroundColor White
Write-Host "4. Configure environment variables (see GITHUB_DEPLOYMENT_SETUP.md)" -ForegroundColor White
Write-Host "5. Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full guide: GITHUB_DEPLOYMENT_SETUP.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Don't forget to set these environment variables in Vercel:" -ForegroundColor Yellow
Write-Host "   - DATABASE_URL (from Vercel Postgres)" -ForegroundColor White
Write-Host "   - DIRECT_URL (from Vercel Postgres)" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL (your Vercel app URL)" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)" -ForegroundColor White
Write-Host "   - OPENAI_API_KEY (from OpenAI platform)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Good luck with your deployment!" -ForegroundColor Green
