// Attribute constants
const DATA_URL_ATTR = "data-url";
const DATA_TITLE_ATTR = "data-title";
const DATA_LINK_ADDED = "data-jira-link-added";

// Selectors to determine issue elements
const ISSUE_SELECTORS = [
  ".ghx-issue-content > .ghx-row:first-child:not([" +
    DATA_LINK_ADDED +
    '="true"])',
  ".ghx-issue-content > .ghx-issue-fields:not([" + DATA_LINK_ADDED + '="true"])'
];

/**
 * When user clicks on the link copy button, we copy both rich and plain text
 * versions of the issue link to users clipboard. 
 */
function copyIssue(clickEvent) {
  clickEvent.preventDefault();
  clickEvent.stopPropagation();
  const element = clickEvent.target;
  const url = element.getAttribute(DATA_URL_ATTR);
  const title = element.getAttribute(DATA_TITLE_ATTR);
  function copyListener(copyEvent) {
    const htmlText = '<a href="' + url + '">' + title + "</a>";
    const plainText = title + " [" + url + "]";
    copyEvent.clipboardData.setData("text/html", htmlText);
    copyEvent.clipboardData.setData("text/plain", plainText);
    copyEvent.preventDefault();
  }
  document.addEventListener("copy", copyListener);
  document.execCommand("copy");
  document.removeEventListener("copy", copyListener);
}

/**
 * Queries the page with document.querySelectorAll to get all issue elements
 * without link copy button. Adds missing buttons.
 */
function addJiraLinkButtons() {
  const issues = document.querySelectorAll(ISSUE_SELECTORS);
  for (issue of issues) {
    const key = issue.querySelector(".ghx-key > a");
    const summary = issue.querySelector(".ghx-summary");
    const linkElement = document.createElement("span");
    linkElement.className =
      "jira-copy-link__icon aui-icon aui-icon-small aui-iconfont-link";
    linkElement.setAttribute(DATA_URL_ATTR, key.href);
    linkElement.setAttribute(DATA_TITLE_ATTR, summary.title);
    linkElement.onclick = copyIssue;
    summary.firstChild.appendChild(linkElement);
    issue.setAttribute(DATA_LINK_ADDED, true);
  }
}

// Interval to check for content changes
setInterval(() => {
  addJiraLinkButtons();
}, 5000);
