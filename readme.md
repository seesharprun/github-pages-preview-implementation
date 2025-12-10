# GitHub Pages preview deployment demo

A sample project demonstrating automated staging preview deployments for GitHub Pages using GitHub Actions. This implementation allows you to preview changes from pull requests on dedicated staging URLs before merging to the main site.

## 🌟 Features

- **Automated Preview Deployments**: Each pull request gets its own preview URL
- **Staging Branch Architecture**: Isolated staging branch stores preview sites
- **Automatic Cleanup**: Preview sites are removed when pull requests are closed
- **Live Site Aggregation**: Main site and all active previews are aggregated and deployed together
- **PR Comments**: Automatic comments with preview links on pull requests
- **Theme Switching**: Demo site includes light/dark theme toggle with localStorage persistence

## 🏗️ Architecture

This project uses a three-branch deployment strategy:

### Branch structure

1. **`main`** - Production source code
   - Contains the actual website source files
   - Triggers full site deployment on push

2. **`staging`** - Preview storage branch
   - Stores preview sites in `_staging/{commit-sha}/` directories
   - Each preview includes metadata JSON file with PR details
   - Modified only by automated workflows

3. **`live`** - Deployment branch
   - Aggregates main site + all staging previews
   - Source for GitHub Pages deployment
   - Updated by aggregation workflow

### Workflow files

#### 1. `continuous-deployment-preview.yml`
Triggered on PR events (opened, synchronize, reopened):
- Builds preview content from PR branch
- Commits preview to `staging` branch in `_staging/{short-sha}/`
- Creates metadata file with PR number and commit info
- Triggers aggregation workflow
- Posts comment on PR with preview URL

#### 2. `continuous-deployment-cleanup.yml`
Triggered when PR is closed:
- Finds all preview directories for the closed PR
- Removes them from `staging` branch
- Triggers aggregation workflow
- Posts cleanup confirmation comment

#### 3. `continuous-deployment-aggregate.yml`
Triggered manually or by preview/cleanup workflows:
- Copies main site content to `_site/`
- Copies all previews from `staging` branch to `_site/_staging/`
- Commits aggregated site to `live` branch
- Deploys to GitHub Pages

## 🚀 Setup

### Prerequisites

- GitHub repository with GitHub Pages enabled
- Repository permissions configured for workflows

### Configuration steps

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"
   - Note your GitHub Pages URL

2. **Configure Workflow Permissions**
   - Go to Settings → Actions → General
   - Under "Workflow permissions", select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

3. **Deploy the Workflows**
   - Copy the three workflow files to `.github/workflows/`
   - Push to `main` branch
   - The first push will create the `live` branch

4. **Test with a Pull Request**
   - Create a new branch and make changes
   - Open a pull request to `main`
   - Check the PR comments for the preview URL

## 📁 Project structure

```plaintext
.
├── .github/
│   └── workflows/
│       ├── continuous-deployment-preview.yml    # PR preview generation
│       ├── continuous-deployment-cleanup.yml     # PR preview cleanup
│       └── continuous-deployment-aggregate.yml   # Site aggregation & deployment
├── index.html                                    # Main website content
├── theme.js                                      # Theme switching logic
└── readme.md                                     # This file
```

## 🔄 Workflow diagram

```mermaid
PR Opened/Updated
      ↓
[Preview Workflow]
      ↓
Build preview → Commit to staging → Trigger aggregation
      ↓                                    ↓
Comment on PR                    [Aggregate Workflow]
                                          ↓
                         Copy main + previews → Deploy to Pages
                                          ↓
                                   Preview URL live

PR Closed
      ↓
[Cleanup Workflow]
      ↓
Remove preview from staging → Trigger aggregation → Comment on PR
                                      ↓
                            [Aggregate Workflow]
                                      ↓
                         Update live site (preview removed)
```

## 🌐 Preview URL structure

- **Main Site**: `https://{owner}.github.io/{repo}/`
- **Preview Site**: `https://{owner}.github.io/{repo}/_staging/{short-sha}/`

Each preview URL includes the first 7 characters of the commit SHA for uniqueness.

## 🎨 Demo website

The included demo is a simple responsive card page built with:

- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind
- **Vanilla JavaScript**: Theme persistence with localStorage

Features:

- Light/dark theme toggle
- Responsive layout
- Icon integration with Heroicons
- Clean card-based design

## 🔧 Customization

### Modify build process

Edit the "Build preview content" step in `continuous-deployment-preview.yml`:

```yaml
- name: Build preview content
  run: |
    mkdir -p preview_build/${{ steps.staging.outputs.staging_dir }}
    # Add your build commands here
    # npm install && npm run build
    cp index.html theme.js preview_build/${{ steps.staging.outputs.staging_dir }}/
```

### Change preview path structure

Modify the `staging_dir` variable in the "Set staging directory" step:

```yaml
STAGING_DIR="_previews/pr-${{ github.event.pull_request.number }}"
```

### Adjust comment format

Edit the PR comment body in both preview and cleanup workflows.

## 📊 Monitoring

- **Actions Tab**: View workflow runs and logs
- **Branches**: Check `staging` and `live` branch contents
- **PR Comments**: Preview URLs and status updates

## 🐛 Troubleshooting

### Preview not appearing

- Check Actions tab for workflow failures
- Verify `staging` branch exists and has content
- Ensure aggregation workflow completed successfully
- Allow 1-2 minutes for Pages deployment

### Permissions errors

- Confirm workflow permissions are set to "Read and write"
- Check that Actions can create/approve PRs (if enabled)

### Old previews not cleaned up

- Verify cleanup workflow triggered on PR close
- Check `staging` branch for orphaned directories
- Manually trigger aggregation workflow if needed

## 📝 License

This is a demonstration project. Use and modify as needed for your projects.

## 🤝 Contributing

This is a sample project for demonstration purposes. Feel free to fork and adapt for your own use cases.

---

**Built with ❤️ and 🤖 to demonstrate GitHub Actions and Pages workflows**
