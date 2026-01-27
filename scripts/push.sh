#!/bin/bash
# scripts/push.sh - Custom Gemini CLI command for auto-commit and push

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Staging changes...${NC}"
git add .

# Get the diff of staged changes
echo -e "${YELLOW}Generating commit message from changes...${NC}"
DIFF=$(git diff --cached)

if [ -z "$DIFF" ]; then
  echo -e "${RED}No changes to commit${NC}"
  exit 1
fi

# Use Gemini CLI to generate detailed commit message
COMMIT_MESSAGE=$(gemini run generate_commit_message \
  "$(echo "$DIFF")" \
  --output-format text)

# Handle empty commit message
if [ -z "$COMMIT_MESSAGE" ] || [ "$COMMIT_MESSAGE" = "null" ]; then
  echo -e "${RED}Failed to generate commit message${NC}"
  exit 1
fi

echo -e "${YELLOW}Generated commit message:${NC}"
echo -e "${GREEN}${COMMIT_MESSAGE}${NC}"
echo ""

# Commit with generated message
git commit -m "$COMMIT_MESSAGE"

echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push

echo -e "${GREEN}✓ Changes successfully committed and pushed!${NC}"
