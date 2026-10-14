#!/bin/bash
# Sync changes to GitHub and Vercel automatically
git add .
COMMIT_MSG="${1:-Update AQ Coaching app}"
git commit -m "$COMMIT_MSG" || echo "No changes to commit"
git push origin main
