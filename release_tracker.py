import re
import requests
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime, timedelta

# Constants
GITHUB_API_URL = "https://api.github.com"
REPO_OWNER = "pharmeasy"
REPO_NAME = "pharmeasy-web-next"
TOKEN = ""

REPOS = [
    {
        "owner": "pharmeasy",
        "name": "pharmeasy-web-next",
        "main_branch": "main",
        "beta_branch": "beta"
    },
    {
        "owner": "pharmeasy",
        "name": "pharmeasy-web",
        "main_branch": "master",
        "beta_branch": "beta"
    },
    # Add more repos as needed
]



HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
}

# Google Sheets Setup
SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
SHEET_ID = '1Z70RTq6AAJRfHLntliC7I7POXWKzIf6DFASKjXnW1D8'

# Regex patterns
JIRA_LINK_REGEX = r"\[JIRA-LINK\]\((https://pharmeasy.atlassian\.net/browse/[A-Z]+-\d+)\)"
PR_NUMBER_REGEX = r"#(\d+)"

def get_merged_prs(target_branch):
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls"
    params = {
        "state": "closed",
        "base": target_branch,
        "per_page": 100
    }
    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    prs = response.json()
    return [pr for pr in prs if pr.get("merged_at")]

def get_pr_details(pr_number):
    url = f"{GITHUB_API_URL}/repos/{REPO_OWNER}/{REPO_NAME}/pulls/{pr_number}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    return None

def extract_pr_numbers_from_description(description):
    if not description:
        return []
    return re.findall(PR_NUMBER_REGEX, description)

def extract_jira_link(pr_body):
    if not pr_body:
        return "N/A"
    match = re.search(JIRA_LINK_REGEX, pr_body)
    if match:
        full_url = match.group(1)
        # Extract the ticket number (e.g., WEB-5504) from the URL
        ticket_number = full_url.split('/')[-1]
        # Return both the ticket number and full URL for hyperlinking
        return f"=HYPERLINK(\"{full_url}\", \"{ticket_number}\")"
    return "N/A"

def get_pr_url(pr_number):
    return f"https://github.com/{REPO_OWNER}/{REPO_NAME}/pull/{pr_number}"

def format_datetime_indian(utc_timestamp):
    if not utc_timestamp:
        return "N/A"
    
    try:
        # Convert UTC string to datetime object and add 5:30 hours for IST
        utc_dt = datetime.strptime(utc_timestamp, "%Y-%m-%dT%H:%M:%SZ")
        indian_time = utc_dt + timedelta(hours=5, minutes=30)
        
        # Format using strftime with custom formatting
        return indian_time.strftime("%d %b %Y, %I:%M %p")
    except Exception as e:
        print(f"Error formatting date {utc_timestamp}: {str(e)}")
        return "N/A"

def get_sprint_name(date_str):
    if not date_str or date_str == "N/A":
        return "N/A"
    
    try:
        # Convert string to datetime
        date_obj = datetime.strptime(date_str, "%d %b %Y, %I:%M %p")
        
        # Get month name and day
        month = date_obj.strftime("%B")  # Full month name
        day = date_obj.day
        
        # Determine sprint (S1: 1-15, S2: 16-end)
        sprint = "S1" if day <= 15 else "S2"
        
        return f"{month} {sprint}"
    except Exception as e:
        print(f"Error determining sprint for date {date_str}: {str(e)}")
        return "N/A"

def get_existing_pr_numbers(worksheet):
    """Get all existing PR numbers from the sheet to avoid duplicates"""
    try:
        # Get all values from the sheet
        all_values = worksheet.get_all_values()
        
        # Skip header row and get both feature and release PR numbers
        existing_prs = set()
        for row in all_values[1:]:  # Skip header row
            if len(row) >= 4:  # Make sure row has enough columns
                feature_pr = row[3].replace('#', '').strip()  # Feature PR column
                if feature_pr.isdigit():
                    existing_prs.add(feature_pr)
        return existing_prs
    except Exception as e:
        print(f"Error getting existing PRs: {str(e)}")
        return set()

