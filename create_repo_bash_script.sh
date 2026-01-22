
#!/bin/bash
# ============================================
# 🚀 GitHub Repo Automation Script (v5)
# ============================================

set -Eeuo pipefail

LOGFILE="repo_creation.log"
STATE_FILE=".script_state"

error_handler() {
    local exit_code=$?
    local last_command="${BASH_COMMAND}"
    local line_no="${BASH_LINENO[0]}"
    echo ""
    echo "❌ ERROR: Command '${last_command}' failed (exit $exit_code) at line $line_no"
    echo "$(date '+%Y-%m-%d %H:%M:%S'): ERROR ${last_command} (exit $exit_code)" >> "$LOGFILE"
    exit $exit_code
}
trap error_handler ERR

mark_done() { echo "$1" >> "$STATE_FILE"; }
is_done() { grep -qx "$1" "$STATE_FILE" 2>/dev/null; }
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') | $1" | tee -a "$LOGFILE"; }

# --------------------------------------------
# 🔐 Ensure GitHub CLI is authenticated
# --------------------------------------------
if ! gh auth status >/dev/null 2>&1; then
  echo "❌ GitHub CLI not authenticated."
  echo "➡️ Run: gh auth login"
  exit 1
fi

# --------------------------------------------
# --- INPUTS ---
# --------------------------------------------
read -p "Enter your GitHub username (NOT org): " OWNER
OWNER="$(echo "$OWNER" | tr '[:upper:]' '[:lower:]')"   # normalize case

read -p "Enter repository name: " REPO
REPO="${REPO// /-}"

read -p "Enter repository description: " DESC
read -p "Should the repository be public or private? (public/private): " VISIBILITY
read -p "Enter collaborator username (optional): " COLLAB

log "🚀 Starting repository automation for '$OWNER/$REPO'..."

# --------------------------------------------
# 🌍 Create repo on GitHub (guaranteed)
# --------------------------------------------
if ! is_done "repo_created"; then
  if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
    log "ℹ️ Repo already exists on GitHub"
  else
    log "📦 Creating GitHub repository..."
    gh repo create "$OWNER/$REPO" \
      --"$VISIBILITY" \
      --description "$DESC" \
      --confirm

    # HARD verification
    if ! gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
      echo "❌ Repo creation FAILED. Aborting."
      exit 1
    fi

    log "✅ Repo successfully created on GitHub"
  fi
  mark_done "repo_created"
fi

# --------------------------------------------
# 🌀 Init local git repo
# --------------------------------------------
if [ ! -d .git ]; then
  git init
  echo "# $REPO" > README.md
  git add .
  git commit -m "Initial commit"
  log "🌀 Local Git repo initialized"
fi

# --------------------------------------------
# 🔗 Add remote
# --------------------------------------------
if ! git remote | grep -q origin; then
  git remote add origin "https://github.com/$OWNER/$REPO.git"
  log "🔗 Remote origin added"
fi

# --------------------------------------------
# ⬆️ Push main
# --------------------------------------------
if ! is_done "main_pushed"; then
  git branch -M main
  git push -u origin main
  mark_done "main_pushed"
  log "⬆️ main branch pushed"
fi

# --------------------------------------------
# 🌿 Developer branch
# --------------------------------------------
if ! is_done "developer_branch_created"; then
  git switch developer 2>/dev/null || git checkout -b developer
  git push -u origin developer
  git switch main
  mark_done "developer_branch_created"
  log "🌿 developer branch created & pushed"
fi

# --------------------------------------------
# 👥 Add collaborator
# --------------------------------------------
if [ -n "$COLLAB" ] && ! is_done "collaborator_added"; then
  log "👥 Adding collaborator '$COLLAB'..."
  gh api -X PUT "repos/$OWNER/$REPO/collaborators/$COLLAB" \
    -f permission=push >/dev/null

  log "✅ Collaborator added"
  mark_done "collaborator_added"
fi

# --------------------------------------------
# ⚙️ Java CI/CD
# --------------------------------------------
if ! is_done "ci_cd_added"; then
  mkdir -p .github/workflows

  cat <<EOF > .github/workflows/ci.yml
name: Java CI

on:
  push:
    branches: [ main, developer ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - run: mvn -B verify
EOF

  git add .github/workflows/ci.yml
  git commit -m "Add Java Maven CI workflow"
  git push
  mark_done "ci_cd_added"
  log "⚙️ CI/CD workflow added"
fi

# --------------------------------------------
# 📘 README
# --------------------------------------------
if ! is_done "readme_updated"; then
  cat <<EOF > README.md
# $REPO

$DESC

![CI](https://github.com/$OWNER/$REPO/actions/workflows/ci.yml/badge.svg)

## Tech Stack
- Java 21
- Spring Boot
- Maven

## Run locally
\`\`\`bash
mvn spring-boot:run
\`\`\`
EOF

  git add README.md
  git commit -m "Update README"
  git push
  mark_done "readme_updated"
  log "📘 README updated"
fi

log "✅ Repository automation completed successfully"
