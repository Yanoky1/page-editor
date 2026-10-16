# Page Editor

Page Editor lets you select a text element on a web page and replace its text locally in your browser. Saved rules are applied again when you reload the site, which is useful for recording demos without exposing real names, email addresses, IDs, or other sensitive details.

Page Editor only changes what is rendered in your browser. It does not modify the website or its data.

## Install from a ZIP (unpacked extension)

1. Download and extract `page-masker.zip` to a permanent folder.
2. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the extracted `page-masker` folder (the one containing `manifest.json`).

Keep that folder in place. The browser loads the extension from it.

## Install a release packaged as `.crx.zip`

Use this method only if a release specifically provides a file such as `Page-Masker.crx.zip`:

1. Download the `.crx.zip` file.
2. Remove only the final `.zip` suffix, leaving a file named `Page-Masker.crx`.
3. Open the browser's extensions page and turn on **Developer mode**.
4. Drag the `.crx` file onto the extensions page and confirm the installation if prompted.

The archive must contain a genuine, signed CRX package. Renaming a regular ZIP containing the extension files to `.crx` does not convert it into a CRX package. The `page-masker.zip` source archive uses the **Load unpacked** method above.

## Use

1. Open the site you want to record.
2. Click the Page Editor toolbar button, then choose **Pick an element**.
3. Click the text element you want to mask. Press **Escape** to cancel picking.
4. Open Page Editor again, enter the replacement text, and save the rule.
5. Reload the page to confirm the replacement. Manage or delete saved rules from the extension popup.

Rules are matched by site hostname and CSS selector. They and their replacement text are stored locally using the browser's extension storage.

## Limitations

- Page Editor replaces an element's visible text; it does not edit the server response or the site's stored data.
- If a site re-renders the element, Page Editor observes page changes and reapplies the replacement.
- Sites that frequently change their page structure may require choosing a more specific or stable element.
- Browser-internal pages and extension-store pages cannot be modified. Elements inside some iframes or shadow DOMs may not be selectable.
- If you select a large container, its nested markup is replaced along with its text. Prefer selecting the smallest element containing only the sensitive text.