def write_to_sheet(release_data):
    credentials = Credentials.from_service_account_file(
        'credentials.json',
        scopes=SCOPES
    )
    drive_client = gspread.authorize(credentials)
    sheet = drive_client.open_by_key(SHEET_ID)
    worksheet = sheet.sheet1

    # Get existing PR numbers
    existing_prs = get_existing_pr_numbers(worksheet)
    
    # Headers
    headers = [
        "Sprint",
        "JIRA Link",
        "Feature Title",
        "Feature PR Number",
        "Feature Branch",
        "Feature Author",
        "Release PR Number",
        "Release Title",
        "Release Merged At",
    ]

    # Get existing data
    existing_data = worksheet.get_all_values()
    rows = [headers] if not existing_data else existing_data

    # Prepare new rows
    new_rows = []
    for data in release_data:
        # Skip if PR already exists
        if str(data['feature_pr_number']) in existing_prs:
            print(f"Skipping PR #{data['feature_pr_number']} - already exists in sheet")
            continue

        # Format timestamps
        release_merged_at = format_datetime_indian(data["release_merged_at"])
        
        # Determine sprint
        sprint = get_sprint_name(release_merged_at)
        
        # Create hyperlinks for PR numbers
        feature_pr_link = f"=HYPERLINK(\"{get_pr_url(data['feature_pr_number'])}\", \"#{data['feature_pr_number']}\")"
        release_pr_link = f"=HYPERLINK(\"{get_pr_url(data['release_pr_number'])}\", \"#{data['release_pr_number']}\")"
        
        new_rows.append([
            sprint,
            data["jira_link"],
            data["feature_title"],
            feature_pr_link,
            data["feature_branch"],
            data["feature_author"],
            release_pr_link,
            data["release_title"],
            release_merged_at,
        ])

    if new_rows:
        # Append only new rows to existing data
        worksheet.append_rows(
            new_rows,
            value_input_option='USER_ENTERED'
        )
        print(f"Added {len(new_rows)} new entries to the sheet")
    else:
        print("No new entries to add")

def main():
    # Get PRs merged to main from beta
    beta_to_main_prs = get_merged_prs("main")
    release_data = []
    today_ist = datetime.utcnow() + timedelta(hours=5, minutes=30)
    today_str = today_ist.strftime("%Y-%m-%d")  # Format: 'YYYY-MM-DD'
    print(f"Processing PRs merged today ({today_str}) IST...")

    print("PRs found:", beta_to_main_prs)

    for main_pr in beta_to_main_prs:
        merged_at = main_pr.get("merged_at")
        if not merged_at:
            continue
        # Convert merged_at to IST
        merged_dt = datetime.strptime(merged_at, "%Y-%m-%dT%H:%M:%SZ") + timedelta(hours=5, minutes=30)
        merged_date_str = merged_dt.strftime("%Y-%m-%d")
        
        # Check if merged today
        if merged_date_str != today_str:
            continue

        if main_pr["head"]["ref"].startswith("beta"):
            print(f"\nProcessing Release PR #{main_pr['number']}")
            print("Release PR Description:", main_pr["body"])
            
            # Extract PR numbers directly from the release PR description
            feature_pr_numbers = extract_pr_numbers_from_description(main_pr["body"])
            print(f"Found PR numbers in description: {feature_pr_numbers}")
            
            for pr_number in feature_pr_numbers:
                feature_pr = get_pr_details(pr_number)
                if feature_pr:
                    release_data.append({
                        "jira_link": extract_jira_link(feature_pr["body"]),
                        "feature_title": feature_pr["title"],
                        "release_pr_number": main_pr["number"],
                        "release_title": main_pr["title"],
                        "release_merged_at": main_pr["merged_at"],
                        "feature_pr_number": pr_number,
                        "feature_branch": feature_pr["head"]["ref"],
                        "feature_author": feature_pr["user"]["login"],
                        "feature_merged_at": feature_pr["merged_at"],
                        
                    })
                    print(f"Added data for PR #{pr_number}")

    if release_data:
        write_to_sheet(release_data)
        print(f"\nSuccessfully processed {len(release_data)} PRs")
    else:
        print("\nNo release data found")

if __name__ == "__main__":
    main()
